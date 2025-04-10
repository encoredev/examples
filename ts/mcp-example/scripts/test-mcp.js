// This script tests the MCP server by sending requests to the weather tool

// Import the MCP client SDK
const { McpClient } = require('@modelcontextprotocol/sdk/client/mcp');
const { ChildProcessClientTransport } = require('@modelcontextprotocol/sdk/client/child-process');

async function main() {
  console.log('Starting MCP client test...');
  
  // Create a client transport that connects to the Encore server
  const transport = new ChildProcessClientTransport({
    command: 'encore',
    args: ['run'],
    cwd: process.cwd(),
  });
  
  // Create and connect the client
  const client = new McpClient();
  await client.connect(transport);
  
  try {
    // Get server info
    const serverInfo = await client.getServerInfo();
    console.log('Connected to MCP server:', serverInfo);
    
    // Get available tools
    const tools = await client.getTools();
    console.log('\nAvailable tools:', tools);
    
    // Test the weather tool with a valid city
    console.log('\nTesting weather tool with New York:');
    const nyResponse = await client.callTool('get-weather', { city: 'New York' });
    console.log(nyResponse);
    
    // Test with an invalid city
    console.log('\nTesting weather tool with invalid city:');
    const invalidResponse = await client.callTool('get-weather', { city: 'NonExistentCity' });
    console.log(invalidResponse);
    
  } catch (error) {
    console.error('Error during MCP test:', error);
  } finally {
    // Disconnect the client
    await client.disconnect();
    console.log('\nTest completed and client disconnected.');
  }
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
