import React, { useState, useEffect, useCallback } from 'react';
import { Loader2, Compass, AlertCircle, MapPin, Info, CheckCircle2, Navigation, X } from 'lucide-react';
import { LocationInfo, UserSettings, WeatherForecastResponse } from './types';
import { fetchWeatherForecast, getLocationNameFromCoords } from './services/weatherApi';
import { detectWeatherAlerts, WeatherAlert } from './utils/weatherAlerts';
import { Header } from './components/Header';
import { CurrentWeatherCard } from './components/CurrentWeatherCard';
import { WeatherMetricsGrid } from './components/WeatherMetricsGrid';
import { IntelligencePanel } from './components/IntelligencePanel';
import { HourlyForecast } from './components/HourlyForecast';
import { Forecast7Day } from './components/Forecast7Day';
import { WeatherCharts } from './components/WeatherCharts';
import { FavoriteCitiesModal } from './components/FavoriteCitiesModal';
import { ErrorMessage } from './components/ErrorMessage';
import { WeatherAlertsBanner } from './components/WeatherAlertsBanner';

const DEFAULT_LOCATION: LocationInfo = {
  name: 'Tokyo',
  country: 'Japan',
  latitude: 35.6762,
  longitude: 139.6503,
  timezone: 'Asia/Tokyo'
};

const STORAGE_KEYS = {
  SETTINGS: 'weather_app_settings_v1',
  FAVORITES: 'weather_app_favorites_v1',
  LAST_LOCATION: 'weather_app_last_loc_v1'
};

