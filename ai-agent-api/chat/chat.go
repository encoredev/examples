// Service chat provides a conversational AI chat API with session management.
package chat

import (
	"context"
	"time"

	"encore.app/ai"
	"encore.dev/beta/errs"
	"encore.dev/storage/sqldb"
	"github.com/google/uuid"
)

var db = sqldb.NewDatabase("chat", sqldb.DatabaseConfig{
	Migrations: "./migrations",
})

// SendRequest is the request to send a chat message.
type SendRequest struct {
	Message   string  `json:"message"`
	SessionID *string `json:"session_id,omitempty"`
}

// SendResponse is the response from sending a chat message.
type SendResponse struct {
	SessionID string `json:"session_id"`
	Response  string `json:"response"`
}

// Send sends a message and gets an AI response.
// If no session_id is provided, a new conversation session is created.
//
//encore:api public method=POST path=/chat
func Send(ctx context.Context, req *SendRequest) (*SendResponse, error) {
	// Create a new session if none provided.
	isNew := req.SessionID == nil || *req.SessionID == ""
	sid := ""
	if isNew {
		sid = uuid.New().String()
	} else {
		sid = *req.SessionID
	}

	if isNew {
		_, err := db.Exec(ctx, `INSERT INTO sessions (id) VALUES ($1)`, sid)
		if err != nil {
			return nil, err
		}
	}

	// Store the user message.
	_, err := db.Exec(ctx, `
		INSERT INTO messages (session_id, role, content)
		VALUES ($1, 'user', $2)
	`, sid, req.Message)
	if err != nil {
		return nil, err
	}

	// Load conversation history for context.
	rows, err := db.Query(ctx, `
		SELECT role, content FROM messages
		WHERE session_id = $1
		ORDER BY created_at ASC
	`, sid)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var history []ai.Message
	for rows.Next() {
		var m ai.Message
		if err := rows.Scan(&m.Role, &m.Content); err != nil {
			return nil, err
		}
		history = append(history, m)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	// Call the AI service to generate a response.
	aiResp, err := ai.Complete(ctx, &ai.CompleteRequest{Messages: history})
	if err != nil {
		return nil, err
	}

	// Store the assistant response.
	_, err = db.Exec(ctx, `
		INSERT INTO messages (session_id, role, content)
		VALUES ($1, 'assistant', $2)
	`, sid, aiResp.Content)
	if err != nil {
		return nil, err
	}

	return &SendResponse{SessionID: sid, Response: aiResp.Content}, nil
}

// MessageResponse represents a message in a conversation.
type MessageResponse struct {
	Role      string `json:"role"`
	Content   string `json:"content"`
	CreatedAt string `json:"created_at"`
}

// HistoryResponse is the response for getting conversation history.
type HistoryResponse struct {
	Messages []MessageResponse `json:"messages"`
}

// History gets the full conversation history for a session.
//
//encore:api public method=GET path=/chat/:sessionID
func History(ctx context.Context, sessionID string) (*HistoryResponse, error) {
	var exists bool
	err := db.QueryRow(ctx, `SELECT EXISTS(SELECT 1 FROM sessions WHERE id = $1)`, sessionID).Scan(&exists)
	if err != nil {
		return nil, err
	}
	if !exists {
		return nil, &errs.Error{Code: errs.NotFound, Message: "session not found"}
	}

	rows, err := db.Query(ctx, `
		SELECT role, content, created_at
		FROM messages
		WHERE session_id = $1
		ORDER BY created_at ASC
	`, sessionID)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var messages []MessageResponse
	for rows.Next() {
		var m MessageResponse
		var t time.Time
		if err := rows.Scan(&m.Role, &m.Content, &t); err != nil {
			return nil, err
		}
		m.CreatedAt = t.Format(time.RFC3339)
		messages = append(messages, m)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &HistoryResponse{Messages: messages}, nil
}

// Session represents a conversation session.
type Session struct {
	ID        string `json:"id"`
	CreatedAt string `json:"created_at"`
}

// ListSessionsResponse is the response for listing sessions.
type ListSessionsResponse struct {
	Sessions []Session `json:"sessions"`
}

// ListSessions lists all conversation sessions.
//
//encore:api public method=GET path=/chat
func ListSessions(ctx context.Context) (*ListSessionsResponse, error) {
	rows, err := db.Query(ctx, `
		SELECT id, created_at FROM sessions
		ORDER BY created_at DESC
	`)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var sessions []Session
	for rows.Next() {
		var s Session
		var t time.Time
		if err := rows.Scan(&s.ID, &t); err != nil {
			return nil, err
		}
		s.CreatedAt = t.Format(time.RFC3339)
		sessions = append(sessions, s)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}

	return &ListSessionsResponse{Sessions: sessions}, nil
}

