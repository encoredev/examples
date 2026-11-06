package agent

import (
	"context"
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"strings"
	"sync"
	"time"

	"encore.dev/beta/auth"
	"encore.dev/beta/errs"
	"encore.dev/rlog"
	"golang.org/x/time/rate"
	"google.golang.org/adk/v2/agent"
	"google.golang.org/adk/v2/session"
	"google.golang.org/genai"
)

// maxMessageLen caps the size of a chat message.
const maxMessageLen = 4000

// turnTimeout caps how long one agent turn can run.
const turnTimeout = 60 * time.Second

// busy holds the users with a turn in progress. It is in memory, so the limit is per instance.
var busy sync.Map

// limiters holds a rate limiter per user: 10 turns a minute with a burst of 3.
// Like busy, it is in memory, so the limit is per instance.
var limiters sync.Map

func allowTurn(uid auth.UID) bool {
	l, _ := limiters.LoadOrStore(uid, rate.NewLimiter(rate.Every(time.Minute/10), 3))
	return l.(*rate.Limiter).Allow()
}

type ChatParams struct {
	SessionID string `json:"session_id"`
	Message   string `json:"message"`
}

type Event struct {
	ID       string          `json:"id"`
	Author   string          `json:"author"`
	Text     string          `json:"text,omitempty"`
	ToolCall string          `json:"tool_call,omitempty"`
	ToolArgs json.RawMessage `json:"tool_args,omitempty"`
	ToolResp json.RawMessage `json:"tool_response,omitempty"`
	Partial  bool            `json:"partial,omitempty"`
	Time     time.Time       `json:"time"`
}

type ChatResponse struct {
	SessionID string   `json:"session_id"`
	Mode      string   `json:"mode"`
	Reply     string   `json:"reply"`
	Events    []*Event `json:"events"`
}

// Chat runs one agent turn and returns the final reply.
//
//encore:api auth method=POST path=/agent/chat
func (s *Service) Chat(ctx context.Context, p *ChatParams) (*ChatResponse, error) {
	resp := &ChatResponse{Mode: s.mode, Events: []*Event{}}
	sid, err := s.turn(ctx, p, agent.StreamingModeNone, func(e *Event) error {
		resp.Events = append(resp.Events, e)
		if e.Author != "user" && e.Text != "" {
			resp.Reply = e.Text
		}
		return nil
	})
	if err != nil && sid != "" {
		return nil, withSession(err, sid)
	}
	resp.SessionID = sid
	return resp, err
}

// SessionDetails is returned in error details when a turn fails after its session
// was created, so the client can retry in the same session.
type SessionDetails struct {
	SessionID string `json:"session_id"`
}

func (SessionDetails) ErrDetails() {}

// withSession returns a copy of err with the session ID in its details.
func withSession(err error, sid string) error {
	e := *errs.Convert(err).(*errs.Error)
	if e.Code == errs.Unknown {
		e.Code = errs.Internal
	}
	e.Details = SessionDetails{SessionID: sid}
	return &e
}

// ChatStream runs one agent turn and streams events as server-sent events.
//
//encore:api auth raw method=POST path=/agent/chat/stream
func (s *Service) ChatStream(w http.ResponseWriter, req *http.Request) {
	var p ChatParams
	req.Body = http.MaxBytesReader(w, req.Body, 64<<10)
	if err := json.NewDecoder(req.Body).Decode(&p); err != nil {
		http.Error(w, "invalid body", http.StatusBadRequest)
		return
	}
	if err := checkMessage(p.Message); err != nil {
		errs.HTTPError(w, err)
		return
	}
	flusher, _ := w.(http.Flusher)
	w.Header().Set("Content-Type", "text/event-stream")
	w.Header().Set("Cache-Control", "no-cache")
	started := false
	send := func(name string, v any) {
		started = true
		b, _ := json.Marshal(v)
		fmt.Fprintf(w, "event: %s\ndata: %s\n\n", name, b)
		if flusher != nil {
			flusher.Flush()
		}
	}
	sid, err := s.turn(req.Context(), &p, agent.StreamingModeSSE, func(e *Event) error {
		send("event", e)
		return nil
	})
	if err != nil && !started && sid == "" {
		// No session yet, so return a normal HTTP error (e.g. 429 when busy).
		w.Header().Del("Content-Type")
		errs.HTTPError(w, err)
		return
	} else if err != nil {
		// Include the session ID so a retry continues the same session.
		send("error", map[string]string{"message": err.Error(), "session_id": sid})
		return
	}
	send("done", map[string]string{"session_id": sid, "mode": s.mode})
}

