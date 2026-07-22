import React from 'react';
import {
  MapPin,
  Bookmark,
  BookmarkCheck,
  Sunrise,
  Sunset,
  Clock,
  Sparkles,
  ArrowDown,
  ArrowUp,
  Sun,
  Moon
} from 'lucide-react';
import { WeatherForecastResponse, LocationInfo, UserSettings } from '../types';
import { getWeatherInfo, formatTemp, getDaylightProgress } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface CurrentWeatherCardProps {
  data: WeatherForecastResponse;
  location: LocationInfo;
  settings: UserSettings;
  isFavorite: boolean;
  onToggleFavorite: () => void;
}

export const CurrentWeatherCard: React.FC<CurrentWeatherCardProps> = ({
  data,
  location,
  settings,
  isFavorite,
  onToggleFavorite
}) => {
  const current = data.current;
  const daily = data.daily;

  if (!current) return null;

  const weatherInfo = getWeatherInfo(current.weather_code);
  const isDay = current.is_day === 1;

  // Temps
  const currentTempStr = formatTemp(current.temperature_2m, settings.tempUnit);
  const apparentTempStr = formatTemp(current.apparent_temperature, settings.tempUnit);

  const maxTempToday = daily?.temperature_2m_max?.[0] !== undefined
    ? formatTemp(daily.temperature_2m_max[0], settings.tempUnit)
    : '--';
  const minTempToday = daily?.temperature_2m_min?.[0] !== undefined
    ? formatTemp(daily.temperature_2m_min[0], settings.tempUnit)
    : '--';

  // Daylight calculation
  const sunriseStr = daily?.sunrise?.[0] || '';
  const sunsetStr = daily?.sunset?.[0] || '';
  const daylight = getDaylightProgress(sunriseStr, sunsetStr, current.time);

  // Formatting local time
  const localTimeFormatted = new Date().toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit',
    timeZoneName: 'short'
  });

  return (
    <div
      id="current-weather-hero-card"
      className="relative overflow-hidden rounded-none p-6 sm:p-8 text-white shadow-md transition-all border border-slate-900 bg-slate-900"
    >
      {/* Background Subtle Accent Lines */}
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/10 -rotate-45 pointer-events-none transform translate-x-16 -translate-y-16 border border-indigo-500/20" />

      {/* Hero Header */}
      <div className="relative z-10 flex flex-wrap items-start justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <MapPin className="w-5 h-5 text-indigo-400" />
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white uppercase font-sans">
              {location.name}
            </h2>
            {location.country && (
              <span className="px-2.5 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-widest bg-slate-800 text-slate-300 border border-slate-700">
                {[location.admin1, location.country].filter(Boolean).join(', ')}
              </span>
            )}
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1 flex items-center space-x-2">
            <Clock className="w-3.5 h-3.5 text-indigo-400" />
            <span>Local Time • {data.timezone}</span>
          </p>
        </div>

        {/* Favorite & Day/Night Badge */}
        <div className="flex items-center space-x-2">
          <span className="px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider bg-slate-800 border border-slate-700 text-slate-200 flex items-center space-x-1.5">
            {isDay ? (
              <>
                <Sun className="w-4 h-4 text-amber-400" />
                <span>Daytime</span>
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 text-indigo-400" />
                <span>Nighttime</span>
              </>
            )}
          </span>

          <button
            id="toggle-favorite-btn"
            onClick={onToggleFavorite}
            className={`p-2 rounded-none border transition-all duration-200 ${
              isFavorite
                ? 'bg-amber-400 text-slate-950 border-amber-400 font-bold'
                : 'bg-slate-800 hover:bg-slate-700 text-slate-200 border-slate-700'
            }`}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
          >
            {isFavorite ? <BookmarkCheck className="w-5 h-5" /> : <Bookmark className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Hero Temperature & Condition Display */}
      <div className="relative z-10 mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
        <div className="flex items-center space-x-6">
          <div className="p-4 rounded-none bg-slate-800 border border-slate-700 shrink-0">
            <WeatherIcon name={weatherInfo.iconName} className="w-16 h-16 sm:w-20 sm:h-20" animated />
          </div>
          <div>
            <div className="text-6xl sm:text-7xl font-black font-mono tracking-tighter text-white">
              {currentTempStr}
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 mt-1 flex items-center space-x-2">
              <span>Feels like <strong className="font-bold font-mono text-indigo-300 text-sm ml-1">{apparentTempStr}</strong></span>
            </div>
          </div>
        </div>

        {/* Condition details & High/Low */}
        <div className="flex flex-col md:items-end justify-center space-y-3">
          <div className="px-4 py-2.5 rounded-none bg-slate-800 border border-slate-700 md:text-right">
            <div className="text-xl sm:text-2xl font-black uppercase tracking-wide text-white">
              {weatherInfo.label}
            </div>
            <p className="text-xs text-slate-300 mt-0.5">{weatherInfo.description}</p>
          </div>

          <div className="flex items-center space-x-4 text-xs font-bold uppercase tracking-wider bg-slate-950 px-4 py-2 rounded-none border border-slate-800 font-mono">
            <div className="flex items-center text-amber-400">
              <ArrowUp className="w-4 h-4 mr-0.5" />
              <span>High: {maxTempToday}</span>
            </div>
            <div className="w-px h-4 bg-slate-800" />
            <div className="flex items-center text-indigo-400">
              <ArrowDown className="w-4 h-4 mr-0.5" />
              <span>Low: {minTempToday}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Sunrise / Sunset Progress Arc */}
      {sunriseStr && sunsetStr && (
        <div className="relative z-10 mt-8 pt-6 border-t border-slate-800">
          <div className="flex items-center justify-between text-xs font-bold uppercase tracking-wider mb-2">
            <div className="flex items-center space-x-1.5 text-amber-400">
              <Sunrise className="w-4 h-4" />
              <span>Sunrise {daylight.sunriseFormatted}</span>
            </div>

            <div className="flex items-center space-x-1 text-slate-400 text-[10px] tracking-widest">
              <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
              <span>Daylight Tracker</span>
            </div>

            <div className="flex items-center space-x-1.5 text-orange-400">
              <Sunset className="w-4 h-4" />
              <span>Sunset {daylight.sunsetFormatted}</span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="relative w-full h-2 bg-slate-950 rounded-none overflow-hidden border border-slate-800">
            <div
              className="h-full bg-gradient-to-r from-amber-400 via-amber-300 to-indigo-500 rounded-none transition-all duration-1000"
              style={{ width: `${daylight.progress}%` }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
