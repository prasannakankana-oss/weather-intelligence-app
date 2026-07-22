import React, { useState } from 'react';
import {
  AlertTriangle,
  Zap,
  CloudRain,
  Snowflake,
  Wind,
  Sun,
  Thermometer,
  Eye,
  ChevronDown,
  ChevronUp,
  X,
  ShieldAlert,
  Clock,
  Info
} from 'lucide-react';
import { WeatherAlert } from '../utils/weatherAlerts';

interface WeatherAlertsBannerProps {
  alerts: WeatherAlert[];
  cityName: string;
}

export const WeatherAlertsBanner: React.FC<WeatherAlertsBannerProps> = ({ alerts, cityName }) => {
  const [isExpanded, setIsExpanded] = useState<boolean>(true);
  const [dismissedIds, setDismissedIds] = useState<string[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const visibleAlerts = alerts.filter(a => !dismissedIds.includes(a.id));

  if (visibleAlerts.length === 0) return null;

  const currentAlert = visibleAlerts[activeIndex] || visibleAlerts[0];

  const getAlertStyle = (type: WeatherAlert['type'], severity: WeatherAlert['severity']) => {
    switch (type) {
      case 'thunderstorm':
        return {
          bg: 'bg-amber-950/90 border-amber-500',
          badgeBg: 'bg-amber-500 text-slate-950',
          icon: <Zap className="w-5 h-5 text-amber-400 animate-pulse" />,
          titleColor: 'text-amber-200',
          accentBorder: 'border-amber-500',
          recBg: 'bg-amber-900/60 border-amber-700/60 text-amber-100'
        };
      case 'heavy_rain':
        return {
          bg: 'bg-blue-950/90 border-blue-500',
          badgeBg: 'bg-blue-600 text-white',
          icon: <CloudRain className="w-5 h-5 text-blue-400" />,
          titleColor: 'text-blue-200',
          accentBorder: 'border-blue-500',
          recBg: 'bg-blue-900/60 border-blue-700/60 text-blue-100'
        };
      case 'heavy_snow':
      case 'extreme_cold':
        return {
          bg: 'bg-cyan-950/90 border-cyan-400',
          badgeBg: 'bg-cyan-500 text-slate-950',
          icon: type === 'heavy_snow' ? <Snowflake className="w-5 h-5 text-cyan-300" /> : <Thermometer className="w-5 h-5 text-cyan-300" />,
          titleColor: 'text-cyan-200',
          accentBorder: 'border-cyan-400',
          recBg: 'bg-cyan-900/60 border-cyan-700/60 text-cyan-100'
        };
      case 'high_wind':
        return {
          bg: 'bg-indigo-950/90 border-indigo-400',
          badgeBg: 'bg-indigo-500 text-white',
          icon: <Wind className="w-5 h-5 text-indigo-300" />,
          titleColor: 'text-indigo-200',
          accentBorder: 'border-indigo-400',
          recBg: 'bg-indigo-900/60 border-indigo-700/60 text-indigo-100'
        };
      case 'extreme_heat':
        return {
          bg: 'bg-rose-950/90 border-rose-500',
          badgeBg: 'bg-rose-600 text-white',
          icon: <Sun className="w-5 h-5 text-rose-400 animate-spin" style={{ animationDuration: '12s' }} />,
          titleColor: 'text-rose-200',
          accentBorder: 'border-rose-500',
          recBg: 'bg-rose-900/60 border-rose-700/60 text-rose-100'
        };
      case 'dense_fog':
        return {
          bg: 'bg-slate-900/95 border-slate-400',
          badgeBg: 'bg-slate-600 text-white',
          icon: <Eye className="w-5 h-5 text-slate-300" />,
          titleColor: 'text-slate-100',
          accentBorder: 'border-slate-400',
          recBg: 'bg-slate-800 border-slate-700 text-slate-200'
        };
      case 'extreme_uv':
      default:
        return {
          bg: 'bg-purple-950/90 border-purple-500',
          badgeBg: 'bg-purple-600 text-white',
          icon: <AlertTriangle className="w-5 h-5 text-purple-300" />,
          titleColor: 'text-purple-200',
          accentBorder: 'border-purple-500',
          recBg: 'bg-purple-900/60 border-purple-700/60 text-purple-100'
        };
    }
  };

  const style = getAlertStyle(currentAlert.type, currentAlert.severity);

  const handleDismiss = (id: string) => {
    setDismissedIds(prev => [...prev, id]);
    if (activeIndex >= visibleAlerts.length - 1) {
      setActiveIndex(Math.max(0, visibleAlerts.length - 2));
    }
  };

  return (
    <div
      id="severe-weather-alerts-container"
      className={`rounded-none border-2 shadow-lg transition-all duration-300 overflow-hidden ${style.bg}`}
    >
      {/* Top Banner Control Header */}
      <div className="p-4 flex flex-wrap items-center justify-between gap-3 border-b border-white/10">
        <div className="flex items-center space-x-3">
          <div className="p-2 bg-slate-900/80 border border-white/20 shrink-0">
            {style.icon}
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className={`px-2 py-0.5 text-[9px] font-black uppercase tracking-widest ${style.badgeBg}`}>
                {currentAlert.severity} ALERT
              </span>
              <span className="text-xs font-mono font-bold text-white/90">
                {cityName}
              </span>
              {visibleAlerts.length > 1 && (
                <span className="px-2 py-0.5 text-[9px] font-bold bg-white/10 text-white font-mono">
                  {activeIndex + 1} of {visibleAlerts.length} Active Alerts
                </span>
              )}
            </div>

            <h2 className={`text-sm sm:text-base font-black uppercase tracking-wide mt-1 ${style.titleColor}`}>
              {currentAlert.title}
            </h2>
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center space-x-2">
          {visibleAlerts.length > 1 && (
            <div className="flex items-center space-x-1 mr-2">
              <button
                onClick={() => setActiveIndex(prev => (prev > 0 ? prev - 1 : visibleAlerts.length - 1))}
                className="px-2 py-1 text-xs font-mono bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                title="Previous alert"
              >
                &larr; Prev
              </button>
              <button
                onClick={() => setActiveIndex(prev => (prev < visibleAlerts.length - 1 ? prev + 1 : 0))}
                className="px-2 py-1 text-xs font-mono bg-white/10 hover:bg-white/20 text-white border border-white/20 transition"
                title="Next alert"
              >
                Next &rarr;
              </button>
            </div>
          )}

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-white/20 transition"
            title={isExpanded ? 'Collapse Alert Details' : 'Expand Alert Details'}
          >
            {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          <button
            onClick={() => handleDismiss(currentAlert.id)}
            className="p-2 text-white/80 hover:text-white bg-white/10 hover:bg-rose-600 transition"
            title="Dismiss this alert"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Expanded Alert Details Body */}
      {isExpanded && (
        <div className="p-4 sm:p-5 space-y-3.5 bg-black/20 text-white">
          {/* Timing & Metric Badge */}
          <div className="flex flex-wrap items-center gap-3 text-xs font-mono">
            <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/10 border border-white/20 text-amber-300 font-bold">
              <Clock className="w-3.5 h-3.5" />
              <span>{currentAlert.timing}</span>
            </span>

            {currentAlert.metricValue && (
              <span className="flex items-center space-x-1.5 px-2.5 py-1 bg-white/10 border border-white/20 text-cyan-300 font-bold">
                <ShieldAlert className="w-3.5 h-3.5" />
                <span>Impact Index: {currentAlert.metricValue}</span>
              </span>
            )}
          </div>

          {/* Description */}
          <p className="text-xs sm:text-sm text-slate-100 leading-relaxed font-sans">
            {currentAlert.description}
          </p>

          {/* Actionable Safety Recommendation Box */}
          <div className={`p-3.5 border rounded-none flex items-start space-x-3 ${style.recBg}`}>
            <Info className="w-4 h-4 shrink-0 mt-0.5 text-amber-300" />
            <div className="space-y-0.5">
              <span className="text-[10px] uppercase font-black tracking-widest text-amber-300 block">
                Safety Recommendation
              </span>
              <p className="text-xs font-semibold leading-relaxed font-sans">
                {currentAlert.recommendation}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
