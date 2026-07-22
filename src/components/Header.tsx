import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  MapPin,
  Compass,
  Bookmark,
  Sparkles,
  X,
  Loader2,
  SlidersHorizontal,
  Check
} from 'lucide-react';
import { GeocodingResult, LocationInfo, UserSettings, TemperatureUnit, WindSpeedUnit } from '../types';
import { searchCities } from '../services/weatherApi';

interface HeaderProps {
  currentLocation: LocationInfo;
  onSelectLocation: (loc: LocationInfo) => void;
  onUseCurrentLocation: () => void;
  isLoadingLocation: boolean;
  settings: UserSettings;
  onUpdateSettings: (newSettings: UserSettings) => void;
  onOpenFavorites: () => void;
  favoriteCount: number;
}

const POPULAR_CITIES: LocationInfo[] = [
  { name: 'Tokyo', country: 'Japan', latitude: 35.6762, longitude: 139.6503, timezone: 'Asia/Tokyo' },
  { name: 'New York', admin1: 'New York', country: 'United States', latitude: 40.7128, longitude: -74.006, timezone: 'America/New_York' },
  { name: 'London', country: 'United Kingdom', latitude: 51.5074, longitude: -0.1278, timezone: 'Europe/London' },
  { name: 'Paris', country: 'France', latitude: 48.8566, longitude: 2.3522, timezone: 'Europe/Paris' },
  { name: 'Sydney', country: 'Australia', latitude: -33.8688, longitude: 151.2093, timezone: 'Australia/Sydney' },
  { name: 'Rio de Janeiro', country: 'Brazil', latitude: -22.9068, longitude: -43.1729, timezone: 'America/Sao_Paulo' },
  { name: 'Cairo', country: 'Egypt', latitude: 30.0444, longitude: 31.2357, timezone: 'Africa/Cairo' },
  { name: 'Mumbai', country: 'India', latitude: 19.076, longitude: 72.8777, timezone: 'Asia/Kolkata' }
];

