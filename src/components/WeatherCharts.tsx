import React, { useState } from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  ComposedChart,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  Legend
} from 'recharts';
import { TrendingUp, Droplets, Wind, Thermometer, Calendar, Info } from 'lucide-react';
import { WeatherForecastResponse, UserSettings } from '../types';
import { convertTemp, convertWindSpeed } from '../utils/weatherUtils';

interface WeatherChartsProps {
  data: WeatherForecastResponse;
  settings: UserSettings;
}

type ChartMetric = 'temperature' | 'precipitation' | 'windUv';

export const WeatherCharts: React.FC<WeatherChartsProps> = ({ data, settings }) => {
  const [activeMetric, setActiveMetric] = useState<ChartMetric>('temperature');
  const [viewMode, setViewMode] = useState<'24h' | '7d'>('7d');

  const hourly = data.hourly;
  const daily = data.daily;

  if (!hourly || !hourly.time) return null;

  // Prepare 24-hour chart dataset
  const chartData24h = hourly.time.slice(0, 24).map((timeStr, idx) => {
    const d = new Date(timeStr);
    const hourLabel = idx === 0 ? 'Now' : d.toLocaleTimeString([], { hour: 'numeric', hour12: true });

    const rawTemp = hourly.temperature_2m[idx];
    const rawApparent = hourly.apparent_temperature[idx];
    const rawWind = hourly.wind_speed_10m[idx] || 0;

    return {
      time: hourLabel,
      temp: convertTemp(rawTemp, settings.tempUnit),
      feelsLike: convertTemp(rawApparent, settings.tempUnit),
      rainProb: hourly.precipitation_probability[idx] || 0,
      precipitation: hourly.precipitation[idx] || 0,
      windSpeed: convertWindSpeed(rawWind, settings.windUnit),
      uvIndex: hourly.uv_index[idx] || 0
    };
  });

  // Prepare 7-day chart dataset
  const chartData7d = daily && daily.time ? daily.time.map((timeStr, idx) => {
    const d = new Date(timeStr);
    const dayLabel = idx === 0 ? 'Today' : d.toLocaleDateString([], { weekday: 'short', month: 'numeric', day: 'numeric' });

    const rawMax = daily.temperature_2m_max[idx];
    const rawMin = daily.temperature_2m_min[idx];
    const rawWindMax = daily.wind_speed_10m_max[idx] || 0;

    return {
      time: dayLabel,
      highTemp: convertTemp(rawMax, settings.tempUnit),
      lowTemp: convertTemp(rawMin, settings.tempUnit),
      spread: Math.round(convertTemp(rawMax, settings.tempUnit) - convertTemp(rawMin, settings.tempUnit)),
      rainProb: daily.precipitation_probability_max?.[idx] ?? 0,
      precipitation: Number((daily.precipitation_sum?.[idx] ?? 0).toFixed(1)),
      windSpeed: convertWindSpeed(rawWindMax, settings.windUnit),
      uvIndex: daily.uv_index_max?.[idx] ?? 0
    };
  }) : [];

  const currentDataset = viewMode === '24h' ? chartData24h : chartData7d;

  // 7-Day Summary Statistics
  const maxHigh7d = chartData7d.length > 0 ? Math.max(...chartData7d.map(d => d.highTemp)) : 0;
  const minLow7d = chartData7d.length > 0 ? Math.min(...chartData7d.map(d => d.lowTemp)) : 0;
  const maxRainProb7d = chartData7d.length > 0 ? Math.max(...chartData7d.map(d => d.rainProb)) : 0;
  const totalRain7d = chartData7d.length > 0 ? chartData7d.reduce((acc, curr) => acc + curr.precipitation, 0).toFixed(1) : '0';

  return (
    <div id="weather-analytics-charts-section" className="p-5 sm:p-6 rounded-none bg-white border border-slate-200 shadow-sm space-y-5">
      
      {/* Header & Metric Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-3 border-b border-slate-200">
        <div className="flex items-center space-x-2">
          <TrendingUp className="w-4 h-4 text-indigo-600" />
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900">Weather Trends & Analytics</h3>
            <p className="text-[10px] text-slate-500 font-mono">
              {viewMode === '7d' ? '7-Day Extended Forecast Visualizations' : '24-Hour Hourly Trend Visualizations'}
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {/* 24h vs 7d toggle */}
          <div className="flex rounded-none bg-slate-100 p-0.5 border border-slate-300 text-xs font-bold font-mono">
            <button
              onClick={() => setViewMode('7d')}
              className={`px-3 py-1 rounded-none transition uppercase ${
                viewMode === '7d' ? 'bg-indigo-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              7-Day
            </button>
            <button
              onClick={() => setViewMode('24h')}
              className={`px-3 py-1 rounded-none transition uppercase ${
                viewMode === '24h' ? 'bg-indigo-600 text-white font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              24-Hour
            </button>
          </div>

          {/* Metric Selector Tabs */}
          <div className="flex rounded-none bg-slate-100 p-0.5 border border-slate-300 text-xs font-bold">
            <button
              onClick={() => setActiveMetric('temperature')}
              className={`px-2.5 py-1 rounded-none flex items-center space-x-1 transition ${
                activeMetric === 'temperature' ? 'bg-white text-indigo-700 border border-slate-300 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Thermometer className="w-3.5 h-3.5" />
              <span>Temp Extremes</span>
            </button>

            <button
              onClick={() => setActiveMetric('precipitation')}
              className={`px-2.5 py-1 rounded-none flex items-center space-x-1 transition ${
                activeMetric === 'precipitation' ? 'bg-white text-indigo-700 border border-slate-300 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Droplets className="w-3.5 h-3.5" />
              <span>Rain Probability</span>
            </button>

            <button
              onClick={() => setActiveMetric('windUv')}
              className={`px-2.5 py-1 rounded-none flex items-center space-x-1 transition ${
                activeMetric === 'windUv' ? 'bg-white text-indigo-700 border border-slate-300 shadow-xs font-black' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Wind className="w-3.5 h-3.5" />
              <span>Wind & UV</span>
            </button>
          </div>
        </div>
      </div>

      {/* 7-Day Contextual Metric Badges */}
      {viewMode === '7d' && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
          <div className="p-2.5 bg-amber-50/80 border border-amber-200 rounded-none flex items-center space-x-2.5">
            <Thermometer className="w-4 h-4 text-amber-600 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-amber-800 block">7-Day Temp Range</span>
              <span className="text-xs font-mono font-black text-amber-950">
                Low {minLow7d}°{settings.tempUnit} • High {maxHigh7d}°{settings.tempUnit}
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-indigo-50/80 border border-indigo-200 rounded-none flex items-center space-x-2.5">
            <Droplets className="w-4 h-4 text-indigo-600 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-indigo-800 block">Peak Rain Prob</span>
              <span className="text-xs font-mono font-black text-indigo-950">
                {maxRainProb7d}% Max Probability
              </span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-none col-span-2 sm:col-span-1 flex items-center space-x-2.5">
            <Calendar className="w-4 h-4 text-slate-600 shrink-0" />
            <div>
              <span className="text-[10px] font-extrabold uppercase tracking-widest text-slate-700 block">7-Day Total Rain</span>
              <span className="text-xs font-mono font-black text-slate-900">
                {totalRain7d} mm expected
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recharts Render Container */}
      <div className="h-64 sm:h-72 w-full pt-2">
        <ResponsiveContainer width="100%" height="100%">
          {activeMetric === 'temperature' ? (
            <AreaChart data={currentDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="tempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#4f46e5" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#4f46e5" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="highTempGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#d97706" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#d97706" stopOpacity={0.05} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis stroke="#64748b" fontSize={11} fontFamily="monospace" unit={`°${settings.tempUnit}`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#0f172a',
                  borderRadius: '0px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              
              {viewMode === '24h' ? (
                <>
                  <Area
                    type="monotone"
                    dataKey="temp"
                    name={`Hourly Temp (°${settings.tempUnit})`}
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#tempGradient)"
                  />
                  <Area
                    type="monotone"
                    dataKey="feelsLike"
                    name={`Feels Like (°${settings.tempUnit})`}
                    stroke="#0284c7"
                    strokeWidth={1.5}
                    strokeDasharray="4 4"
                    fill="none"
                  />
                </>
              ) : (
                <>
                  <Area
                    type="monotone"
                    dataKey="highTemp"
                    name={`Daily Max Temp (°${settings.tempUnit})`}
                    stroke="#d97706"
                    strokeWidth={2.5}
                    fillOpacity={1}
                    fill="url(#highTempGradient)"
                    dot={{ r: 4, fill: '#d97706' }}
                  />
                  <Area
                    type="monotone"
                    dataKey="lowTemp"
                    name={`Daily Min Temp (°${settings.tempUnit})`}
                    stroke="#4f46e5"
                    strokeWidth={2.5}
                    fill="none"
                    dot={{ r: 4, fill: '#4f46e5' }}
                  />
                </>
              )}
            </AreaChart>
          ) : activeMetric === 'precipitation' ? (
            <ComposedChart data={currentDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis yAxisId="left" stroke="#4f46e5" fontSize={11} fontFamily="monospace" unit="%" domain={[0, 100]} />
              <YAxis yAxisId="right" orientation="right" stroke="#0284c7" fontSize={11} fontFamily="monospace" unit=" mm" />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#0f172a',
                  borderRadius: '0px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Bar
                yAxisId="left"
                dataKey="rainProb"
                name="Rain Probability (%)"
                fill="#4f46e5"
                radius={[0, 0, 0, 0]}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="precipitation"
                name="Accumulation (mm)"
                stroke="#0284c7"
                strokeWidth={2.5}
                dot={{ r: 3, fill: '#0284c7' }}
              />
            </ComposedChart>
          ) : (
            <LineChart data={currentDataset} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="2 2" stroke="#e2e8f0" opacity={0.8} />
              <XAxis dataKey="time" stroke="#64748b" fontSize={11} fontFamily="monospace" />
              <YAxis yAxisId="left" stroke="#4f46e5" fontSize={11} fontFamily="monospace" unit={` ${settings.windUnit}`} />
              <YAxis yAxisId="right" orientation="right" stroke="#d97706" fontSize={11} fontFamily="monospace" domain={[0, 12]} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#0f172a',
                  borderColor: '#0f172a',
                  borderRadius: '0px',
                  color: '#ffffff',
                  fontSize: '12px',
                  fontFamily: 'monospace'
                }}
              />
              <Legend verticalAlign="top" height={36} wrapperStyle={{ fontSize: '11px', fontFamily: 'monospace' }} />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="windSpeed"
                name={viewMode === '7d' ? `Max Wind Speed (${settings.windUnit})` : `Wind Speed (${settings.windUnit})`}
                stroke="#4f46e5"
                strokeWidth={2.5}
                dot={{ r: 3 }}
              />
              <Line
                yAxisId="right"
                type="monotone"
                dataKey="uvIndex"
                name={viewMode === '7d' ? 'Max UV Index' : 'UV Index'}
                stroke="#d97706"
                strokeWidth={2}
                dot={{ r: 3 }}
              />
            </LineChart>
          )}
        </ResponsiveContainer>
      </div>
    </div>
  );
};

