// Test script for MCP client
import { McpClient } from '@modelcontextprotocol/sdk/client/mcp.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';

async function main() {
  // Create MCP client
  const client = new McpClient();
  
  // Connect to the MCP server via stdio
  const transport = new StdioClientTransport();
  await client.connect(transport);
  
  // Get server info
  const serverInfo = await client.getServerInfo();
  console.log('Connected to MCP server:', serverInfo);
  
  try {
    // Call the weather tool
    console.log('\nGetting weather for New York...');
    const weatherResponse = await client.callTool('get-weather', { city: 'New York' });
    console.log('Weather response:', weatherResponse);
    
    // Try with an invalid city
    console.log('\nGetting weather for NonExistentCity...');
    const errorResponse = await client.callTool('get-weather', { city: 'NonExistentCity' });
    console.log('Error response:', errorResponse);
  } catch (error) {
    console.error('Error calling tool:', error);
  }
  
  // Disconnect
  await client.disconnect();
}

main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
