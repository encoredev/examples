package admin

import (
	"context"
	"testing"

	"github.com/stretchr/testify/assert"
	"github.com/stretchr/testify/require"
)

func TestGetDashboardData(t *testing.T) {
	ctx := context.Background()

	data, err := GetDashboardData(ctx)
	require.NoError(t, err)

	assert.Equal(t, 42, data.Foo)
	assert.Equal(t, "important data from the backend", data.Bar)
}
