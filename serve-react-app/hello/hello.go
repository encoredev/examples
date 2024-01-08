package hello

import (
	"embed"
	"fmt"
	"net/http"
	"path"
	"text/template"
)

//go:embed assets/dist/assets/*
//go:embed assets/dist/index.html
var content embed.FS

// Index will return the base HTML content for the current page.
//
//encore:api public path=/app raw
func Index(w http.ResponseWriter, req *http.Request) {
	indexInternal(w, req)
}

// indexInternal is the internal version of Index to bypass a bug with testing raw endpoint.
func indexInternal(w http.ResponseWriter, req *http.Request) {
	tpl, err := template.ParseFS(content, "assets/dist/index.html")
	if err != nil {
		fmt.Printf("file not found %v\n", err)
		http.NotFound(w, req)
		return
	}

	w.Header().Add("Content-Type", "text/html; charset=UTF-8")
	w.WriteHeader(http.StatusOK)
	data := map[string]interface{}{
		"toInject": "window.injectedState = { message: 'Hello from Encore!' };",
	}
	if err := tpl.Execute(w, data); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}

// ServeFile will return the built JavaScript and HTML application based on the given file path.
//
//encore:api public path=/app/assets/*file raw
func ServeFile(w http.ResponseWriter, req *http.Request) {
	serveFileInternal(w, req)
}

// serveFileInternal is the internal version of ServeFile to bypass a bug with testing raw endpoint.
func serveFileInternal(w http.ResponseWriter, req *http.Request) {
	element := path.Base(req.URL.Path)

	tpl, err := template.ParseFS(content, "assets/dist/assets/"+element)
	if err != nil {
		fmt.Printf("file not found %v\n", err)
		http.NotFound(w, req)
		return
	}

	var contentType string
	switch path.Ext(req.URL.Path) {
	case ".js":
		contentType = "text/javascript"
	case ".css":
		contentType = "text/css"
	}

	w.Header().Add("Content-Type", contentType)
	w.WriteHeader(http.StatusOK)
	if err := tpl.Execute(w, map[string]interface{}{}); err != nil {
		w.WriteHeader(http.StatusInternalServerError)
		return
	}
}
