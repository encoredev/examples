//! A JSON REST API for todo items, built on Axum and stored in Postgres.
//!
//!   GET    /{{name}}/todos        list every todo
//!   POST   /{{name}}/todos        create one from {"title": "..."}
//!   GET    /{{name}}/todos/{id}   get one
//!   PATCH  /{{name}}/todos/{id}   update {"title": "...", "done": true}, either field optional
//!   DELETE /{{name}}/todos/{id}   delete one

use axum::extract::Path;
use axum::http::StatusCode;
use axum::response::{IntoResponse, Response};
use axum::routing::get;
use axum::{Json, Router};
use encore::storage::postgres::{Database, Row};
use serde::{Deserialize, Serialize};

// The service's database. Encore finds this declaration, provisions the
// database and applies the migrations in ./migrations (next to this file)
// before the service starts.
static DB: Database = Database::new("{{ident}}").migrations("./migrations");

/// The columns of a todo, with `created_at` as an RFC 3339 timestamp.
const COLUMNS: &str = r#"id, title, done,
    to_char(created_at AT TIME ZONE 'UTC', 'YYYY-MM-DD"T"HH24:MI:SS.US"Z"') AS created_at"#;

#[derive(Serialize)]
struct Todo {
    id: i64,
    title: String,
    done: bool,
    created_at: String,
}

impl Todo {
    fn from_row(row: &Row) -> Self {
        Self {
            id: row.get("id"),
            title: row.get("title"),
            done: row.get("done"),
            created_at: row.get("created_at"),
        }
    }
}

#[derive(Deserialize)]
struct CreateTodo {
    title: String,
}

#[derive(Deserialize)]
struct UpdateTodo {
    title: Option<String>,
    done: Option<bool>,
}

/// GET /{{name}}/todos
async fn list_todos() -> Result<Json<Vec<Todo>>, ApiError> {
    let sql = format!("SELECT {COLUMNS} FROM todos ORDER BY id");
    let rows = DB.query(&sql, &[]).await?;
    Ok(Json(rows.iter().map(Todo::from_row).collect()))
}

/// POST /{{name}}/todos
async fn create_todo(Json(req): Json<CreateTodo>) -> Result<(StatusCode, Json<Todo>), ApiError> {
    let title = non_empty(req.title)?;
    let sql = format!("INSERT INTO todos (title) VALUES ($1) RETURNING {COLUMNS}");
    let row = DB.query_one(&sql, &[&title]).await?;
    let todo = Todo::from_row(&row);
    log::info!(id = todo.id; "todo created");
    Ok((StatusCode::CREATED, Json(todo)))
}

/// GET /{{name}}/todos/{id}
async fn get_todo(Path(id): Path<i64>) -> Result<Json<Todo>, ApiError> {
    let sql = format!("SELECT {COLUMNS} FROM todos WHERE id = $1");
    let row = DB.query_opt(&sql, &[&id]).await?;
    row.map(|row| Json(Todo::from_row(&row)))
        .ok_or(ApiError::NotFound)
}

/// PATCH /{{name}}/todos/{id}
async fn update_todo(
    Path(id): Path<i64>,
    Json(req): Json<UpdateTodo>,
) -> Result<Json<Todo>, ApiError> {
    let title = req.title.map(non_empty).transpose()?;
    // A field left out of the request keeps its value.
    let sql = format!(
        "UPDATE todos SET title = COALESCE($2, title), done = COALESCE($3, done)
         WHERE id = $1 RETURNING {COLUMNS}"
    );
    let row = DB.query_opt(&sql, &[&id, &title, &req.done]).await?;
    row.map(|row| Json(Todo::from_row(&row)))
        .ok_or(ApiError::NotFound)
}

/// DELETE /{{name}}/todos/{id}
async fn delete_todo(Path(id): Path<i64>) -> Result<StatusCode, ApiError> {
    let deleted = DB
        .execute("DELETE FROM todos WHERE id = $1", &[&id])
        .await?;
    if deleted == 0 {
        return Err(ApiError::NotFound);
    }
    Ok(StatusCode::NO_CONTENT)
}

fn non_empty(title: String) -> Result<String, ApiError> {
    let title = title.trim();
    if title.is_empty() {
        return Err(ApiError::BadRequest("title must not be empty"));
    }
    Ok(title.to_string())
}

/// What a handler fails with, answered as `{"error": "..."}`.
enum ApiError {
    BadRequest(&'static str),
    NotFound,
    Database(encore::Error),
}

#[derive(Serialize)]
struct ErrorBody {
    error: &'static str,
}

impl From<encore::Error> for ApiError {
    fn from(err: encore::Error) -> Self {
        Self::Database(err)
    }
}

impl IntoResponse for ApiError {
    fn into_response(self) -> Response {
        let (status, message) = match self {
            Self::BadRequest(message) => (StatusCode::BAD_REQUEST, message),
            Self::NotFound => (StatusCode::NOT_FOUND, "no such todo"),
            Self::Database(err) => {
                log::error!(error:% = err; "query failed");
                (StatusCode::INTERNAL_SERVER_ERROR, "internal error")
            }
        };
        (status, Json(ErrorBody { error: message })).into_response()
    }
}

#[tokio::main]
async fn main() {
    // Fail at startup, not on the first query, if Encore's runtime config is
    // missing.
    encore::initialize();
    // `log` records print in Encore's log format, for `encore run` and the
    // dashboard to show.
    encore::log::init();

    let todos = Router::new()
        .route("/todos", get(list_todos).post(create_todo))
        .route(
            "/todos/{id}",
            get(get_todo).patch(update_todo).delete(delete_todo),
        );
    // The service receives the full path, its /{{name}} prefix included.
    let app = Router::new().nest("/{{name}}", todos);

    let addr = listen_addr();
    let listener = tokio::net::TcpListener::bind(&addr)
        .await
        .expect("bind listener");
    log::info!(addr:% = addr; "{{name}} listening");

    // On SIGTERM, finish the requests in flight, then let Encore flush its
    // telemetry before exiting.
    axum::serve(listener, app)
        .with_graceful_shutdown(encore::shutdown::signal())
        .await
        .expect("serve");
    std::process::exit(encore::shutdown::drained().await.code());
}

/// Where to serve. Encore's local run supplies `ENCORE_LISTEN_ADDR`; run on its
/// own, this falls back to `PORT` and then to 8080.
fn listen_addr() -> String {
    match std::env::var("ENCORE_LISTEN_ADDR") {
        Ok(addr) if !addr.is_empty() => addr,
        _ => {
            let port = std::env::var("PORT").unwrap_or_else(|_| "8080".to_string());
            format!("127.0.0.1:{port}")
        }
    }
}
