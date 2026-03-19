// Service frontend serves the frontend for development purposes.
package frontend

import (
	"embed"
	"io/fs"
	"net/http"
)

var (
	//go:embed dist
	dist embed.FS

	assets, _ = fs.Sub(dist, "dist")
	handler   = http.FileServer(http.FS(assets))
)

// Serves the frontend at the root URL.
//
//encore:api public raw path=/!path
func Index(w http.ResponseWriter, req *http.Request) {
	handler.ServeHTTP(w, req)
}
