import { describe, it, beforeEach, afterEach, expect, vi } from 'vitest';
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { WeatherService } from '../src/services/weather/weather.service';
import { WeatherRepository } from '../src/services/weather/weather.repository';
import { WeatherController } from '../src/services/weather/weather.controller';

describe('Weather MCP Service', () => {
  let weatherService: WeatherService;
  let weatherRepository: WeatherRepository;
  let server: McpServer;

  beforeEach(() => {
    // Initialize dependencies
    weatherRepository = new WeatherRepository();
    weatherService = new WeatherService(weatherRepository);
    
    // Create MCP server
    server = new McpServer({
      name: 'Weather MCP Demo',
      version: '1.0.0'
    });

    // Register weather tool
    WeatherController.registerTools(server);
  });

  it('should get current weather for a city', async () => {
    // Mock the repository response
    const getWeatherSpy = vi.spyOn(weatherRepository, 'getWeatherForCity').mockResolvedValue({
      city: 'New York',
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10
    });

    // Call the service directly
    const result = await weatherService.getCurrentWeather('New York');
    
    // Verify the result
    expect(getWeatherSpy).toHaveBeenCalledWith('New York');
    expect(result).toEqual({
      city: 'New York',
      temperature: 25,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 10
    });
  });

  it('should handle invalid city names', async () => {
    // Mock the repository to throw an error
    vi.spyOn(weatherRepository, 'getWeatherForCity').mockRejectedValue(
      new Error('City not found')
    );

    // Call the service and expect an error
    await expect(weatherService.getCurrentWeather('InvalidCity'))
      .rejects.toThrow('City not found');
  });

  afterEach(() => {
    // Clean up mocks
    vi.restoreAllMocks();
  });
});
