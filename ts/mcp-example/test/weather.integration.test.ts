import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WeatherController } from '../src/services/weather/weather.controller';
import { WeatherRepository } from '../src/services/weather/weather.repository';

describe('Weather MCP Integration', () => {
  let server: McpServer;
  let weatherRepository: WeatherRepository;
  
  beforeAll(async () => {
    // Create MCP server
    server = new McpServer({
      name: 'Weather MCP Demo',
      version: '1.0.0',
      description: 'A simple MCP server that provides weather information'
    });

    // Mock the weather repository
    const originalGetWeatherForCity = WeatherRepository.prototype.getWeatherForCity;
    WeatherRepository.prototype.getWeatherForCity = vi.fn().mockImplementation(
      async (city: string) => {
        if (city.toLowerCase() === 'new york') {
          return {
            city: 'New York',
            temperature: 25,
            condition: 'Sunny',
            humidity: 60,
            windSpeed: 10
          };
        }
        throw new Error(`City not found: ${city}`);
      }
    );

    // Register weather tool
    WeatherController.registerTools(server);

    // Store for cleanup
    weatherRepository = new WeatherRepository();
    
    return () => {
      WeatherRepository.prototype.getWeatherForCity = originalGetWeatherForCity;
    };
  });

  it('should get weather for a valid city through direct call', async () => {
    // Get the handler function from WeatherController
    const handler = WeatherController.handler;
    
    // Call the handler directly
    const response = await handler({ city: 'New York' }, {});
    
    // Verify the response
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toContain('Weather for New York');
    expect(response.content[0].text).toContain('Temperature: 25\u00b0C');
    expect(response.content[0].text).toContain('Condition: Sunny');
    expect(response.content[0].text).toContain('Humidity: 60%');
    expect(response.content[0].text).toContain('Wind Speed: 10 km/h');
  });

  it('should handle invalid city through direct call', async () => {
    // Get the handler function from WeatherController
    const handler = WeatherController.handler;
    
    // Call the handler directly with invalid city
    const response = await handler({ city: 'NonExistentCity' }, {});
    
    // Verify the error response
    expect(response.content).toHaveLength(1);
    expect(response.content[0].type).toBe('text');
    expect(response.content[0].text).toContain('Error: City not found');
  });

  afterAll(() => {
    // No need to disconnect since we're not using a real transport
  });
});
