// A minimal Encore service: one HTTP route, no dependencies.
package main

import (
	"fmt"
	"log"
	"net/http"
	"os"
)

const service = "{{name}}"

func main() {
	http.HandleFunc("/", func(w http.ResponseWriter, _ *http.Request) {
		fmt.Fprintf(w, "Hello from %s!\n", service)
	})

	addr := listenAddr()
	log.Printf("%s listening on %s", service, addr)
	log.Fatal(http.ListenAndServe(addr, nil))
}

// listenAddr is where to serve. Encore's local run supplies
// ENCORE_LISTEN_ADDR; run on its own, this falls back to PORT and then to 8080.
func listenAddr() string {
	if addr := os.Getenv("ENCORE_LISTEN_ADDR"); addr != "" {
		return addr
	}
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	return ":" + port
}
