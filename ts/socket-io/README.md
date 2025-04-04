# Encore.ts + Socket.IO Real-time Chat

This is a starter template for building a chat application using [Encore.ts](https://encore.dev) and [Socket.io](https://socket.io/). It implements a Socket.io server and client, served using a raw endpoint in Encore.ts.

**Note**: Encore.ts offers streaming APIs as part of the built-in framework functionality. We recommend using this for real-time streaming if possible as this enables using other Encore features like tracing. Learn more in the [streaming API docs](https://encore.dev/docs/ts/primitives/streaming-apis).

## Chat Implementation

The chat functionality is implemented using Socket.IO and consists of two main parts:

### Backend (`/chat` service)
- A Socket.IO server running on port 4001
- Handles real-time message broadcasting between connected clients
- Implements basic connection/disconnection logging
- Provides a simple test endpoint at `/chat/test`
- Serves the chat client HTML interface at `/chat`

### Frontend (Browser Client)
- Simple HTML/JavaScript client interface
- Real-time message updates using Socket.IO
- Connects directly to the Socket.IO server on port 4001
- Features:
  - Send and receive messages in real-time
  - Visual feedback for connection status
  - Message history displayed in a scrollable list

## Getting started 

### Install or Update Encore
Install Encore:

- **macOS:** `brew install encoredev/tap/encore`
- **Linux:** `curl -L https://encore.dev/install.sh | bash`
- **Windows:** `iwr https://encore.dev/install.ps1 | iex`

### Create app

Create a local app from this template:

```bash
encore app create my-app-name --example=ts/socket-io
```

### Install dependencies

After creating your app, install the required dependencies:

```bash
# Navigate to your app directory
cd my-app-name

# Install dependencies
npm install
```

### Run and test the app

1. Start the Encore backend:
```bash
encore run
```

2. Open the chat interface in your browser:
```
http://localhost:4000/chat
```

3. To test real-time communication:
   - Open the chat in multiple browser windows
   - Send messages from any window
   - Messages will appear in real-time across all connected clients
   - Check the browser console (F12) for connection status and message logs

## Deployment

### Encore Cloud

Socket.io is currently not supported by Encore Cloud as it requires an unsupported port setup.

### Self-hosting

See the [self-hosting instructions](https://encore.dev/docs/self-host/docker-build) for how to use `encore build docker` to create a Docker image and configure it.
