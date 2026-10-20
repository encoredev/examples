//! A minimal Encore service: one HTTP route, no dependencies.

use std::io::{BufRead, BufReader, Write};
use std::net::{TcpListener, TcpStream};

const SERVICE: &str = "{{name}}";

fn main() -> std::io::Result<()> {
    let addr = listen_addr();
    let listener = TcpListener::bind(&addr)?;
    println!("{SERVICE} listening on {addr}");

    for stream in listener.incoming() {
        let mut stream = match stream {
            Ok(stream) => stream,
            Err(err) => {
                eprintln!("accept failed: {err}");
                continue;
            }
        };
        // One bad connection must not end the server. A health check or a port
        // probe connects and hangs up without reading, and letting that error
        // reach `main` would stop the service on its first probe.
        if let Err(err) = serve(&mut stream) {
            eprintln!("connection failed: {err}");
        }
    }
    Ok(())
}

/// Reads one request and answers it.
fn serve(stream: &mut TcpStream) -> std::io::Result<()> {
    // Read the request line so the client is not left waiting on a peer that
    // never drained its request.
    let mut line = String::new();
    BufReader::new(&*stream).read_line(&mut line)?;

    let body = format!("Hello from {SERVICE}!\n");
    write!(
        stream,
        "HTTP/1.1 200 OK\r\n\
         Content-Type: text/plain\r\n\
         Content-Length: {len}\r\n\
         Connection: close\r\n\
         \r\n\
         {body}",
        len = body.len(),
    )
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
