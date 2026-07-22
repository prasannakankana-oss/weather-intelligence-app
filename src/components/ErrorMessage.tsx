import React from 'react';
import { AlertCircle, RefreshCw, MapPin, Search } from 'lucide-react';
import { LocationInfo } from '../types';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  onSelectCity: (loc: LocationInfo) => void;
  onUseCurrentLocation: () => void;
}

const SAMPLE_CITIES: LocationInfo[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' }
];

export const ErrorMessage: React.FC<ErrorMessageProps> = ({
  message,
  onRetry,
  onSelectCity,
  onUseCurrentLocation
}) => {
  return (
    <div id="weather-error-card" className="p-8 rounded-none bg-white border border-slate-900 text-slate-900 shadow-md max-w-2xl mx-auto text-center space-y-6">
      <div className="w-16 h-16 rounded-none bg-amber-50 border border-amber-300 text-amber-700 flex items-center justify-center mx-auto">
        <AlertCircle className="w-8 h-8" />
      </div>

      <div>
        <h3 className="text-lg font-black uppercase tracking-wider text-slate-900">Weather Data Unavailable</h3>
        <p className="text-xs sm:text-sm text-slate-700 mt-2 max-w-md mx-auto leading-relaxed font-medium">
          {message || 'Could not retrieve forecast information for the requested location.'}
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Search</span>
        </button>

        <button
          onClick={onUseCurrentLocation}
          className="px-5 py-2.5 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-900 border border-slate-300 font-bold text-xs uppercase tracking-wider flex items-center space-x-2 transition"
        >
          <MapPin className="w-4 h-4 text-indigo-600" />
          <span>Use GPS Location</span>
        </button>
      </div>

      <div className="pt-4 border-t border-slate-200 text-xs space-y-2">
        <span className="text-slate-500 font-bold uppercase tracking-widest text-[10px] flex items-center justify-center space-x-1">
          <Search className="w-3.5 h-3.5" />
          <span>Or select a popular metropolis:</span>
        </span>

        <div className="flex flex-wrap justify-center gap-2 pt-1">
          {SAMPLE_CITIES.map((city) => (
            <button
              key={city.name}
              onClick={() => onSelectCity(city)}
              className="px-3 py-1.5 rounded-none bg-slate-50 hover:bg-slate-100 text-slate-900 border border-slate-200 text-xs font-bold transition"
            >
              {city.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
