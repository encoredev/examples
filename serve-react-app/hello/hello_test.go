package hello

import (
	"net/http"
	"net/http/httptest"
	"os"
	"path"
	"path/filepath"
	"strings"
	"testing"
)

func TestIndex(t *testing.T) {
	req, err := http.NewRequest(http.MethodGet, "/app/index.html", nil)
	if err != nil {
		t.Fatal(err)
	}

	res := httptest.NewRecorder()
	handler := http.HandlerFunc(indexInternal)

	handler.ServeHTTP(res, req)

	if http.StatusOK != res.Code {
		t.Errorf("expected %d, got %d", http.StatusOK, res.Code)
	}

	if strings.Index(res.Body.String(), "window.injectedState = { message: 'Hello from Encore!' };") < 0 {
		t.Errorf("expected HTML to contain injected JavaScript, %s got", res.Body.String())
	}
}

func TestServeFile(t *testing.T) {
	wd, err := os.Getwd()
	if err != nil {
		t.Fatal(err)
	}

	files, err := filepath.Glob(path.Join(wd, "./assets/dist/assets/*.js"))
	if err != nil {
		t.Fatal(err)
	}

	req, err := http.NewRequest(http.MethodGet, "/app/assets/"+path.Base(files[0]), nil)
	if err != nil {
		t.Fatal(err)
	}

	res := httptest.NewRecorder()
	handler := http.HandlerFunc(serveFileInternal)

	handler.ServeHTTP(res, req)

	if http.StatusOK != res.Code {
		t.Errorf("expected %d, got %d", http.StatusOK, res.Code)
	}
}
