package product

import (
	"sync"
	"time"

	"encore.dev/middleware"
)

type cacheEntry struct {
	value      interface{}
	expiration time.Time
}

var (
	cache    = &sync.Map{}
	cacheTTL = 15 * time.Minute
)

func loadFromCache(cacheKey string, responseType interface{}) (interface{}, error) {
	value, ok := cache.Load(cacheKey)
	if !ok {
		return nil, nil
	}

	entry := value.(cacheEntry)
	if time.Now().After(entry.expiration) {
		cache.Delete(cacheKey)
		return nil, nil
	}

	return entry.value, nil
}

func saveToCache(cacheKey string, value interface{}) {
	cache.Store(cacheKey, cacheEntry{
		value:      value,
		expiration: time.Now().Add(cacheTTL),
	})
}

//encore:middleware target=tag:cache
func CachingMiddleware(req middleware.Request, next middleware.Next) middleware.Response {
	data := req.Data()

	cacheKey := data.Path
	if cached, err := loadFromCache(cacheKey, data.API.ResponseType); err == nil && cached != nil {
		return middleware.Response{Payload: cached}
	}

	resp := next(req)
	if resp.Err == nil && resp.Payload != nil {
		saveToCache(cacheKey, resp.Payload)
	}

	return resp
}
