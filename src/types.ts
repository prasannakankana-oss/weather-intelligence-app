export interface GeocodingResult {
  id: number;
  name: string;
  latitude: number;
  longitude: number;
  elevation?: number;
  feature_code?: string;
  country_code?: string;
  admin1?: string; // State or region
  admin2?: string;
  country?: string;
  timezone?: string;
  population?: number;
}

export interface GeocodingResponse {
  results?: GeocodingResult[];
  generationtime_ms?: number;
}

export interface CurrentWeatherData {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: number;
  precipitation: number;
  rain: number;
  showers: number;
  snowfall: number;
  weather_code: number;
  cloud_cover: number;
  pressure_msl: number;
  surface_pressure: number;
  wind_speed_10m: number;
  wind_direction_10m: number;
  wind_gusts_10m: number;
  uv_index: number;
}

export interface HourlyWeatherData {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  dew_point_2m: number[];
  apparent_temperature: number[];
  precipitation_probability: number[];
  precipitation: number[];
  weather_code: number[];
  pressure_msl: number[];
  cloud_cover: number[];
  visibility: number[];
  wind_speed_10m: number[];
  uv_index: number[];
}

export interface DailyWeatherData {
  time: string[];
  weather_code: number[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  apparent_temperature_max: number[];
  apparent_temperature_min: number[];
  sunrise: string[];
  sunset: string[];
  uv_index_max: number[];
  precipitation_sum: number[];
  rain_sum: number[];
  showers_sum: number[];
  snowfall_sum: number[];
  precipitation_hours: number[];
  precipitation_probability_max: number[];
  wind_speed_10m_max: number[];
  wind_gusts_10m_max: number[];
  wind_direction_10m_dominant: number[];
}

export interface WeatherForecastResponse {
  latitude: number;
  longitude: number;
  generationtime_ms: number;
  utc_offset_seconds: number;
  timezone: string;
  timezone_abbreviation: string;
  elevation: number;
  current_units?: Record<string, string>;
  current?: CurrentWeatherData;
  hourly_units?: Record<string, string>;
  hourly?: HourlyWeatherData;
  daily_units?: Record<string, string>;
  daily?: DailyWeatherData;
}

export type TemperatureUnit = 'C' | 'F';
export type WindSpeedUnit = 'kmh' | 'mph' | 'ms';

export interface UserSettings {
  tempUnit: TemperatureUnit;
  windUnit: WindSpeedUnit;
}

export interface LocationInfo {
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
  timezone?: string;
}

export interface WeatherCodeInfo {
  code: number;
  label: string;
  description: string;
  iconName: string;
  bgGradient: string;
  cardBg: string;
  category: 'clear' | 'cloudy' | 'rain' | 'snow' | 'thunder' | 'fog';
}

export interface OutdoorScore {
  overallScore: number; // 0-100
  label: 'Excellent' | 'Good' | 'Fair' | 'Poor' | 'Hazardous';
  runningScore: number;
  cyclingScore: number;
  diningScore: number;
  hikingScore: number;
}

export interface PlanningRecommendation {
  outdoorScore: OutdoorScore;
  clothingSuggestions: string[];
  gearSuggestions: string[];
  healthCautions: { title: string; message: string; severity: 'info' | 'warning' | 'alert' }[];
  bestOutdoorHours: { hour: string; temp: number; icon: string; reason: string }[];
  commuteAdvisory: string;
  summary: string;
}
