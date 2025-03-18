import { z } from 'zod';
import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WeatherService } from './weather.service';
import { WeatherRepository } from './weather.repository';

/**
 * Controller responsible for exposing weather functionality as MCP tools
 */
export class WeatherController {
  /**
   * Name of the weather tool
   */
  static readonly name = 'get-weather';

  /**
   * Description of the weather tool
   */
  static readonly description = 'Get current weather information for a city';

  /**
   * Parameters for the weather tool
   */
  static readonly parameters = { 
    city: z.string().min(1, 'City name is required') 
  };

  /**
   * Service instance for accessing weather functionality
   */
  private static weatherService = new WeatherService(new WeatherRepository());

  /**
   * Handler function for the weather tool
   * @param args - The tool arguments
   *param extra - Extra request handler information
   * @returns The tool response
   */
  static readonly handler = async (args: { city: string }, extra: any) => {
    try {
      const weatherInfo = await WeatherController.weatherService.getCurrentWeather(args.city);
      const formattedWeather = WeatherController.weatherService.formatWeatherInfo(weatherInfo);
      
      return {
        content: [{ 
          type: 'text' as const, 
          text: formattedWeather 
        }]
      };
    } catch (error) {
      if (error instanceof Error) {
        return {
          content: [{ 
            type: 'text' as const, 
            text: `Error: ${error.message}` 
          }]
        };
      }
      return {
        content: [{ 
          type: 'text' as const, 
          text: 'An unknown error occurred' 
        }]
      };
    }
  };

  /**
   * Registers all weather-related tools with the MCP server
   * @param server - The MCP server instance
   */
  static registerTools(server: McpServer): void {
    // Register the get-weather tool
    server.tool(
      WeatherController.name,
      WeatherController.description,
      WeatherController.parameters,
      WeatherController.handler
    );
  }
}
