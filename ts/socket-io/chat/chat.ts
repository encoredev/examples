import { api } from "encore.dev/api";
import { Server } from "socket.io";
import { createServer } from "http";

// Create HTTP server
const httpServer = createServer();

// Create Socket.IO server
const io = new Server(httpServer, {
  cors: {
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST"]
  }
});

// Socket.IO connection handling
io.on("connection", (socket) => {
  console.log("A user connected");

  // Handle chat messages
  socket.on("chat message", (msg: string) => {
    console.log("message: " + msg);
    io.emit("chat message", msg);
  });

  // Handle disconnection
  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
});

// Start the server
httpServer.listen(4001, () => {
  console.log("Socket.IO server running on port 4001");
});

// Export a simple endpoint to test the service
export const test = api(
  { expose: true, method: "GET", path: "/chat/test" },
  async (): Promise<{ status: string }> => {
    return { status: "Socket.IO server is running" };
  }
);

// HTML content for the chat client
const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <title>Socket.IO Chat</title>
    <style>
        body { margin: 0; padding: 20px; font-family: Arial, sans-serif; }
        #messages { list-style-type: none; margin: 0; padding: 0; }
        #messages li { padding: 5px 10px; }
        #messages li:nth-child(odd) { background: #eee; }
    </style>
</head>
<body>
    <ul id="messages"></ul>
    <form id="form" action="">
        <input id="input" autocomplete="off" /><button>Send</button>
    </form>

    <script src="https://cdn.socket.io/4.7.2/socket.io.min.js"></script>
    <script>
        const socket = io('http://localhost:4001');
        
        const form = document.getElementById('form');
        const input = document.getElementById('input');
        const messages = document.getElementById('messages');

        socket.on('connect', () => {
            console.log('Connected to server');
        });

        socket.on('disconnect', () => {
            console.log('Disconnected from server');
        });

        form.addEventListener('submit', function(e) {
            e.preventDefault();
            if (input.value) {
                socket.emit('chat message', input.value);
                input.value = '';
            }
        });

        socket.on('chat message', function(msg) {
            console.log('Received message:', msg);
            const item = document.createElement('li');
            item.textContent = msg;
            messages.appendChild(item);
            window.scrollTo(0, document.body.scrollHeight);
        });
    </script>
</body>
</html>
`;

// Serve the HTML client
export const client = api.raw(
  { expose: true, method: "GET", path: "/chat" },
  async (_, res) => {
    res.writeHead(200, { "Content-Type": "text/html" });
    res.end(htmlContent);
  }
); 