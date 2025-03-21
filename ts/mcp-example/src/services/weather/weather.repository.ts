import type { WeatherInfo, CityNotFoundError } from '../../types/weather.types.js';

/**
 * Repository responsible for retrieving weather data
 */
export class WeatherRepository {
  /**
   * Mock database of weather information for different cities
   * In a real application, this would be replaced with an actual API call
   * @private
   */
  private readonly mockWeatherData: Record<string, WeatherInfo> = {
    'new york': {
      city: 'New York',
      temperature: 22,
      condition: 'Partly Cloudy',
      humidity: 65,
      windSpeed: 12
    },
    'london': {
      city: 'London',
      temperature: 18,
      condition: 'Rainy',
      humidity: 80,
      windSpeed: 15
    },
    'tokyo': {
      city: 'Tokyo',
      temperature: 28,
      condition: 'Sunny',
      humidity: 60,
      windSpeed: 8
    },
    'sydney': {
      city: 'Sydney',
      temperature: 25,
      condition: 'Clear',
      humidity: 55,
      windSpeed: 10
    },
    'rio de janeiro': {
      city: 'Rio de Janeiro',
      temperature: 30,
      condition: 'Sunny',
      humidity: 70,
      windSpeed: 5
    }
  };

  /**
   * Retrieves weather information for a specific city
   * @param city - The name of the city to get weather for
   * @returns A promise that resolves to the weather information
   * @throws {CityNotFoundError} If the city is not found
   */
  async getWeatherForCity(city: string): Promise<WeatherInfo> {
    const normalizedCity = city.toLowerCase().trim();
    const weatherInfo = this.mockWeatherData[normalizedCity];
    
    if (!weatherInfo) {
      throw new CityNotFoundError(city);
    }
    
    return weatherInfo;
  }
}
