package users

import (
	"context"

	"encore.dev/storage/sqldb"
)

type Users struct {
	Items []User
}

//encore:api auth tag:admin
func List(ctx context.Context) (*Users, error) {
	rows, err := sqldb.Query(ctx, `SELECT id, username, admin, api_key FROM users`)
	if err != nil {
		return nil, err
	}

	defer rows.Close()

	var users []User
	for rows.Next() {
		user := User{}
		if err = rows.Scan(&user.Id, &user.Username, &user.Admin, &user.ApiKey); err != nil {
			return nil, err
		}
		users = append(users, user)
	}

	return &Users{Items: users}, nil
}
