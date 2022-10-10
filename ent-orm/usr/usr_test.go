package usr

import (
	"context"
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

	if result.Name != "Test" || result.Age != 42 {
		t.Errorf(
			"expected user to be { age: 42, name: Test }, received { age: %d, name: %s }",
			result.Age,
			result.Name,
		)
	}

	client, err := Get()
	if err != nil {
		t.Fatal("could not fetch the database client", err)
	}

	user, err := client.User.Get(ctx, result.ID)
	if err != nil {
		t.Fatal("got an error when trying to fetch the users for the assertions", err)
	}

	if user.Name != result.Name || user.Age != result.Age {
		t.Errorf(
			"expected database user to be { age: %d, name: %s }, received { age: %d, name: %s }",
			result.Age,
			result.Name,
			user.Age,
			user.Name,
		)
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
