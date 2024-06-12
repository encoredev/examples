package fns

import (
	"io"
	"time"

	"github.com/sashabaranov/go-openai"
	"golang.org/x/exp/rand"
)

// Ptr returns a pointer to the given value.
func Ptr[T any](v T) *T {
	return &v
}

// ToMap converts a slice to a map using the given key function.
func ToMap[K comparable, T any](s []T, f func(T) K) map[K]T {
	m := make(map[K]T, len(s))
	for _, v := range s {
		m[f(v)] = v
	}
	return m
}

func Filter[T any](s []T, f func(T) bool) []T {
	var rtn []T
	for _, v := range s {
		if f(v) {
			rtn = append(rtn, v)
		}
	}
	return rtn
}

func FilterParam[T any, P any](s []T, p P, f func(T, P) bool) []T {
	var rtn []T
	for _, v := range s {
		if f(v, p) {
			rtn = append(rtn, v)
		}
	}
	return rtn
}

// Map applies the given function to each element in the slice and returns a new slice with the results.
func Map[T, U any](s []T, f func(T) U) []U {
	r := make([]U, len(s))
	for i, v := range s {
		r[i] = f(v)
	}
	return r
}

func SelectRandom[T any](slice []T, n int) []T {
	if len(slice) <= n {
		return slice
	}
	rand.Seed(uint64(time.Now().UnixNano()))
	rtn := make([]T, n)
	for i := range rtn {
		// select and pop a random index from the slice
		randIndex := rand.Intn(len(slice))
		rtn[i] = slice[randIndex]
		slice = append(slice[:randIndex], slice[randIndex+1:]...)
	}
	return rtn
}

func Unique[T comparable](slice []T) []T {
	m := make(map[T]struct{})
	var rtn []T
	for _, v := range slice {
		if _, ok := m[v]; !ok {
			m[v] = struct{}{}
			rtn = append(rtn, v)
		}
	}
	return rtn
}

func CloseIgnore(stream io.Closer) {
	_ = stream.Close()
}

func Any(results []openai.Result, f func(r openai.Result) bool) bool {
	for _, r := range results {
		if f(r) {
			return true
		}
	}
	return false
}
