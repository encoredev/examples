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
	handler   = http.StripPrefix("/frontend/", http.FileServer(http.FS(assets)))
)

// Serve serves the frontend for development.
// For production use we recommend deploying the frontend
// using Vercel, Netlify, or similar.
//
//encore:api public raw path=/frontend/*path
func Serve(w http.ResponseWriter, req *http.Request) {
	handler.ServeHTTP(w, req)
}
