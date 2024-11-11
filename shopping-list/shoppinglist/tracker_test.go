package shoppinglist

import (
    "context"
    "testing"
    "encore.dev/storage/sqldb"
    "gorm.io/driver/postgres"
    "gorm.io/gorm"
)

var testDB = sqldb.NewDatabase("shopping_test", sqldb.DatabaseConfig{
    Migrations: "./migrations",
})

func setupTestDB(t *testing.T) *Service {
    db, err := gorm.Open(postgres.New(postgres.Config{
        Conn: testDB.Stdlib(),
    }))
    if err != nil {
        t.Fatalf("failed to connect to test database: %v", err)
    }

    // Clean up existing data
    if err := db.Exec("TRUNCATE TABLE items RESTART IDENTITY CASCADE").Error; err != nil {
        t.Fatalf("failed to cleanup test database: %v", err)
    }

    return &Service{db: db}
}

func TestCreateAndGetItem(t *testing.T) {
    ctx := context.Background()
    svc := setupTestDB(t)

    tests := []struct {
        name     string
        item     Item
        wantErr  bool
        wantItem Item
    }{
        {
            name: "valid item",
            item: Item{
                Name:     "Test Item",
                Price:    9.99,
                Quantity: 2,
                Bought:   false,
            },
            wantErr: false,
        },
        {
            name: "empty name item",
            item: Item{
                Price:    9.99,
                Quantity: 2,
                Bought:   false,
            },
            wantErr: true,
        },
    }

    for _, test := range tests {
        t.Run(test.name, func(t *testing.T) {
            resp, err := svc.CreateItem(ctx, test.item)
            if test.wantErr && err == nil {
                t.Errorf("test %s: expected error but got none", test.name)
            }
            if !test.wantErr && err != nil {
                t.Errorf("test %s: unexpected error: %v", test.name, err)
            }
            if !test.wantErr {
                if !resp.Success {
                    t.Errorf("test %s: expected success but got failure", test.name)
                }

                // Verify the item was created
                getResp, err := svc.GetItem(ctx, 1)
                if err != nil {
                    t.Errorf("failed to get created item: %v", err)
                }
                if getResp.Item.Name != test.item.Name {
                    t.Errorf("got name=%s, want %s", getResp.Item.Name, test.item.Name)
                }
            }
        })
    }
}

func TestGetItems(t *testing.T) {
    ctx := context.Background()
    svc := setupTestDB(t)

    testItems := []Item{
        {Name: "Item 1", Price: 9.99, Quantity: 2, Bought: false},
        {Name: "Item 2", Price: 19.99, Quantity: 1, Bought: true},
    }

    for _, item := range testItems {
        _, err := svc.CreateItem(ctx, item)
        if err != nil {
            t.Fatalf("failed to create test item: %v", err)
        }
    }

    resp, err := svc.GetItems(ctx)
    if err != nil {
        t.Errorf("unexpected error: %v", err)
    }
    if len(resp.Items) != len(testItems) {
        t.Errorf("got %d items, want %d", len(resp.Items), len(testItems))
    }

    // Verify items content
    for i, item := range resp.Items {
        if item.Name != testItems[i].Name {
            t.Errorf("item %d: got name=%s, want %s", i, item.Name, testItems[i].Name)
        }
    }
}
func TestUpdateItem(t *testing.T) {
    ctx := context.Background()
    svc := setupTestDB(t)

    // Create initial item
    initialItem := Item{
        Name:     "Initial Item",
        Price:    9.99,
        Quantity: 2,
        Bought:   false,
    }
    _, err := svc.CreateItem(ctx, initialItem)
    if err != nil {
        t.Fatalf("failed to create initial item: %v", err)
    }

    // Update the item
    updatedItem := Item{
        Name:     "Updated Item",
        Price:    19.99,
        Quantity: 3,
        Bought:   true,
    }

    _, err = svc.UpdateItem(ctx, 1, updatedItem)
    if err != nil {
        t.Errorf("failed to update item: %v", err)
    }

    // Verify the update
    getResp, err := svc.GetItem(ctx, 1)
    if err != nil {
        t.Errorf("failed to get updated item: %v", err)
    }
    if getResp.Item.Name != updatedItem.Name {
        t.Errorf("got name=%s, want %s", getResp.Item.Name, updatedItem.Name)
    }
    if getResp.Item.Price != updatedItem.Price {
        t.Errorf("got price=%v, want %v", getResp.Item.Price, updatedItem.Price)
    }
}


func TestGetItem_NotFound(t *testing.T) {
    ctx := context.Background()
    svc := setupTestDB(t)

    _, err := svc.GetItem(ctx, 999)
    if err == nil {
        t.Error("expected error for non-existent item, got nil")
    }
}

func TestUpdateItem_NotFound(t *testing.T) {
    ctx := context.Background()
    svc := setupTestDB(t)

    updateItem := Item{
        Name:     "Updated Item",
        Price:    19.99,
        Quantity: 3,
        Bought:   true,
    }

    _, err := svc.UpdateItem(ctx, 999, updateItem)
    if err == nil {
        t.Error("expected error for updating non-existent item, got nil")
    }
}
