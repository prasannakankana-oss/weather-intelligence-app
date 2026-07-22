import { WeatherCodeInfo, TemperatureUnit, WindSpeedUnit } from '../types';

/**
 * WMO Weather Interpretation Codes (WW) mapping
 */
export const WMO_WEATHER_CODES: Record<number, WeatherCodeInfo> = {
  0: {
    code: 0,
    label: 'Clear Sky',
    description: 'Bright and clear skies',
    iconName: 'Sun',
    bgGradient: 'from-sky-400 via-amber-200 to-amber-400',
    cardBg: 'bg-gradient-to-br from-amber-500/10 via-sky-500/10 to-blue-500/10',
    category: 'clear'
  },
  1: {
    code: 1,
    label: 'Mainly Clear',
    description: 'Mostly clear with minor clouds',
    iconName: 'SunMedium',
    bgGradient: 'from-sky-400 via-blue-300 to-amber-200',
    cardBg: 'bg-gradient-to-br from-sky-500/10 to-amber-500/10',
    category: 'clear'
  },
  2: {
    code: 2,
    label: 'Partly Cloudy',
    description: 'Scattered clouds in the sky',
    iconName: 'CloudSun',
    bgGradient: 'from-blue-400 via-sky-300 to-slate-200',
    cardBg: 'bg-gradient-to-br from-sky-500/10 to-slate-400/10',
    category: 'cloudy'
  },
  3: {
    code: 3,
    label: 'Overcast',
    description: 'Dense cloud cover',
    iconName: 'Cloud',
    bgGradient: 'from-slate-500 via-slate-400 to-zinc-300',
    cardBg: 'bg-gradient-to-br from-slate-500/15 to-zinc-500/15',
    category: 'cloudy'
  },
  45: {
    code: 45,
    label: 'Foggy',
    description: 'Low visibility due to fog',
    iconName: 'CloudFog',
    bgGradient: 'from-slate-400 via-zinc-300 to-gray-200',
    cardBg: 'bg-gradient-to-br from-slate-400/20 to-gray-400/20',
    category: 'fog'
  },
  48: {
    code: 48,
    label: 'Freezing Fog',
    description: 'Depositing rime fog with icy conditions',
    iconName: 'CloudFog',
    bgGradient: 'from-slate-500 via-cyan-200 to-blue-300',
    cardBg: 'bg-gradient-to-br from-cyan-500/20 to-slate-500/20',
    category: 'fog'
  },
  51: {
    code: 51,
    label: 'Light Drizzle',
    description: 'Fine light drizzle',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-400 via-sky-400 to-slate-300',
    cardBg: 'bg-gradient-to-br from-blue-500/15 to-sky-400/15',
    category: 'rain'
  },
  53: {
    code: 53,
    label: 'Moderate Drizzle',
    description: 'Steady light rain drops',
    iconName: 'CloudDrizzle',
    bgGradient: 'from-blue-500 via-sky-500 to-slate-400',
    cardBg: 'bg-gradient-to-br from-blue-600/15 to-sky-500/15',
    category: 'rain'
  },
  55: {
    code: 55,
    label: 'Dense Drizzle',
    description: 'Heavy drizzle soaking atmosphere',
    iconName: 'CloudRain',
    bgGradient: 'from-indigo-500 via-blue-500 to-slate-500',
    cardBg: 'bg-gradient-to-br from-indigo-500/20 to-blue-500/20',
    category: 'rain'
  },
  56: {
    code: 56,
    label: 'Light Freezing Drizzle',
    description: 'Cold drizzle creating thin ice layer',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-500 via-blue-400 to-slate-400',
    cardBg: 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20',
    category: 'rain'
  },
  57: {
    code: 57,
    label: 'Freezing Drizzle',
    description: 'Icy drizzle risk of slippery roads',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-600 via-indigo-400 to-slate-500',
    cardBg: 'bg-gradient-to-br from-cyan-600/20 to-slate-600/20',
    category: 'rain'
  },
  61: {
    code: 61,
    label: 'Slight Rain',
    description: 'Light rain showers',
    iconName: 'CloudRain',
    bgGradient: 'from-sky-500 via-blue-500 to-indigo-400',
    cardBg: 'bg-gradient-to-br from-sky-500/20 to-blue-600/20',
    category: 'rain'
  },
  63: {
    code: 63,
    label: 'Moderate Rain',
    description: 'Steady moderate rainfall',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-600 via-indigo-500 to-slate-600',
    cardBg: 'bg-gradient-to-br from-blue-600/20 to-indigo-600/20',
    category: 'rain'
  },
  65: {
    code: 65,
    label: 'Heavy Rain',
    description: 'Heavy torrential rain',
    iconName: 'CloudRainWind',
    bgGradient: 'from-indigo-700 via-blue-800 to-slate-800',
    cardBg: 'bg-gradient-to-br from-indigo-700/20 to-slate-800/20',
    category: 'rain'
  },
  66: {
    code: 66,
    label: 'Light Freezing Rain',
    description: 'Freezing rain forming glaze',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-600 via-blue-600 to-slate-600',
    cardBg: 'bg-gradient-to-br from-cyan-600/20 to-blue-700/20',
    category: 'rain'
  },
  67: {
    code: 67,
    label: 'Heavy Freezing Rain',
    description: 'Severe icy freezing rainfall',
    iconName: 'CloudSnow',
    bgGradient: 'from-cyan-700 via-indigo-700 to-slate-800',
    cardBg: 'bg-gradient-to-br from-cyan-700/20 to-indigo-800/20',
    category: 'rain'
  },
  71: {
    code: 71,
    label: 'Slight Snow',
    description: 'Light snowfall',
    iconName: 'Snowflake',
    bgGradient: 'from-sky-300 via-indigo-200 to-slate-200',
    cardBg: 'bg-gradient-to-br from-sky-300/20 to-blue-200/20',
    category: 'snow'
  },
  73: {
    code: 73,
    label: 'Moderate Snow',
    description: 'Steady snow falling',
    iconName: 'Snowflake',
    bgGradient: 'from-blue-400 via-sky-200 to-slate-300',
    cardBg: 'bg-gradient-to-br from-blue-400/20 to-sky-300/20',
    category: 'snow'
  },
  75: {
    code: 75,
    label: 'Heavy Snow',
    description: 'Heavy snow accumulations',
    iconName: 'Snowflake',
    bgGradient: 'from-indigo-500 via-blue-300 to-slate-400',
    cardBg: 'bg-gradient-to-br from-indigo-500/20 to-slate-400/20',
    category: 'snow'
  },
  77: {
    code: 77,
    label: 'Snow Grains',
    description: 'Fine ice crystals and snow grains',
    iconName: 'Snowflake',
    bgGradient: 'from-cyan-400 via-blue-300 to-slate-300',
    cardBg: 'bg-gradient-to-br from-cyan-400/20 to-slate-300/20',
    category: 'snow'
  },
  80: {
    code: 80,
    label: 'Light Rain Showers',
    description: 'Brief light rain showers',
    iconName: 'CloudRain',
    bgGradient: 'from-sky-400 via-blue-400 to-indigo-300',
    cardBg: 'bg-gradient-to-br from-sky-400/20 to-indigo-400/20',
    category: 'rain'
  },
  81: {
    code: 81,
    label: 'Moderate Rain Showers',
    description: 'Passing rain showers',
    iconName: 'CloudRain',
    bgGradient: 'from-blue-500 via-indigo-500 to-slate-500',
    cardBg: 'bg-gradient-to-br from-blue-500/20 to-slate-500/20',
    category: 'rain'
  },
  82: {
    code: 82,
    label: 'Violent Rain Showers',
    description: 'Heavy sudden cloudbursts',
    iconName: 'CloudRainWind',
    bgGradient: 'from-indigo-700 via-purple-700 to-slate-800',
    cardBg: 'bg-gradient-to-br from-indigo-700/20 to-purple-800/20',
    category: 'rain'
  },
  85: {
    code: 85,
    label: 'Light Snow Showers',
    description: 'Passing snow flurries',
    iconName: 'Snowflake',
    bgGradient: 'from-sky-300 via-cyan-200 to-slate-300',
    cardBg: 'bg-gradient-to-br from-sky-300/20 to-slate-300/20',
    category: 'snow'
  },
  86: {
    code: 86,
    label: 'Heavy Snow Showers',
    description: 'Intense snow flurries',
    iconName: 'Snowflake',
    bgGradient: 'from-indigo-600 via-blue-400 to-slate-500',
    cardBg: 'bg-gradient-to-br from-indigo-600/20 to-blue-400/20',
    category: 'snow'
  },
  95: {
    code: 95,
    label: 'Thunderstorm',
    description: 'Thunderstorm with lightning strikes',
    iconName: 'CloudLightning',
    bgGradient: 'from-purple-800 via-indigo-900 to-slate-900',
    cardBg: 'bg-gradient-to-br from-purple-800/25 to-slate-900/30',
    category: 'thunder'
  },
  96: {
    code: 96,
    label: 'Thunderstorm with Hail',
    description: 'Thunderstorm accompanied by light hail',
    iconName: 'CloudLightning',
    bgGradient: 'from-violet-900 via-indigo-950 to-slate-900',
    cardBg: 'bg-gradient-to-br from-violet-900/30 to-slate-950/30',
    category: 'thunder'
  },
  99: {
    code: 99,
    label: 'Severe Thunderstorm',
    description: 'Heavy thunderstorm with violent hail',
    iconName: 'CloudLightning',
    bgGradient: 'from-purple-950 via-slate-900 to-zinc-900',
    cardBg: 'bg-gradient-to-br from-purple-950/35 to-zinc-950/35',
    category: 'thunder'
  }
};

