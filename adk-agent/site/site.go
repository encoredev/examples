// Package site serves the demo page.
package site

import (
	_ "embed"
	"net/http"
)

//go:embed index.html
var page []byte

//encore:api public raw method=GET path=/!fallback
func Index(w http.ResponseWriter, req *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write(page)
}
