package echo

import (
	"net/http"

	"encore.dev/rlog"
	"github.com/gorilla/websocket"
)

var upgrader = websocket.Upgrader{}

// Echo is a websocket server that echoes messages you send.
// It uses a raw endpoint, learn more: https://encore.dev/docs/go/primitives/raw-endpoints
//
// encore:api public raw
func Echo(w http.ResponseWriter, req *http.Request) {
	c, err := upgrader.Upgrade(w, req, nil)
	if err != nil {
		rlog.Error("could not upgrade websocket", "err", err)
		return
	}
	defer c.Close()

	for {
		mt, message, err := c.ReadMessage()
		if err != nil {
			rlog.Error("could not read message", "err", err)
			break
		}
		rlog.Info("received message", "msg", string(message))
		err = c.WriteMessage(mt, message)
		if err != nil {
			rlog.Error("could not write message", "err", err)
			break
		}
	}
}
