import { WeatherInfo } from '../../types/weather.types';
import { WeatherRepository } from './weather.repository';

/**
 * Service responsible for weather-related business logic
 */
export class WeatherService {
  /**
   * Creates a new WeatherService instance
   * @param weatherRepository - The repository for accessing weather data
   */
  constructor(private readonly weatherRepository: WeatherRepository) {}

  /**
   * Gets the current weather for a specific city
   * @param city - The name of the city to get weather for
   * @returns A promise that resolves to the weather information
   * @throws {CityNotFoundError} If the city is not found
   */
  async getCurrentWeather(city: string): Promise<WeatherInfo> {
    return this.weatherRepository.getWeatherForCity(city);
  }

  /**
   * Formats weather information into a human-readable string
   * @param weatherInfo - The weather information to format
   * @returns A formatted string with weather details
   */
  formatWeatherInfo(weatherInfo: WeatherInfo): string {
    return (
      `Weather for ${weatherInfo.city}:\n` +
      `Temperature: ${weatherInfo.temperature}°C\n` +
      `Condition: ${weatherInfo.condition}\n` +
      `Humidity: ${weatherInfo.humidity}%\n` +
      `Wind Speed: ${weatherInfo.windSpeed} km/h`
    );
  }
}