export function getWeatherInfo(code: number): WeatherCodeInfo {
  return WMO_WEATHER_CODES[code] || {
    code,
    label: 'Unknown Condition',
    description: 'Weather state uncertain',
    iconName: 'Cloud',
    bgGradient: 'from-slate-500 to-slate-700',
    cardBg: 'bg-slate-500/10',
    category: 'cloudy'
  };
}

/**
 * Temperature conversion helpers
 */
export function convertTemp(celsius: number, unit: TemperatureUnit): number {
  if (unit === 'F') {
    return Math.round((celsius * 9) / 5 + 32);
  }
  return Math.round(celsius);
}

export function formatTemp(celsius: number, unit: TemperatureUnit): string {
  const converted = convertTemp(celsius, unit);
  return `${converted}°${unit}`;
}

/**
 * Wind speed conversion helpers
 */
export function convertWindSpeed(kmh: number, unit: WindSpeedUnit): number {
  if (unit === 'mph') {
    return Math.round(kmh * 0.621371);
  } else if (unit === 'ms') {
    return Math.round((kmh * 1000) / 3600);
  }
  return Math.round(kmh);
}

export function formatWindSpeed(kmh: number, unit: WindSpeedUnit): string {
  const converted = convertWindSpeed(kmh, unit);
  const unitLabel = unit === 'kmh' ? 'km/h' : unit === 'mph' ? 'mph' : 'm/s';
  return `${converted} ${unitLabel}`;
}

