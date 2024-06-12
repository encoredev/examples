package fns

import (
	"testing"
)

func TestSelectRandom(t *testing.T) {
	tests := []struct {
		name    string
		slice   []int
		n       int
		wantLen int
	}{
		{
			name:    "empty slice",
			slice:   []int{},
			n:       0,
			wantLen: 0,
		},
		{
			name:    "n greater than slice length",
			slice:   []int{1, 2, 3},
			n:       4,
			wantLen: 3,
		},
		{
			name:    "n equal to slice length",
			slice:   []int{1, 2, 3},
			n:       3,
			wantLen: 3,
		},
		{
			name:    "n less than slice length",
			slice:   []int{1, 2, 3},
			n:       2,
			wantLen: 2,
		},
	}
	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			if got := SelectRandom(tt.slice, tt.n); len(Unique(got)) != tt.wantLen {
				t.Errorf("SelectRandom() = %v, want %v", got, tt.wantLen)
			}
		})
	}
}
