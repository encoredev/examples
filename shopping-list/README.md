A simple shopping list service built with Encore that lets you manage your shopping items.

## Features

- Create shopping list items
- Get single item details
- List all items
- Update item details (price, quantity, bought status)

## API Endpoints

- `POST /item` - Create a new shopping list item
- `GET /items/:id` - Get details of a specific item
- `GET /items` - List all shopping items
- `PUT /items/:id` - Update an existing item

## Database Schema

The service uses PostgreSQL with the following schema:


CREATE TABLE items (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL,
    price DECIMAL(10,2),
    quantity INTEGER,
    bought BOOLEAN
);


## Developing locally 
When you have installed Encore, you can create a new Encore application and clone this example with this command.
```bash
encore app create my-app-name  --example=shopping-list
```
## Running Locally
Run your application locally with this command:
``` bash 
encore run
```


Access the local development dashboard at http://localhost:9400/

## API Endpoints and Usage
Get all items:

```bash 
curl http://localhost:4000/items
```

Get item by ID:
``` bash
curl http://localhost:4000/items/1
```

Create new item:
``` bash
curl -X POST http://localhost:4000/items \
  -H "Content-Type: application/json" \
  -d '{"name": "Milk", "price": 2.99, "quantity": 1, "bought": false}'

```

  Update item:
``` bash
curl -X PUT http://localhost:4000/items/1 \
  -H "Content-Type: application/json" \
  -d '{"name": "Milk", "price": 3.99, "quantity": 2, "bought": false}'
```

## Database Commands
Reset database:
``` bash
encore db reset
```

## Local Development Dashboard 
While `encore run` is running, open <http://localhost:9400/> to access Encore's [local developer dashboard](https://encore.dev/docs/observability/dev-dash).

Here you can see API docs, make requests in the API explorer, and view traces of the responses.

## Deployment
Deploy to Encore's development cloud:
``` bash
git add .
git commit -m "Update message"
git push encore
```
Then head over to the [Cloud Dashboard](https://app.encore.dev) to monitor your deployment and find your production URL.

From there you can also connect your own AWS or GCP account to use for deployment.

Now off you go into the clouds!


## Testing 
``` bash 
encore test ./...
```




## Built With
Go
Encore
GORM
PostgreSQL
## License
MIT License

## API Response Format
GET /items
```json
{
    "items": [
        {
            "id": 1,
            "name": "Milk",
            "price": 2.99,
            "quantity": 1,
            "bought": false
        }
    ]
}
```


POST /items
```json
{
    "success": true
}
``` 



