package chat

import (
	"context"
	"encoding/json"
	"log"
	"sync"
	"time"

	"github.com/cockroachdb/errors"
	"github.com/gorilla/websocket"

	"encore.dev/rlog"
)

// Example copied and adapted from
// https://github.com/gorilla/websocket/tree/main/examples/chat
const (
	// Time allowed to write a message to the peer.
	writeWait = 10 * time.Second

	// Time allowed to read the next pong message from the peer.
	pongWait = 60 * time.Second

	// Send pings to peer with this period. Must be less than pongWait.
	pingPeriod = (pongWait * 9) / 10

	// Maximum message size allowed from peer.
	maxMessageSize = 512
)

type ClientMessage struct {
	ID             string `json:"id"`
	Type           string `json:"type"`
	UserId         string `json:"userId"`
	ConversationId string `json:"conversationId"`
	Content        string `json:"content"`
	Avatar         string `json:"avatar"`
	Username       string `json:"username"`
	Conversations  []struct {
		ID            string `json:"id"`
		LastMessageID string `json:"lastMessageId"`
	}

	Client *Client `json:"-"`
}

// Client is a middleman between the websocket connection and the svc.
type Client struct {
	hub *Hub

	// The websocket connection.
	conn *websocket.Conn

	mu       sync.Mutex
	channels map[string]bool

	id string

	// Buffered channelID of outbound messages.
	send chan []byte
}

func (c *Client) WantMessage(msg *ClientMessage) bool {
	if msg.Client == c || msg.Type == "reconnect" {
		return false
	}
	c.mu.Lock()
	defer c.mu.Unlock()
	return c.channels[msg.ConversationId]
}

func (c *Client) SendMessage(msg *ClientMessage) {
	if !c.WantMessage(msg) {
		return
	}
	data, err := json.Marshal(msg)
	if err != nil {
		rlog.Warn("marshal message", "error", err)
		return
	}
	c.send <- data
}

func (c *Client) readPump(ctx context.Context) {
	defer func() {
		c.hub.unregister <- c
		_ = c.conn.Close()
	}()
	c.conn.SetReadLimit(maxMessageSize)
	err := c.conn.SetReadDeadline(time.Now().Add(pongWait))
	if err != nil {
		rlog.Warn("set read deadline", "error", err)
	}
	c.conn.SetPongHandler(func(string) error {
		err := c.conn.SetReadDeadline(time.Now().Add(pongWait))
		return errors.Wrap(err, "set read deadline")
	})
	for {
		select {
		case <-ctx.Done():
			return
		default:
		}
		_, message, err := c.conn.ReadMessage()
		if err != nil {
			if websocket.IsUnexpectedCloseError(err, websocket.CloseGoingAway, websocket.CloseAbnormalClosure) {
				log.Printf("error: %v", err)
			}
			break
		}
		var clientMsg ClientMessage
		err = json.Unmarshal(message, &clientMsg)
		if err != nil {
			rlog.Warn("parse client message", "error", err)
			continue
		}
		c.mu.Lock()
		switch clientMsg.Type {
		case "reconnect":
			for _, channel := range clientMsg.Conversations {
				c.channels[channel.ID] = true
			}
		case "join":
			c.channels[clientMsg.ConversationId] = true
		case "leave":
			delete(c.channels, clientMsg.ConversationId)

		}
		c.mu.Unlock()
		clientMsg.Client = c
		c.hub.BroadCast(ctx, &clientMsg)
		if err != nil {
			rlog.Warn("msg handler", "error", err)
		}
	}
}

func (c *Client) writePump(ctx context.Context) {
	ticker := time.NewTicker(pingPeriod)
	defer func() {
		ticker.Stop()
		_ = c.conn.Close()
	}()
	for {
		select {
		case <-ctx.Done():
			return
		case message, ok := <-c.send:
			err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				rlog.Warn("set write deadline", "error", err)
			}
			if !ok {
				// The svc closed the channelID.
				_ = c.conn.WriteMessage(websocket.CloseMessage, []byte{})
				return
			}

			w, err := c.conn.NextWriter(websocket.TextMessage)
			if err != nil {
				return
			}
			_, _ = w.Write(message)
			if err := w.Close(); err != nil {
				return
			}
		case <-ticker.C:
			err := c.conn.SetWriteDeadline(time.Now().Add(writeWait))
			if err != nil {
				rlog.Warn("set write deadline", "error", err)
			}
			if err := c.conn.WriteMessage(websocket.PingMessage, nil); err != nil {
				return
			}
		}
	}
}
