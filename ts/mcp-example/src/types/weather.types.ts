/**
 * Represents weather information for a specific city
 */
export interface WeatherInfo {
  /**
   * The name of the city
   */
  city: string;
  
  /**
   * The current temperature in Celsius
   */
  temperature: number;
  
  /**
   * The current weather condition (e.g., "Sunny", "Cloudy", "Rainy")
   */
  condition: string;
  
  /**
   * The current humidity percentage
   */
  humidity: number;
  
  /**
   * The current wind speed in km/h
   */
  windSpeed: number;
}

/**
 * Error thrown when a city is not found
 */
export class CityNotFoundError extends Error {
  constructor(city: string) {
    super(`City not found: ${city}`);
    this.name = 'CityNotFoundError';
  }
}
