// A JSON REST API for todo items, kept in memory.
//
//	GET    /{{name}}/todos       list every todo
//	POST   /{{name}}/todos       create one from {"title": "..."}
//	GET    /{{name}}/todos/{id}  get one
//	PATCH  /{{name}}/todos/{id}  update {"title": "...", "done": true}, either field optional
//	DELETE /{{name}}/todos/{id}  delete one
package main

import (
	"encoding/json"
	"errors"
	"log"
	"net/http"
	"os"
	"slices"
	"strconv"
	"strings"
	"sync"
)

const service = "{{name}}"

// Todo is one item on the list.
type Todo struct {
	ID    int    `json:"id"`
	Title string `json:"title"`
	Done  bool   `json:"done"`
}

// store keeps the todos in memory; they are lost when the service restarts.
type store struct {
	mu     sync.Mutex
	nextID int
	todos  map[int]Todo
}

func main() {
	s := &store{nextID: 1, todos: map[int]Todo{}}

	mux := http.NewServeMux()
	prefix := "/" + service + "/todos"
	mux.HandleFunc("GET "+prefix, s.list)
	mux.HandleFunc("POST "+prefix, s.create)
	mux.HandleFunc("GET "+prefix+"/{id}", s.get)
	mux.HandleFunc("PATCH "+prefix+"/{id}", s.update)
	mux.HandleFunc("DELETE "+prefix+"/{id}", s.delete)

	addr := listenAddr()
	log.Printf("%s listening on %s", service, addr)
	log.Fatal(http.ListenAndServe(addr, mux))
}

func (s *store) list(w http.ResponseWriter, _ *http.Request) {
	s.mu.Lock()
	todos := make([]Todo, 0, len(s.todos))
	for _, t := range s.todos {
		todos = append(todos, t)
	}
	s.mu.Unlock()

	slices.SortFunc(todos, func(a, b Todo) int { return a.ID - b.ID })
	writeJSON(w, http.StatusOK, todos)
}

func (s *store) create(w http.ResponseWriter, r *http.Request) {
	var in struct {
		Title string `json:"title"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		writeError(w, http.StatusBadRequest, "the body must be JSON like {\"title\": \"...\"}")
		return
	}
	if strings.TrimSpace(in.Title) == "" {
		writeError(w, http.StatusBadRequest, "title is required")
		return
	}

	s.mu.Lock()
	t := Todo{ID: s.nextID, Title: in.Title}
	s.todos[t.ID] = t
	s.nextID++
	s.mu.Unlock()

	writeJSON(w, http.StatusCreated, t)
}

func (s *store) get(w http.ResponseWriter, r *http.Request) {
	id, err := todoID(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	t, ok := s.todos[id]
	s.mu.Unlock()

	if !ok {
		writeError(w, http.StatusNotFound, "no such todo")
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (s *store) update(w http.ResponseWriter, r *http.Request) {
	id, err := todoID(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}
	var in struct {
		Title *string `json:"title"`
		Done  *bool   `json:"done"`
	}
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil {
		writeError(w, http.StatusBadRequest, "the body must be JSON like {\"done\": true}")
		return
	}
	if in.Title != nil && strings.TrimSpace(*in.Title) == "" {
		writeError(w, http.StatusBadRequest, "title must not be empty")
		return
	}

	s.mu.Lock()
	t, ok := s.todos[id]
	if ok {
		if in.Title != nil {
			t.Title = *in.Title
		}
		if in.Done != nil {
			t.Done = *in.Done
		}
		s.todos[id] = t
	}
	s.mu.Unlock()

	if !ok {
		writeError(w, http.StatusNotFound, "no such todo")
		return
	}
	writeJSON(w, http.StatusOK, t)
}

func (s *store) delete(w http.ResponseWriter, r *http.Request) {
	id, err := todoID(r)
	if err != nil {
		writeError(w, http.StatusBadRequest, err.Error())
		return
	}

	s.mu.Lock()
	_, ok := s.todos[id]
	delete(s.todos, id)
	s.mu.Unlock()

	if !ok {
		writeError(w, http.StatusNotFound, "no such todo")
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func todoID(r *http.Request) (int, error) {
	id, err := strconv.Atoi(r.PathValue("id"))
	if err != nil {
		return 0, errors.New("the todo id must be a number")
	}
	return id, nil
}

func writeJSON(w http.ResponseWriter, status int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(status)
	if err := json.NewEncoder(w).Encode(v); err != nil {
		log.Printf("writing response: %v", err)
	}
}

func writeError(w http.ResponseWriter, status int, msg string) {
	writeJSON(w, status, map[string]string{"error": msg})
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
