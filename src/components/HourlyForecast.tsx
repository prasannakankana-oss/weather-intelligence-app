import React, { useState } from 'react';
import { Clock, Droplets, Wind, ChevronRight, ChevronLeft } from 'lucide-react';
import { WeatherForecastResponse, UserSettings } from '../types';
import { getWeatherInfo, formatTemp, formatWindSpeed } from '../utils/weatherUtils';
import { WeatherIcon } from './WeatherIcon';

interface HourlyForecastProps {
  data: WeatherForecastResponse;
  settings: UserSettings;
}

export const HourlyForecast: React.FC<HourlyForecastProps> = ({ data, settings }) => {
  const hourly = data.hourly;
  const [selectedHourIndex, setSelectedHourIndex] = useState<number>(0);

  if (!hourly || !hourly.time || hourly.time.length === 0) return null;

  // Take next 24 hours starting from index 0
  const hoursToShow = hourly.time.slice(0, 24);

  const handleScroll = (direction: 'left' | 'right') => {
    const el = document.getElementById('hourly-scroll-container');
    if (el) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const activeHourTime = hourly.time[selectedHourIndex];
  const activeTemp = hourly.temperature_2m[selectedHourIndex];
  const activeApparent = hourly.apparent_temperature[selectedHourIndex];
  const activeRainProb = hourly.precipitation_probability[selectedHourIndex] || 0;
  const activePrecip = hourly.precipitation[selectedHourIndex] || 0;
  const activeWind = hourly.wind_speed_10m[selectedHourIndex] || 0;
  const activeUV = hourly.uv_index[selectedHourIndex] || 0;
  const activeCode = hourly.weather_code[selectedHourIndex];
  const activeInfo = getWeatherInfo(activeCode);

  return (
    <div id="hourly-forecast-section" className="p-5 rounded-none bg-white border border-slate-200 shadow-sm space-y-4">
      {/* Section Title */}
      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <Clock className="w-4 h-4 text-indigo-600" />
          <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Hourly Forecast (Next 24 Hours)</h3>
        </div>

        {/* Scroll Buttons */}
        <div className="flex items-center space-x-1">
          <button
            onClick={() => handleScroll('left')}
            className="p-1.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => handleScroll('right')}
            className="p-1.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-700 border border-slate-300 transition"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Hourly Timeline Horizontal Scroll Container */}
      <div
        id="hourly-scroll-container"
        className="flex space-x-3 overflow-x-auto pb-3 pt-1 no-scrollbar scroll-smooth"
      >
        {hoursToShow.map((timeStr, idx) => {
          const temp = hourly.temperature_2m[idx];
          const rainProb = hourly.precipitation_probability[idx] || 0;
          const code = hourly.weather_code[idx];
          const info = getWeatherInfo(code);
          const isSelected = selectedHourIndex === idx;

          const dateObj = new Date(timeStr);
          const hourFormatted = idx === 0 ? 'Now' : dateObj.toLocaleTimeString([], { hour: 'numeric', hour12: true });

          return (
            <button
              key={timeStr}
              onClick={() => setSelectedHourIndex(idx)}
              className={`shrink-0 w-24 p-3 rounded-none flex flex-col items-center justify-between border transition-all duration-200 ${
                isSelected
                  ? 'bg-slate-900 text-white border-slate-900 shadow-sm'
                  : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-800'
              }`}
            >
              <span className={`text-[11px] font-bold uppercase tracking-wider mb-1 ${isSelected ? 'text-indigo-300' : 'text-slate-600'}`}>
                {hourFormatted}
              </span>

              <div className="my-2">
                <WeatherIcon name={info.iconName} className="w-7 h-7" animated={isSelected} />
              </div>

              <span className={`text-sm font-black font-mono ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                {formatTemp(temp, settings.tempUnit)}
              </span>

              {/* Rain prob pill */}
              <div className={`mt-2 flex items-center space-x-0.5 text-[10px] font-bold font-mono px-1.5 py-0.5 rounded-none border ${
                isSelected ? 'bg-indigo-800 text-indigo-200 border-indigo-700' : 'bg-slate-100 text-indigo-700 border-slate-200'
              }`}>
                <Droplets className="w-2.5 h-2.5 shrink-0" />
                <span>{rainProb}%</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Hour Details Bar */}
      <div className="p-3.5 rounded-none bg-slate-50 border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center space-x-3">
          <span className="font-black text-indigo-700 uppercase tracking-wider font-mono">
            Selected Time: {new Date(activeHourTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true })}
          </span>
          <span className="text-slate-700 capitalize font-bold">• {activeInfo.label}</span>
        </div>

        <div className="flex items-center space-x-4 font-mono text-slate-700 font-medium">
          <div>
            Feels: <strong className="text-slate-900 font-bold">{formatTemp(activeApparent, settings.tempUnit)}</strong>
          </div>
          <div>
            Wind: <strong className="text-slate-900 font-bold">{formatWindSpeed(activeWind, settings.windUnit)}</strong>
          </div>
          <div>
            Rain Chance: <strong className="text-indigo-600 font-bold">{activeRainProb}%</strong> ({activePrecip}mm)
          </div>
          <div>
            UV Index: <strong className="text-amber-600 font-bold">{activeUV}</strong>
          </div>
        </div>
      </div>
    </div>
  );
};
