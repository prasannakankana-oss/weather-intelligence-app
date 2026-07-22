import { GeocodingResponse, GeocodingResult, WeatherForecastResponse, LocationInfo } from '../types';

const GEOCODING_API_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const FORECAST_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search cities using Open-Meteo Geocoding API
 */
export async function searchCities(query: string, count: number = 8): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed || trimmed.length < 2) {
    return [];
  }

  const url = `${GEOCODING_API_URL}?name=${encodeURIComponent(trimmed)}&count=${count}&language=en&format=json`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Geocoding server error (${response.status})`);
    }

    const data: GeocodingResponse = await response.json();
    return data.results || [];
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('City search timed out. Please check your internet connection.');
    }
    throw err;
  }
}

/**
 * Fetch detailed weather forecast using Open-Meteo Forecast API
 */
export async function fetchWeatherForecast(lat: number, lon: number, timezone: string = 'auto'): Promise<WeatherForecastResponse> {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'rain',
      'showers',
      'snowfall',
      'weather_code',
      'cloud_cover',
      'pressure_msl',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'wind_gusts_10m',
      'uv_index'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'precipitation',
      'weather_code',
      'pressure_msl',
      'cloud_cover',
      'visibility',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'rain_sum',
      'showers_sum',
      'snowfall_sum',
      'precipitation_hours',
      'precipitation_probability_max',
      'wind_speed_10m_max',
      'wind_gusts_10m_max',
      'wind_direction_10m_dominant'
    ].join(','),
    timezone: timezone || 'auto'
  });

  const url = `${FORECAST_API_URL}?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);

    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`Weather service responded with status ${response.status}`);
    }

    const data: WeatherForecastResponse = await response.json();
    return data;
  } catch (err: unknown) {
    if (err instanceof Error && err.name === 'AbortError') {
      throw new Error('Weather request timed out. Please try again.');
    }
    throw err;
  }
}

/**
 * Reverse geocode coordinate using Open-Meteo or fallback naming
 */
export async function getLocationNameFromCoords(lat: number, lon: number): Promise<LocationInfo> {
  try {
    // Try to search near coordinate or fetch nearest location if available
    const response = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${lat.toFixed(1)},${lon.toFixed(1)}&count=1&language=en&format=json`);
    if (response.ok) {
      const data: GeocodingResponse = await response.json();
      if (data.results && data.results.length > 0) {
        const first = data.results[0];
        return {
          name: first.name,
          country: first.country,
          admin1: first.admin1,
          latitude: lat,
          longitude: lon,
          timezone: first.timezone
        };
      }
    }
  } catch {
    // Ignore reverse geocode failure and use coordinates as label
  }

  return {
    name: `Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
    latitude: lat,
    longitude: lon
  };
}
