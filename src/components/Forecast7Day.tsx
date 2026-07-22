import React, { useState } from 'react';
import { Calendar, Droplets, Sun, Wind, ChevronDown, ChevronUp } from 'lucide-react';
import { WeatherForecastResponse, UserSettings } from '../types';
import { getWeatherInfo, formatTemp, formatDayName, formatWindSpeed } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface Forecast7DayProps {
  data: WeatherForecastResponse;
  settings: UserSettings;
}

export const Forecast7Day: React.FC<Forecast7DayProps> = ({ data, settings }) => {
  const daily = data.daily;
  const [expandedDayIndex, setExpandedDayIndex] = useState<number | null>(0);

  if (!daily || !daily.time || daily.time.length === 0) return null;

  // Calculate overall weekly min & max temp for proportional temperature bar rendering
  const minTempWeek = Math.min(...daily.temperature_2m_min);
  const maxTempWeek = Math.max(...daily.temperature_2m_max);
  const tempRangeSpan = maxTempWeek - minTempWeek || 1;

  return (
    <div id="7day-forecast-section" className="p-5 sm:p-6 rounded-none bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Title */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Calendar className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">7-Day Extended Forecast</h3>
        </div>
        <span className="text-[10px] uppercase font-black tracking-widest text-slate-500">Click entry for details</span>
      </div>

      {/* Daily Cards Stack */}
      <div className="space-y-2">
        {daily.time.map((timeStr, idx) => {
          const maxTemp = daily.temperature_2m_max[idx];
          const minTemp = daily.temperature_2m_min[idx];
          const code = daily.weather_code[idx];
          const rainProb = daily.precipitation_probability_max?.[idx] ?? 0;
          const rainSum = daily.precipitation_sum?.[idx] ?? 0;
          const uvMax = daily.uv_index_max?.[idx] ?? 0;
          const windMax = daily.wind_speed_10m_max?.[idx] ?? 0;
          const info = getWeatherInfo(code);

          const dayLabel = formatDayName(timeStr, idx);
          const isExpanded = expandedDayIndex === idx;

          // Bar calculations
          const barLeftPercent = Math.max(0, Math.min(100, ((minTemp - minTempWeek) / tempRangeSpan) * 100));
          const barWidthPercent = Math.max(12, Math.min(100, ((maxTemp - minTemp) / tempRangeSpan) * 100));

          return (
            <div
              key={timeStr}
              className={`rounded-none border transition-all duration-200 overflow-hidden ${
                isExpanded
                  ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
              }`}
            >
              {/* Primary Card Bar */}
              <button
                onClick={() => setExpandedDayIndex(isExpanded ? null : idx)}
                className="w-full p-3.5 text-left flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                {/* Day name & weather icon */}
                <div className="flex items-center space-x-3 sm:w-1/3">
                  <div className={`p-2 rounded-none border shrink-0 ${isExpanded ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <WeatherIcon name={info.iconName} className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="font-bold text-sm sm:text-base flex items-center space-x-2 font-sans">
                      <span className={isExpanded ? 'text-white' : 'text-slate-900'}>{dayLabel}</span>
                      {idx === 0 && (
                        <span className="px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-widest bg-indigo-600 text-white">
                          Today
                        </span>
                      )}
                    </div>
                    <span className={`text-[11px] font-medium capitalize ${isExpanded ? 'text-slate-300' : 'text-slate-500'}`}>{info.label}</span>
                  </div>
                </div>

                {/* Temperature visual bar */}
                <div className="flex-1 max-w-xs mx-auto sm:mx-0 w-full flex items-center space-x-3">
                  <span className={`text-xs font-mono font-bold w-10 text-right ${isExpanded ? 'text-indigo-300' : 'text-indigo-700'}`}>
                    {formatTemp(minTemp, settings.tempUnit)}
                  </span>

                  <div className={`flex-1 h-2 rounded-none relative overflow-hidden border ${isExpanded ? 'bg-slate-950 border-slate-800' : 'bg-slate-200 border-slate-300'}`}>
                    <div
                      className="absolute h-full rounded-none bg-gradient-to-r from-indigo-500 via-amber-400 to-orange-500"
                      style={{
                        left: `${barLeftPercent}%`,
                        width: `${barWidthPercent}%`
                      }}
                    />
                  </div>

                  <span className={`text-xs font-mono font-bold w-10 text-left ${isExpanded ? 'text-amber-400' : 'text-amber-700'}`}>
                    {formatTemp(maxTemp, settings.tempUnit)}
                  </span>
                </div>

                {/* Rain & UV Badges Right */}
                <div className="flex items-center justify-between sm:justify-end space-x-3 text-xs font-semibold">
                  <span className={`flex items-center space-x-1 font-mono text-[11px] px-2 py-1 rounded-none border ${
                    isExpanded ? 'bg-indigo-950 border-indigo-800 text-indigo-300' : 'bg-indigo-50 border-indigo-200 text-indigo-800'
                  }`}>
                    <Droplets className="w-3.5 h-3.5" />
                    <span>{rainProb}%</span>
                  </span>

                  <span className={isExpanded ? 'text-white' : 'text-slate-400'}>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </span>
                </div>
              </button>

              {/* Expanded Detailed Breakdown Drawer */}
              {isExpanded && (
                <div className="px-4 pb-4 pt-2 border-t border-slate-800 bg-slate-950 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                  <div className="p-2.5 rounded-none bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1">
                      <Droplets className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Rainfall Total</span>
                    </div>
                    <span className="font-black text-white font-mono text-sm">{rainSum} mm</span>
                  </div>

                  <div className="p-2.5 rounded-none bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1">
                      <Sun className="w-3.5 h-3.5 text-amber-400" />
                      <span>Max UV Index</span>
                    </div>
                    <span className="font-black text-white font-mono text-sm">{uvMax}</span>
                  </div>

                  <div className="p-2.5 rounded-none bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1 flex items-center space-x-1">
                      <Wind className="w-3.5 h-3.5 text-indigo-400" />
                      <span>Max Wind Gust</span>
                    </div>
                    <span className="font-black text-white font-mono text-sm">
                      {formatWindSpeed(windMax, settings.windUnit)}
                    </span>
                  </div>

                  <div className="p-2.5 rounded-none bg-slate-900 border border-slate-800">
                    <div className="text-slate-400 font-bold uppercase tracking-wider text-[10px] mb-1">Condition Summary</div>
                    <span className="text-slate-200 font-medium leading-normal">{info.description}</span>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