export const Header: React.FC<HeaderProps> = ({
  currentLocation,
  onSelectLocation,
  onUseCurrentLocation,
  isLoadingLocation,
  settings,
  onUpdateSettings,
  onOpenFavorites,
  favoriteCount
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchError, setSearchError] = useState<string | null>(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);

  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Debounced geocoding search
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (trimmed.length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      setSearchError(null);
      return;
    }

    setIsSearching(true);
    setSearchError(null);

    const timer = setTimeout(async () => {
      try {
        const results = await searchCities(trimmed);
        setSearchResults(results);
        if (results.length === 0) {
          setSearchError(`No cities found matching "${trimmed}"`);
        }
      } catch (err: unknown) {
        setSearchError(err instanceof Error ? err.message : 'Search failed');
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectResult = (res: GeocodingResult) => {
    const loc: LocationInfo = {
      name: res.name,
      country: res.country,
      admin1: res.admin1,
      latitude: res.latitude,
      longitude: res.longitude,
      timezone: res.timezone
    };
    onSelectLocation(loc);
    setSearchQuery('');
    setShowDropdown(false);
  };

  const handleSelectPopular = (city: LocationInfo) => {
    onSelectLocation(city);
  };

  return (
    <header className="sticky top-0 z-30 bg-slate-900 border-b border-slate-800 text-slate-100 transition-all shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          
          {/* Logo & Brand */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => handleSelectPopular(POPULAR_CITIES[0])}>
              <div className="w-10 h-10 rounded-none bg-indigo-600 flex items-center justify-center border border-indigo-500 shadow-sm text-white">
                <Compass className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-xl font-black tracking-tight text-white uppercase font-sans">
                    Weather Intelligence
                  </h1>
                  <span className="inline-flex items-center px-2 py-0.5 rounded-none text-[10px] font-bold uppercase tracking-widest bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
                    <Sparkles className="w-3 h-3 mr-1" />
                    Open-Meteo
                  </span>
                </div>
                <p className="text-xs text-slate-400 font-medium tracking-wide">Forecasts & Geometric Planning Engine</p>
              </div>
            </div>

            {/* Mobile Controls Right */}
            <div className="flex items-center space-x-2 md:hidden">
              <button
                id="mobile-favorites-btn"
                onClick={onOpenFavorites}
                className="relative p-2 rounded-none bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 transition"
                title="Saved Favorite Cities"
              >
                <Bookmark className="w-5 h-5" />
                {favoriteCount > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 rounded-none bg-indigo-600 text-white font-bold text-xs flex items-center justify-center border border-slate-900">
                    {favoriteCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Center: Search Bar with Autocomplete */}
          <div className="relative flex-1 max-w-lg" ref={searchContainerRef}>
            <div className="relative flex items-center">
              <Search className="absolute left-3.5 w-4 h-4 text-slate-400 pointer-events-none" />
              <input
                id="city-search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowDropdown(true);
                }}
                onFocus={() => setShowDropdown(true)}
                placeholder="Search city, state, or country..."
                className="w-full pl-10 pr-24 py-2 bg-slate-800 focus:bg-slate-950 border border-slate-700 focus:border-indigo-500 rounded-none text-sm text-slate-100 placeholder-slate-400 focus:outline-none transition font-sans"
              />
              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery('');
                    setSearchResults([]);
                  }}
                  className="absolute right-14 p-1 text-slate-400 hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                id="gps-location-btn"
                onClick={onUseCurrentLocation}
                disabled={isLoadingLocation}
                className="absolute right-1 p-1.5 rounded-none bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[11px] uppercase tracking-wider transition disabled:opacity-50 flex items-center space-x-1 border border-indigo-500"
                title="Use Current Location (GPS)"
              >
                {isLoadingLocation ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <MapPin className="w-4 h-4" />
                )}
              </button>
            </div>

            {/* Search Dropdown Results */}
            {showDropdown && (searchQuery.trim().length >= 2 || isSearching || searchResults.length > 0 || searchError) && (
              <div className="absolute left-0 right-0 mt-1 bg-slate-900 border border-slate-700 rounded-none shadow-2xl overflow-hidden z-50">
                {isSearching && (
                  <div className="p-4 flex items-center justify-center space-x-2 text-sm text-slate-400 font-mono">
                    <Loader2 className="w-4 h-4 animate-spin text-indigo-400" />
                    <span>Searching Open-Meteo Geocoding...</span>
                  </div>
                )}

                {!isSearching && searchError && (
                  <div className="p-4 text-center text-xs text-amber-400 bg-amber-500/10 border-b border-amber-500/20 font-medium">
                    <p>{searchError}</p>
                    <p className="text-[11px] text-slate-400 mt-1">Check spelling or search for a major city.</p>
                  </div>
                )}

                {!isSearching && searchResults.length > 0 && (
                  <ul className="max-h-64 overflow-y-auto divide-y divide-slate-800">
                    {searchResults.map((res) => (
                      <li key={res.id}>
                        <button
                          onClick={() => handleSelectResult(res)}
                          className="w-full px-4 py-3 text-left hover:bg-slate-800 transition flex items-center justify-between group"
                        >
                          <div>
                            <span className="font-bold text-slate-100 group-hover:text-indigo-300">
                              {res.name}
                            </span>
                            <span className="text-xs text-slate-400 ml-2">
                              {[res.admin1, res.country].filter(Boolean).join(', ')}
                            </span>
                          </div>
                          <span className="text-xs text-slate-500 font-mono">
                            {res.latitude.toFixed(2)}°, {res.longitude.toFixed(2)}°
                          </span>
                        </button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
          </div>

          {/* Desktop Right Controls: Settings & Favorites */}
          <div className="hidden md:flex items-center space-x-3">
            {/* Units Toggle Button */}
            <div className="relative">
              <button
                id="settings-dropdown-btn"
                onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                className="px-3 py-2 rounded-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2 transition"
              >
                <SlidersHorizontal className="w-4 h-4 text-indigo-400" />
                <span>
                  °{settings.tempUnit} | {settings.windUnit}
                </span>
              </button>

              {showSettingsMenu && (
                <div className="absolute right-0 mt-1 w-56 bg-slate-900 border border-slate-700 rounded-none shadow-2xl p-3 z-50">
                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Temperature Unit
                  </div>
                  <div className="grid grid-cols-2 gap-1.5 mb-3">
                    {(['C', 'F'] as TemperatureUnit[]).map((unit) => (
                      <button
                        key={unit}
                        onClick={() => {
                          onUpdateSettings({ ...settings, tempUnit: unit });
                          setShowSettingsMenu(false);
                        }}
                        className={`px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-between transition ${
                          settings.tempUnit === unit
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>°{unit}</span>
                        {settings.tempUnit === unit && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>

                  <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                    Wind Speed Unit
                  </div>
                  <div className="space-y-1">
                    {(
                      [
                        { id: 'kmh', label: 'km/h (Kilometers)' },
                        { id: 'mph', label: 'mph (Miles/hr)' },
                        { id: 'ms', label: 'm/s (Meters/sec)' }
                      ] as { id: WindSpeedUnit; label: string }[]
                    ).map((item) => (
                      <button
                        key={item.id}
                        onClick={() => {
                          onUpdateSettings({ ...settings, windUnit: item.id });
                          setShowSettingsMenu(false);
                        }}
                        className={`w-full px-3 py-1.5 rounded-none text-xs font-bold uppercase tracking-wider flex items-center justify-between transition ${
                          settings.windUnit === item.id
                            ? 'bg-indigo-600 text-white'
                            : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                        }`}
                      >
                        <span>{item.label}</span>
                        {settings.windUnit === item.id && <Check className="w-3.5 h-3.5" />}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Favorite Drawer Button */}
            <button
              id="favorites-btn"
              onClick={onOpenFavorites}
              className="relative px-3 py-2 rounded-none bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold uppercase tracking-wider text-slate-200 flex items-center space-x-2 transition"
            >
              <Bookmark className="w-4 h-4 text-amber-400" />
              <span>Favorites</span>
              {favoriteCount > 0 && (
                <span className="ml-1 px-1.5 py-0.5 rounded-none bg-indigo-600 text-white font-bold text-[10px]">
                  {favoriteCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Popular Cities Horizontal Scroll Row */}
        <div className="mt-3 pt-2.5 border-t border-slate-800 flex items-center space-x-2 overflow-x-auto no-scrollbar text-xs">
          <span className="text-slate-400 font-extrabold uppercase tracking-widest text-[10px] whitespace-nowrap mr-1 flex items-center">
            Quick Cities:
          </span>
          {POPULAR_CITIES.map((city) => {
            const isSelected = currentLocation.name.toLowerCase() === city.name.toLowerCase();
            return (
              <button
                key={city.name}
                onClick={() => handleSelectPopular(city)}
                className={`px-2.5 py-1 rounded-none transition whitespace-nowrap font-bold uppercase tracking-wider text-[11px] flex items-center space-x-1 ${
                  isSelected
                    ? 'bg-indigo-600 text-white border border-indigo-500'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-slate-300 border border-slate-700'
                }`}
              >
                <span>{city.name}</span>
              </button>
            );
          })}
        </div>
      </div>
    </header>
  );
};
