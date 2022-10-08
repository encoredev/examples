package usr

import (
	"context"
	"fmt"
	"testing"

	"encore.dev/storage/sqldb"
)

func cleanup(ctx context.Context) {
	query := "TRUNCATE users;"

	_, err := sqldb.Exec(ctx, query)
	if err != nil {
		panic(err)
	}
}

func TestCreateUser(t *testing.T) {
	ctx := context.Background()
	defer cleanup(ctx)

	result, err := CreateUser(ctx, &CreateUserParams{
		Age:  42,
		Name: "Test",
	})
	if err != nil {
		t.Error("create user should not return an error", err)
	}

	client, err := Get()
	if err != nil {
		t.Fatal("could not fetch the database client", err)
	}

	users, err := client.User.Query().All(ctx)
	if err != nil {
		t.Fatal("got an error when trying to fetch the users for the assertions", err)
	}

	user := users[0]

	if user.Name != "Test" || user.Age != 42 {
		t.Errorf(
			"expected user to be { age: 42, name: Test }, received { age: %d, name: %s }",
			user.Age,
			user.Name)
	}

	expectedMessage := fmt.Sprintf("Fetch this user with %d", user.ID)
	if result.Message != expectedMessage {
		t.Errorf("expected %s, got %s", result.Message, expectedMessage)
	}
}

func TestGetUser(t *testing.T) {
	ctx := context.Background()
	defer cleanup(ctx)

	client, err := Get()
	if err != nil {
		t.Fatal("could not fetch the database client", err)
	}
	created, err := client.User.
		Create().
		SetAge(42).
		SetName("Test").
		Save(ctx)
	if err != nil {
		t.Fatal("got an error when trying to create the test user", err)
	}

	result, err := GetUser(ctx, created.ID)
	if err != nil {
		t.Error("get user should not return an error", err)
	}

	if result.Name != created.Name || result.Age != created.Age {
		t.Errorf(
			"expected user to be { age: %d, name: %s }, received { age: %d, name: %s }",
			created.Age,
			created.Name,
			result.Age,
			result.Name,
		)
	}
}
