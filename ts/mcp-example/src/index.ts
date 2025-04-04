import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { SERVER_CONFIG } from './config/api';
import { WeatherController } from './services/weather/weather.controller';
import { api } from 'encore.dev/api';
import log from 'encore.dev/log';

/**
 * Encore application entry point
 */
interface Response {
    message: string;
}
  
export const health = api(
    { method: "GET", path: "/" },
    async (): Promise<Response> => {
      return { message: `API ${SERVER_CONFIG.name}! are running.` };
    }
  );

/**
 * Initialize the MCP server and register all tools
 */
async function initializeServer() {
  // Create server instance
  const server = new McpServer({
    name: SERVER_CONFIG.name,
    version: SERVER_CONFIG.version,
    description: SERVER_CONFIG.description,
  });

  // Register all tools
  WeatherController.registerTools(server);

  return server;
}

/**
 * Main entry point
 */
async function main() {
  // Initialize the server
  const server = await initializeServer();
  
  // Connect to stdio transport
  const transport = new StdioServerTransport();
  await server.connect(transport);
  log.info("Weather MCP Server running on stdio with Encore.ts!");
}

/**
 * Start the server
 */
main().catch((error) => {
  console.error("Fatal error in main():", error);
  process.exit(1);
});