func (s *Service) turn(ctx context.Context, p *ChatParams, mode agent.StreamingMode, onEvent func(*Event) error) (string, error) {
	if err := checkMessage(p.Message); err != nil {
		return "", err
	}
	uid, _ := auth.UserID()
	if !allowTurn(uid) {
		return "", &errs.Error{Code: errs.ResourceExhausted, Message: "rate limit exceeded"}
	}
	if _, running := busy.LoadOrStore(uid, true); running {
		return "", &errs.Error{Code: errs.ResourceExhausted, Message: "a turn is already running"}
	}
	defer busy.Delete(uid)

	// The tools call the notes service with this ctx, so the call carries the caller's auth.
	ctx, cancel := context.WithTimeout(ctx, turnTimeout)
	defer cancel()

	if p.SessionID == "" {
		// Cap stored sessions per user. The count comes from the database, so it holds across instances.
		var count int
		if err := db.QueryRow(ctx, `SELECT count(*) FROM session_summaries WHERE user_id = $1`, string(uid)).Scan(&count); err != nil {
			return "", err
		}
		if count >= maxSessions {
			return "", &errs.Error{Code: errs.ResourceExhausted, Message: "session limit reached"}
		}
		created, err := s.sessions.Create(ctx, &session.CreateRequest{AppName: appName, UserID: string(uid)})
		if err != nil {
			return "", err
		}
		p.SessionID = created.Session.ID()
		if err := createSummary(ctx, string(uid), p.SessionID, p.Message); err != nil {
			// Without a summary the session can't be listed or pruned, so remove it.
			del := &session.DeleteRequest{AppName: appName, UserID: string(uid), SessionID: p.SessionID}
			if derr := s.sessions.Delete(context.WithoutCancel(ctx), del); derr != nil {
				rlog.Error("delete session", "session_id", p.SessionID, "err", derr)
			}
			return "", err
		}
	} else if _, err := s.session(ctx, string(uid), p.SessionID); err != nil {
		return "", err
	}
	msg := genai.NewContentFromText(p.Message, genai.RoleUser)
	for ev, err := range s.runner.Run(ctx, string(uid), p.SessionID, msg, agent.RunConfig{StreamingMode: mode}) {
		if err != nil {
			return p.SessionID, err
		}
		if err := onEvent(toEvent(ev)); err != nil {
			return p.SessionID, err
		}
	}
	// The turn is already saved, so summary and publish errors are logged rather than
	// returned. Returning them would make clients retry and run the same turn twice.
	// A failed update only leaves the turn count stale until the subscriber recounts it,
	// and updated_at stale until the next turn. The title was written when the session
	// was created.
	if err := touchSummary(ctx, string(uid), p.SessionID); err != nil {
		rlog.Error("update session summary", "session_id", p.SessionID, "err", err)
	}
	if _, err := TurnCompleted.Publish(ctx, &TurnEvent{UserID: string(uid), SessionID: p.SessionID}); err != nil {
		rlog.Error("publish turn-completed", "session_id", p.SessionID, "err", err)
	}
	return p.SessionID, nil
}

func checkMessage(m string) error {
	if strings.TrimSpace(m) == "" {
		return &errs.Error{Code: errs.InvalidArgument, Message: "message is required"}
	}
	if len(m) > maxMessageLen {
		return &errs.Error{Code: errs.InvalidArgument, Message: "message is too long"}
	}
	return nil
}

