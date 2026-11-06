package agent

import (
	"context"
	"errors"
	"time"

	"encore.dev/beta/auth"
	"encore.dev/cron"
	"encore.dev/pubsub"
	"encore.dev/rlog"
	"google.golang.org/adk/v2/session"
)

type TurnEvent struct {
	UserID    string
	SessionID string
}

// TurnCompleted is published after every agent turn.
var TurnCompleted = pubsub.NewTopic[*TurnEvent]("turn-completed", pubsub.TopicConfig{
	DeliveryGuarantee: pubsub.AtLeastOnce,
})

// Recounts each session's turns off the request path. turn() already updates the summary
// synchronously, so a late, repeated or lost event changes nothing visible. Slower
// follow-up work for a turn would go here.
var _ = pubsub.NewSubscription(TurnCompleted, "session-turns", pubsub.SubscriptionConfig[*TurnEvent]{
	Handler: countTurns,
})

func countTurns(ctx context.Context, e *TurnEvent) error {
	_, err := db.Exec(ctx, `
		UPDATE session_summaries SET turns = (
			SELECT count(*) FROM events
			WHERE app_name = $1 AND user_id = $2 AND session_id = $3 AND author = 'user'
		) WHERE session_id = $3`, appName, e.UserID, e.SessionID)
	return err
}

// touchSummary records that the session was used and recounts its turns.
func touchSummary(ctx context.Context, uid, sid string) error {
	if _, err := db.Exec(ctx, `UPDATE session_summaries SET updated_at = now() WHERE session_id = $1`, sid); err != nil {
		return err
	}
	return countTurns(ctx, &TurnEvent{UserID: uid, SessionID: sid})
}

// createSummary titles a new session from its first message.
func createSummary(ctx context.Context, uid, sid, message string) error {
	title := message
	if r := []rune(title); len(r) > 60 {
		title = string(r[:60])
	}
	_, err := db.Exec(ctx, `INSERT INTO session_summaries (session_id, user_id, title) VALUES ($1, $2, $3)`, sid, uid, title)
	return err
}

// Deletes sessions with no activity for 30 days.
var _ = cron.NewJob("prune-sessions", cron.JobConfig{
	Title:    "Delete idle agent sessions",
	Every:    24 * cron.Hour,
	Endpoint: PruneSessions,
})

type PruneResponse struct {
	Deleted int `json:"deleted"`
}

//encore:api private
func (s *Service) PruneSessions(ctx context.Context) (*PruneResponse, error) {
	cutoff := time.Now().Add(-30 * 24 * time.Hour)
	rows, err := db.Query(ctx, `SELECT session_id, user_id FROM session_summaries WHERE updated_at < $1`, cutoff)
	if err != nil {
		return nil, err
	}
	type key struct{ sid, uid string }
	var stale []key
	for rows.Next() {
		var k key
		if err := rows.Scan(&k.sid, &k.uid); err != nil {
			rows.Close()
			return nil, err
		}
		stale = append(stale, k)
	}
	rows.Close()
	if err := rows.Err(); err != nil {
		return nil, err
	}
	deleted := 0
	for _, k := range stale {
		ok, err := s.pruneSession(ctx, k.uid, k.sid, cutoff)
		if err != nil {
			return nil, err
		}
		if ok {
			deleted++
		}
	}
	rlog.Info("pruned sessions", "count", deleted)
	return &PruneResponse{Deleted: deleted}, nil
}

// pruneSession deletes one idle session. It takes the user's busy slot so a turn can't
// run between the recheck and the delete. Like the turn limit, this is per instance.
func (s *Service) pruneSession(ctx context.Context, uid, sid string, cutoff time.Time) (bool, error) {
	if _, running := busy.LoadOrStore(auth.UID(uid), true); running {
		return false, nil
	}
	defer busy.Delete(auth.UID(uid))

	// The summary can lag behind the session, so recheck the session itself before deleting.
	got, err := s.sessions.Get(ctx, &session.GetRequest{AppName: appName, UserID: uid, SessionID: sid})
	if err == nil && got.Session.LastUpdateTime().After(cutoff) {
		return false, nil
	}
	if err != nil && !errors.Is(err, session.ErrNotFound) {
		return false, err
	}
	if err == nil {
		if err := s.sessions.Delete(ctx, &session.DeleteRequest{AppName: appName, UserID: uid, SessionID: sid}); err != nil {
			return false, err
		}
	}
	if _, err := db.Exec(ctx, `DELETE FROM session_summaries WHERE session_id = $1`, sid); err != nil {
		return false, err
	}
	return true, nil
}
