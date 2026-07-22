import React from 'react';
import {
  Sun,
  Droplets,
  Wind,
  Gauge,
  Eye,
  Thermometer,
  Cloud,
  Compass
} from 'lucide-react';
import { WeatherForecastResponse, UserSettings } from '../types';
import {
  formatWindSpeed,
  getUVRating,
  getHumidityRating,
  getWindDirectionLabel,
  formatTemp
} from '../utils/weatherUtils';

interface WeatherMetricsGridProps {
  data: WeatherForecastResponse;
  settings: UserSettings;
}

export const WeatherMetricsGrid: React.FC<WeatherMetricsGridProps> = ({ data, settings }) => {
  const current = data.current;
  const hourly = data.hourly;

  if (!current) return null;

  const uvRating = getUVRating(current.uv_index);
  const humidityRating = getHumidityRating(current.relative_humidity_2m);
  const windDirLabel = getWindDirectionLabel(current.wind_direction_10m);
  const windSpeedFormatted = formatWindSpeed(current.wind_speed_10m, settings.windUnit);
  const windGustFormatted = current.wind_gusts_10m
    ? formatWindSpeed(current.wind_gusts_10m, settings.windUnit)
    : null;

  // Visibility from hourly current hour
  const visibilityMeters = hourly?.visibility?.[0] || 10000;
  const visibilityKm = (visibilityMeters / 1000).toFixed(1);

  // Dew point
  const dewPoint = hourly?.dew_point_2m?.[0] !== undefined
    ? formatTemp(hourly.dew_point_2m[0], settings.tempUnit)
    : '--';

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* UV Index */}
      <div id="uv-index-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Sun className="w-4 h-4 text-amber-500" />
            <span>UV Index</span>
          </span>
          <span className={`px-1.5 py-0.5 rounded-none text-[10px] font-bold border ${uvRating.bgClass} ${uvRating.colorClass}`}>
            {uvRating.label}
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{current.uv_index.toFixed(1)}</span>
          <span className="text-[10px] text-slate-500 font-mono">Scale 0 - 12+</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-none overflow-hidden border border-slate-200">
          <div
            className="h-full bg-gradient-to-r from-emerald-500 via-amber-500 to-purple-600 rounded-none"
            style={{ width: `${Math.min(100, (current.uv_index / 12) * 100)}%` }}
          />
        </div>
      </div>

      {/* Humidity */}
      <div id="humidity-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Droplets className="w-4 h-4 text-indigo-600" />
            <span>Humidity</span>
          </span>
          <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-none">
            {humidityRating.label}
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{current.relative_humidity_2m}%</span>
          <span className="text-[10px] text-slate-500">{humidityRating.description}</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-none overflow-hidden border border-slate-200">
          <div
            className="h-full bg-indigo-600 rounded-none transition-all duration-500"
            style={{ width: `${current.relative_humidity_2m}%` }}
          />
        </div>
      </div>

      {/* Wind & Gusts */}
      <div id="wind-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Wind className="w-4 h-4 text-indigo-600" />
            <span>Wind Speed</span>
          </span>
          <span className="flex items-center space-x-1 text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-200 px-1.5 py-0.5 rounded-none">
            <Compass className="w-3 h-3" />
            <span>{windDirLabel} ({current.wind_direction_10m}°)</span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{windSpeedFormatted}</span>
          {windGustFormatted && (
            <span className="text-[10px] text-slate-500 font-mono">Gusts: {windGustFormatted}</span>
          )}
        </div>
        <div className="mt-2 flex items-center space-x-2 text-[11px] font-medium text-slate-600">
          <div
            className="w-4 h-4 rounded-none bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold text-xs"
            style={{ transform: `rotate(${current.wind_direction_10m}deg)` }}
          >
            ↑
          </div>
          <span>Bearing {windDirLabel}</span>
        </div>
      </div>

      {/* Air Pressure */}
      <div id="pressure-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Gauge className="w-4 h-4 text-emerald-600" />
            <span>Barometer</span>
          </span>
          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-none">
            {current.pressure_msl >= 1013 ? 'Normal' : 'Low'}
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{Math.round(current.pressure_msl)}</span>
          <span className="text-xs text-slate-500 font-mono">hPa</span>
        </div>
        <p className="mt-2 text-[11px] font-medium text-slate-600">
          {current.pressure_msl > 1020 ? 'High stable pressure system' : current.pressure_msl < 1005 ? 'Low pressure / Storm risk' : 'Standard atmospheric pressure'}
        </p>
      </div>

      {/* Visibility */}
      <div id="visibility-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span>Visibility</span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{visibilityKm}</span>
          <span className="text-xs text-slate-500 font-mono">km</span>
        </div>
        <p className="mt-2 text-[11px] font-medium text-slate-600">
          {Number(visibilityKm) >= 10 ? 'Clear distance visibility' : Number(visibilityKm) >= 5 ? 'Moderate visibility' : 'Reduced visibility'}
        </p>
      </div>

      {/* Dew Point */}
      <div id="dewpoint-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Thermometer className="w-4 h-4 text-teal-600" />
            <span>Dew Point</span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{dewPoint}</span>
        </div>
        <p className="mt-2 text-[11px] font-medium text-slate-600">
          Atmospheric saturation point
        </p>
      </div>

      {/* Precipitation Volume */}
      <div id="precipitation-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Droplets className="w-4 h-4 text-blue-600" />
            <span>Precipitation</span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{current.precipitation || 0}</span>
          <span className="text-xs text-slate-500 font-mono">mm</span>
        </div>
        <p className="mt-2 text-[11px] font-medium text-slate-600">
          {current.precipitation > 0 ? 'Active precipitation observed' : 'Zero rain currently'}
        </p>
      </div>

      {/* Cloud Cover */}
      <div id="cloud-cover-metric-card" className="p-4 rounded-none bg-white border border-slate-200 shadow-sm hover:border-slate-400 transition text-slate-900">
        <div className="flex items-center justify-between text-slate-500 text-[11px] font-black uppercase tracking-widest">
          <span className="flex items-center space-x-1.5">
            <Cloud className="w-4 h-4 text-slate-600" />
            <span>Cloud Cover</span>
          </span>
        </div>
        <div className="mt-3 flex items-baseline justify-between">
          <span className="text-2xl sm:text-3xl font-black font-mono text-slate-900">{current.cloud_cover}%</span>
        </div>
        <div className="mt-2 w-full bg-slate-100 h-1.5 rounded-none overflow-hidden border border-slate-200">
          <div
            className="h-full bg-slate-600 rounded-none"
            style={{ width: `${current.cloud_cover}%` }}
          />
        </div>
      </div>
    </div>
  );
};