// session loads a session owned by the user. Sessions are keyed by app, user and ID,
// so another user's session ID returns not found.
func (s *Service) session(ctx context.Context, uid, id string) (session.Session, error) {
	got, err := s.sessions.Get(ctx, &session.GetRequest{AppName: appName, UserID: uid, SessionID: id})
	if errors.Is(err, session.ErrNotFound) {
		return nil, &errs.Error{Code: errs.NotFound, Message: "session not found"}
	} else if err != nil {
		return nil, err
	}
	return got.Session, nil
}

func toEvent(ev *session.Event) *Event {
	e := &Event{ID: ev.ID, Author: ev.Author, Partial: ev.Partial, Time: ev.Timestamp}
	if ev.Content == nil {
		return e
	}
	if ev.Content.Role == genai.RoleUser && ev.Author == "" {
		e.Author = "user"
	}
	for _, part := range ev.Content.Parts {
		switch {
		case part.FunctionCall != nil:
			e.ToolCall = part.FunctionCall.Name
			e.ToolArgs, _ = json.Marshal(part.FunctionCall.Args)
		case part.FunctionResponse != nil:
			e.ToolCall = part.FunctionResponse.Name
			e.ToolResp, _ = json.Marshal(part.FunctionResponse.Response)
		default:
			e.Text += part.Text
		}
	}
	return e
}

type SessionInfo struct {
	ID        string    `json:"id"`
	Title     string    `json:"title"`
	Turns     int       `json:"turns"`
	UpdatedAt time.Time `json:"updated_at"`
}

type ListSessionsResponse struct {
	Sessions []*SessionInfo `json:"sessions"`
}

// maxSessions caps how many sessions a user can keep, and maxHistory how many events history returns.
const (
	maxSessions = 50
	maxHistory  = 100
)

// ListSessions lists the caller's most recently updated sessions from the summaries,
// so no session events are loaded.
//
//encore:api auth method=GET path=/agent/sessions
func (s *Service) ListSessions(ctx context.Context) (*ListSessionsResponse, error) {
	uid, _ := auth.UserID()
	rows, err := db.Query(ctx, `
		SELECT session_id, title, turns, updated_at FROM session_summaries
		WHERE user_id = $1 ORDER BY updated_at DESC LIMIT $2`, string(uid), maxSessions)
	if err != nil {
		return nil, err
	}
	defer rows.Close()
	out := &ListSessionsResponse{Sessions: []*SessionInfo{}}
	for rows.Next() {
		info := &SessionInfo{}
		if err := rows.Scan(&info.ID, &info.Title, &info.Turns, &info.UpdatedAt); err != nil {
			return nil, err
		}
		out.Sessions = append(out.Sessions, info)
	}
	return out, rows.Err()
}

type HistoryResponse struct {
	SessionID string   `json:"session_id"`
	Events    []*Event `json:"events"`
}

// History returns the most recent events of one of the caller's sessions.
//
//encore:api auth method=GET path=/agent/sessions/:id
func (s *Service) History(ctx context.Context, id string) (*HistoryResponse, error) {
	uid, _ := auth.UserID()
	got, err := s.sessions.Get(ctx, &session.GetRequest{AppName: appName, UserID: string(uid), SessionID: id, NumRecentEvents: maxHistory})
	if errors.Is(err, session.ErrNotFound) {
		return nil, &errs.Error{Code: errs.NotFound, Message: "session not found"}
	} else if err != nil {
		return nil, err
	}
	out := &HistoryResponse{SessionID: id, Events: []*Event{}}
	for ev := range got.Session.Events().All() {
		out.Events = append(out.Events, toEvent(ev))
	}
	return out, nil
}

type StatusResponse struct {
	Mode string `json:"mode"`
}

// Status reports whether the agent is using Gemini or the mock model.
//
//encore:api public method=GET path=/agent/status
func (s *Service) Status(ctx context.Context) (*StatusResponse, error) {
	return &StatusResponse{Mode: s.mode}, nil
}