/**
 * Convert wind direction in degrees to compass cardinal string
 */
export function getWindDirectionLabel(degrees: number): string {
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round(degrees / 22.5) % 16;
  return directions[index] || 'N';
}

/**
 * UV Index Rating
 */
export function getUVRating(uv: number): { label: string; colorClass: string; bgClass: string } {
  if (uv < 3) {
    return { label: 'Low', colorClass: 'text-emerald-500', bgClass: 'bg-emerald-500/10' };
  } else if (uv < 6) {
    return { label: 'Moderate', colorClass: 'text-amber-500', bgClass: 'bg-amber-500/10' };
  } else if (uv < 8) {
    return { label: 'High', colorClass: 'text-orange-500', bgClass: 'bg-orange-500/10' };
  } else if (uv < 11) {
    return { label: 'Very High', colorClass: 'text-red-500', bgClass: 'bg-red-500/10' };
  }
  return { label: 'Extreme', colorClass: 'text-purple-600', bgClass: 'bg-purple-600/10' };
}

/**
 * Humidity Comfort Level
 */
export function getHumidityRating(humidity: number): { label: string; description: string } {
  if (humidity < 30) {
    return { label: 'Dry', description: 'Air feels dry' };
  } else if (humidity <= 60) {
    return { label: 'Comfortable', description: 'Ideal moisture level' };
  } else if (humidity <= 80) {
    return { label: 'Humid', description: 'Noticeably sticky' };
  }
  return { label: 'Very Humid', description: 'Heavy & muggy feel' };
}

/**
 * Calculate Daylight Progress (%) between sunrise and sunset strings
 */
export function getDaylightProgress(sunriseStr: string, sunsetStr: string, currentTimeISO?: string): { progress: number; isSunUp: boolean; sunriseFormatted: string; sunsetFormatted: string } {
  try {
    const sunrise = new Date(sunriseStr);
    const sunset = new Date(sunsetStr);
    const now = currentTimeISO ? new Date(currentTimeISO) : new Date();

    const sunriseFormatted = sunrise.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const sunsetFormatted = sunset.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    if (now < sunrise) {
      return { progress: 0, isSunUp: false, sunriseFormatted, sunsetFormatted };
    }
    if (now > sunset) {
      return { progress: 100, isSunUp: false, sunriseFormatted, sunsetFormatted };
    }

    const totalDuration = sunset.getTime() - sunrise.getTime();
    const elapsed = now.getTime() - sunrise.getTime();
    const progress = Math.min(100, Math.max(0, Math.round((elapsed / totalDuration) * 100)));

    return { progress, isSunUp: true, sunriseFormatted, sunsetFormatted };
  } catch {
    return { progress: 50, isSunUp: true, sunriseFormatted: '--:--', sunsetFormatted: '--:--' };
  }
}

/**
 * Format local ISO time string or date to readable day string
 */
export function formatDayName(dateStr: string, index: number): string {
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
}

export function formatHourTime(isoStr: string): string {
  const d = new Date(isoStr);
  return d.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}
