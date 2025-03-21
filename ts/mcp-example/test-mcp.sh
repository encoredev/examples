#!/bin/bash

# Start the MCP server in the background
echo "Starting MCP server..."
encore run &
SERVER_PID=$!

# Give the server some time to start
sleep 2

# Run the MCP client test
echo "Running MCP client test..."
node --loader ts-node/esm test-mcp.js

# Kill the server process
kill $SERVER_PID
