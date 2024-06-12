package chat

import (
	"context"
	"encoding/json"
	"net/http"

	"github.com/google/uuid"
	"golang.org/x/exp/maps"

	"github.com/cockroachdb/errors"
	"github.com/gorilla/websocket"

	"encore.app/pkg/fns"
	"encore.dev/metrics"
	"encore.dev/rlog"
)

// Example copied and adapted from
// https://github.com/gorilla/websocket/tree/main/examples/chat
func NewHub(ctx context.Context, msgHandler messageHandler) *Hub {
	hub := &Hub{
		broadcast:  make(chan *ClientMessage),
		register:   make(chan *Client),
		unregister: make(chan *Client),
		clients:    make(map[*Client]bool),
		msgHandler: msgHandler,
		upgrader: websocket.Upgrader{
			ReadBufferSize:  1024,
			WriteBufferSize: 1024,
			CheckOrigin: func(r *http.Request) bool {
				return true
			},
		},
	}
	go hub.run(ctx)
	return hub
}

var ActiveClients = metrics.NewGauge[uint64]("active_client", metrics.GaugeConfig{})

type messageHandler func(ctx context.Context, clientMessage *ClientMessage) error

type Hub struct {
	upgrader websocket.Upgrader

	// Registered clients.
	clients map[*Client]bool

	// Inbound messages from the clients.
	broadcast chan *ClientMessage

	// Register requests from the clients.
	register chan *Client

	// Unregister requests from clients.
	unregister chan *Client

	msgHandler messageHandler

	ctx context.Context
}

func (h *Hub) CloseAllClients() {
	for client := range h.clients {
		h.unregister <- client
	}
}

func (h *Hub) BroadCast(ctx context.Context, msg *ClientMessage) {
	h.broadcast <- msg
}

func (h *Hub) Subscribe(w http.ResponseWriter, r *http.Request) error {
	conn, err := h.upgrader.Upgrade(w, r, nil)
	if err != nil {
		return errors.Wrap(err, "upgrade connection")
	}
	client := &Client{
		id:       uuid.New().String(),
		hub:      h,
		conn:     conn,
		send:     make(chan []byte, 256),
		channels: map[string]bool{},
	}
	h.register <- client

	// Allow collection of memory referenced by the caller by doing all work in
	// new goroutines.
	go client.writePump(h.ctx)
	go client.readPump(h.ctx)
	return nil
}

func (h *Hub) run(ctx context.Context) {
	h.ctx = ctx
	for {
		select {
		case <-ctx.Done():
			return
		case client := <-h.register:
			h.clients[client] = true
			ActiveClients.Set(uint64(len(h.clients)))
		case client := <-h.unregister:
			if _, ok := h.clients[client]; ok {
				delete(h.clients, client)
				ActiveClients.Set(uint64(len(h.clients)))
				close(client.send)
			}
		case message := <-h.broadcast:
			if h.msgHandler != nil {
				go func() {
					if err := h.msgHandler(ctx, message); err != nil {
						rlog.Error("handle message", "error", err)
					}
				}()
			}
			clients := fns.FilterParam(maps.Keys(h.clients), message, (*Client).WantMessage)
			msgData, err := json.Marshal(message)
			if err != nil {
				rlog.Error("marshal message", "error", err)
				continue
			}
			for _, client := range clients {
				select {
				case client.send <- msgData:
				default:
					close(client.send)
					delete(h.clients, client)
				}
			}
		}
	}
}