export default function App() {
  // Load initial settings
  const [settings, setSettings] = useState<UserSettings>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return { tempUnit: 'C', windUnit: 'kmh' };
  });

  // Load saved favorites
  const [favorites, setFavorites] = useState<LocationInfo[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAVORITES);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return [
      { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
      { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
      { name: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' }
    ];
  });

  // Active location
  const [currentLocation, setCurrentLocation] = useState<LocationInfo>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LAST_LOCATION);
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return DEFAULT_LOCATION;
  });

  // Weather state
  const [weatherData, setWeatherData] = useState<WeatherForecastResponse | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Modals & Location Status
  const [isFavoritesOpen, setIsFavoritesOpen] = useState<boolean>(false);
  const [isLoadingGps, setIsLoadingGps] = useState<boolean>(false);
  
  // Location Notice State
  const [locationNotice, setLocationNotice] = useState<{
    type: 'success' | 'denied' | 'info';
    title: string;
    message: string;
  } | null>(null);

  // Save settings to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
    } catch {
      // ignore
    }
  }, [settings]);

  // Save favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.FAVORITES, JSON.stringify(favorites));
    } catch {
      // ignore
    }
  }, [favorites]);

  // Save last location to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.LAST_LOCATION, JSON.stringify(currentLocation));
    } catch {
      // ignore
    }
  }, [currentLocation]);

  // Fetch forecast data whenever currentLocation changes
  const loadWeatherData = useCallback(async (loc: LocationInfo) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchWeatherForecast(loc.latitude, loc.longitude, loc.timezone);
      setWeatherData(data);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to retrieve weather data from Open-Meteo API');
      setWeatherData(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    loadWeatherData(currentLocation);
  }, [currentLocation, loadWeatherData]);

  // Function to request GPS location
  const handleUseCurrentLocation = useCallback((showExplicitMessage: boolean = true) => {
    if (!navigator.geolocation) {
      setLocationNotice({
        type: 'denied',
        title: 'Geolocation Not Supported',
        message: 'Device location services are not supported by your browser. Please enter your city manually in the search bar.'
      });
      return;
    }

    setIsLoadingGps(true);
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const lat = pos.coords.latitude;
        const lon = pos.coords.longitude;
        try {
          const resolvedLoc = await getLocationNameFromCoords(lat, lon);
          setCurrentLocation(resolvedLoc);
          setLocationNotice({
            type: 'success',
            title: 'Current Location Detected',
            message: `Displaying hyper-local weather forecast for ${resolvedLoc.name}.`
          });
        } catch {
          const fallbackLoc: LocationInfo = {
            name: `My GPS Location (${lat.toFixed(2)}°, ${lon.toFixed(2)}°)`,
            latitude: lat,
            longitude: lon
          };
          setCurrentLocation(fallbackLoc);
          setLocationNotice({
            type: 'success',
            title: 'GPS Coordinates Resolved',
            message: `Displaying weather for coordinates ${lat.toFixed(2)}°, ${lon.toFixed(2)}°.`
          });
        } finally {
          setIsLoadingGps(false);
        }
      },
      (err) => {
        setIsLoadingGps(false);
        if (showExplicitMessage) {
          setLocationNotice({
            type: 'denied',
            title: 'Location Services Denied or Unavailable',
            message: `${err.message}. Please manually enter a city name in the search bar above to view weather forecasts.`
          });
        }
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, []);

  // Automatic GPS Detection on First Mount
  useEffect(() => {
    const hasDetectedBefore = sessionStorage.getItem('weather_app_auto_gps_attempted');
    if (!hasDetectedBefore) {
      sessionStorage.setItem('weather_app_auto_gps_attempted', 'true');
      handleUseCurrentLocation(false);
    }
  }, [handleUseCurrentLocation]);

  // Evaluate severe weather alerts for the current city
  const activeAlerts: WeatherAlert[] = weatherData
    ? detectWeatherAlerts(weatherData, settings, currentLocation.name)
    : [];

  // Toggle favorite status
  const isCurrentFavorite = favorites.some(
    (f) => f.name.toLowerCase() === currentLocation.name.toLowerCase()
  );

  const handleToggleFavorite = () => {
    if (isCurrentFavorite) {
      setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== currentLocation.name.toLowerCase()));
    } else {
      setFavorites((prev) => [...prev, currentLocation]);
    }
  };

  const handleRemoveFavoriteByName = (cityName: string) => {
    setFavorites((prev) => prev.filter((f) => f.name.toLowerCase() !== cityName.toLowerCase()));
  };

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900 font-sans selection:bg-indigo-600 selection:text-white">
      
      {/* Header */}
      <Header
        currentLocation={currentLocation}
        onSelectLocation={(loc) => {
          setCurrentLocation(loc);
          setLocationNotice(null);
        }}
        onUseCurrentLocation={() => handleUseCurrentLocation(true)}
        isLoadingLocation={isLoadingGps}
        settings={settings}
        onUpdateSettings={setSettings}
        onOpenFavorites={() => setIsFavoritesOpen(true)}
        favoriteCount={favorites.length}
      />

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        
        {/* Automatic Location Status Notice Banner */}
        {locationNotice && (
          <div
            id="location-notice-banner"
            className={`p-4 rounded-none border text-xs sm:text-sm flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs ${
              locationNotice.type === 'success'
                ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
                : 'bg-amber-50 border-amber-300 text-amber-950'
            }`}
          >
            <div className="flex items-start space-x-3">
              {locationNotice.type === 'success' ? (
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <Navigation className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              )}
              <div>
                <span className="font-extrabold uppercase tracking-wider block text-[11px]">
                  {locationNotice.title}
                </span>
                <p className="font-medium text-slate-700 mt-0.5 leading-relaxed">
                  {locationNotice.message}
                </p>
                <p className="text-[10px] text-slate-500 mt-1">
                  Location Control: We access GPS coordinates solely to query hyper-local weather forecasts. No user tracking or coordinate storage.
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-2 shrink-0 pt-2 sm:pt-0">
              {locationNotice.type === 'denied' && (
                <button
                  onClick={() => handleUseCurrentLocation(true)}
                  className="px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs uppercase tracking-wider rounded-none transition"
                >
                  Retry GPS
                </button>
              )}
              <button
                onClick={() => setLocationNotice(null)}
                className="p-1.5 text-slate-500 hover:text-slate-800 transition"
                title="Dismiss message"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* Severe Weather Alerts System Banner */}
        {weatherData && activeAlerts.length > 0 && (
          <WeatherAlertsBanner
            alerts={activeAlerts}
            cityName={currentLocation.name}
          />
        )}

        {/* Loading Spinner */}
        {isLoading && (
          <div className="py-24 text-center space-y-4 bg-white border border-slate-200 rounded-none shadow-sm max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-none bg-indigo-50 border border-indigo-200 text-indigo-600 flex items-center justify-center mx-auto">
              <Loader2 className="w-8 h-8 animate-spin" />
            </div>
            <div>
              <p className="text-lg font-extrabold text-slate-900 uppercase tracking-tight">Fetching Weather Data for {currentLocation.name}</p>
              <p className="text-xs text-slate-500 font-mono mt-1">Connecting to Open-Meteo Forecast API...</p>
            </div>
          </div>
        )}

        {/* Error State */}
        {!isLoading && error && (
          <ErrorMessage
            message={error}
            onRetry={() => loadWeatherData(currentLocation)}
            onSelectCity={(loc) => {
              setCurrentLocation(loc);
              setLocationNotice(null);
            }}
            onUseCurrentLocation={() => handleUseCurrentLocation(true)}
          />
        )}

        {/* Success Weather Dashboard */}
        {!isLoading && !error && weatherData && (
          <div className="space-y-6">
            
            {/* Hero Current Weather */}
            <CurrentWeatherCard
              data={weatherData}
              location={currentLocation}
              settings={settings}
              isFavorite={isCurrentFavorite}
              onToggleFavorite={handleToggleFavorite}
            />

            {/* Weather Intelligence Planning Panel */}
            <IntelligencePanel
              data={weatherData}
              settings={settings}
            />

            {/* Quick Metrics Grid */}
            <WeatherMetricsGrid
              data={weatherData}
              settings={settings}
            />

            {/* Hourly 24-Hour Slider */}
            <HourlyForecast
              data={weatherData}
              settings={settings}
            />

            {/* 7-Day Forecast & Analytics Charts Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Forecast7Day
                data={weatherData}
                settings={settings}
              />

              <WeatherCharts
                data={weatherData}
                settings={settings}
              />
            </div>

          </div>
        )}

      </main>

      {/* Favorites Drawer Modal */}
      <FavoriteCitiesModal
        isOpen={isFavoritesOpen}
        onClose={() => setIsFavoritesOpen(false)}
        favorites={favorites}
        onSelectFavorite={(loc) => {
          setCurrentLocation(loc);
          setLocationNotice(null);
        }}
        onRemoveFavorite={handleRemoveFavoriteByName}
        currentLocationName={currentLocation.name}
      />

      {/* Footer */}
      <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500 space-y-2 mt-12">
        <p className="flex items-center justify-center space-x-1.5 font-bold uppercase tracking-wider text-[11px] text-slate-700">
          <Compass className="w-4 h-4 text-indigo-600" />
          <span>Weather Intelligence • Geometric Precision Engine</span>
        </p>
        <p className="text-slate-500 max-w-xl mx-auto text-[11px]">
          Powered strictly by Open-Meteo Geocoding API & Forecast API. Zero private keys or client tracking.
        </p>
      </footer>
    </div>
  );
}
