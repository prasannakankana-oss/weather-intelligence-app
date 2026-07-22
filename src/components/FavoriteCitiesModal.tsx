import React from 'react';
import { Bookmark, X, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { LocationInfo } from '../types';

interface FavoriteCitiesModalProps {
  isOpen: boolean;
  onClose: () => void;
  favorites: LocationInfo[];
  onSelectFavorite: (loc: LocationInfo) => void;
  onRemoveFavorite: (locName: string) => void;
  currentLocationName: string;
}

export const FavoriteCitiesModal: React.FC<FavoriteCitiesModalProps> = ({
  isOpen,
  onClose,
  favorites,
  onSelectFavorite,
  onRemoveFavorite,
  currentLocationName
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="w-full max-w-lg bg-white border border-slate-900 rounded-none shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="p-5 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center space-x-2.5">
            <div className="p-2 rounded-none bg-indigo-50 border border-indigo-200 text-indigo-600">
              <Bookmark className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-black uppercase tracking-wider text-slate-900">Saved Favorite Cities</h3>
              <p className="text-xs text-slate-500">Quick access to your saved locations</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-none bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-900 border border-slate-300 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-3 flex-1 bg-white">
          {favorites.length === 0 ? (
            <div className="py-12 text-center text-slate-500 space-y-3">
              <Bookmark className="w-12 h-12 text-slate-300 mx-auto" />
              <p className="text-xs font-bold uppercase tracking-wider text-slate-700">No favorite cities saved yet.</p>
              <p className="text-xs text-slate-500 max-w-xs mx-auto">
                Click the bookmark icon on any city forecast card to save it here for quick access.
              </p>
            </div>
          ) : (
            favorites.map((city) => {
              const isCurrent = city.name.toLowerCase() === currentLocationName.toLowerCase();
              return (
                <div
                  key={city.name}
                  className={`p-4 rounded-none border transition flex items-center justify-between gap-3 ${
                    isCurrent
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-slate-50 hover:bg-slate-100 border-slate-200 text-slate-900'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div className={`p-2.5 rounded-none border ${isCurrent ? 'bg-slate-800 border-slate-700 text-indigo-400' : 'bg-white border-slate-200 text-indigo-600'}`}>
                      <MapPin className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="font-bold text-sm sm:text-base flex items-center space-x-2">
                        <span className={isCurrent ? 'text-white' : 'text-slate-900'}>{city.name}</span>
                        {isCurrent && (
                          <span className="px-2 py-0.5 rounded-none text-[9px] font-black uppercase tracking-widest bg-indigo-600 text-white">
                            Active
                          </span>
                        )}
                      </div>
                      <p className={`text-xs ${isCurrent ? 'text-slate-400' : 'text-slate-500'}`}>
                        {[city.admin1, city.country].filter(Boolean).join(', ')}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => {
                        onSelectFavorite(city);
                        onClose();
                      }}
                      className="px-3 py-1.5 rounded-none bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs uppercase tracking-wider flex items-center space-x-1 transition"
                    >
                      <span>View</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>

                    <button
                      onClick={() => onRemoveFavorite(city.name)}
                      className={`p-2 rounded-none border transition ${
                        isCurrent
                          ? 'bg-slate-800 hover:bg-rose-900/50 text-slate-300 hover:text-rose-300 border-slate-700'
                          : 'bg-white hover:bg-rose-50 text-slate-500 hover:text-rose-600 border-slate-300'
                      }`}
                      title="Remove from favorites"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 text-center text-[10px] uppercase font-bold tracking-widest text-slate-500">
          Saved locations are stored locally in your browser.
        </div>
      </div>
    </div>
  );
};
