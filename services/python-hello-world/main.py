"""A minimal Encore service: one HTTP route, no dependencies."""

import os
from http.server import BaseHTTPRequestHandler, HTTPServer

SERVICE = "{{name}}"


class Handler(BaseHTTPRequestHandler):
    def do_GET(self):  # noqa: N802 - the name is BaseHTTPRequestHandler's
        body = f"Hello from {SERVICE}!\n".encode()
        self.send_response(200)
        self.send_header("Content-Type", "text/plain")
        self.send_header("Content-Length", str(len(body)))
        self.end_headers()
        self.wfile.write(body)

    def log_message(self, fmt, *args):
        # Keep the default access log, but on stdout with the others.
        print(fmt % args, flush=True)


def listen_addr():
    """Encore's local run supplies ENCORE_LISTEN_ADDR as host:port. Run on its
    own, this falls back to PORT and then to 8080."""
    addr = os.environ.get("ENCORE_LISTEN_ADDR")
    if addr:
        host, _, port = addr.rpartition(":")
        return host, int(port)
    return "", int(os.environ.get("PORT", 8080))


if __name__ == "__main__":
    host, port = listen_addr()
    print(f"{SERVICE} listening on {host or '0.0.0.0'}:{port}", flush=True)
    HTTPServer((host, port), Handler).serve_forever()
