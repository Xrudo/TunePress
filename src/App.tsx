import { useState, useEffect } from 'react';
import type { FavoriteArtist } from './features/favorites/types';
import ChartPage from './features/chart/ChartPage';
import SearchPage from './features/search/SearchPage';
import FavoritesPage from './features/favorites/FavoritesPage';

type View = 'chart' | 'search' | 'favorites';

const STORAGE_KEY = 'tunepress_favorites';

function loadFavorites(): FavoriteArtist[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as FavoriteArtist[]) : [];
  } catch {
    return [];
  }
}

export default function App() {
  const [activeView, setActiveView] = useState<View>('chart');
  const [favorites, setFavorites] = useState<FavoriteArtist[]>(loadFavorites);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const toggleFavorite = (artist: FavoriteArtist) => {
    setFavorites((prev) => {
      const exists = prev.some((f) => f.name === artist.name);
      return exists ? prev.filter((f) => f.name !== artist.name) : [...prev, artist];
    });
  };

  return (
    <div className="min-h-screen bg-page">
      <nav className="sticky top-0 z-40 bg-page border-b-2 border-ink">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <button
            className="headline text-xl cursor-pointer"
            onClick={() => setActiveView('chart')}
          >
            TunePress
          </button>
          <div className="flex items-center gap-8">
            <button
              className={`byline transition-colors duration-350 ${
                activeView === 'chart' ? 'text-ink' : 'hover:text-ink'
              }`}
              onClick={() => setActiveView('chart')}
            >
              Charts
            </button>
            <button
              className={`byline transition-colors duration-350 ${
                activeView === 'search' ? 'text-ink' : 'hover:text-ink'
              }`}
              onClick={() => setActiveView('search')}
            >
              Search
            </button>
            <button
              className={`byline transition-colors duration-350 ${
                activeView === 'favorites' ? 'text-ink' : 'hover:text-ink'
              }`}
              onClick={() => setActiveView('favorites')}
            >
              Favorites
              {favorites.length > 0 && (
                <span className="ml-1 text-scarlet">({favorites.length})</span>
              )}
            </button>
          </div>
        </div>
      </nav>

      <main className="pb-16">
        {activeView === 'chart' && (
          <ChartPage favorites={favorites} onToggleFavorite={toggleFavorite} />
        )}
        {activeView === 'search' && (
          <SearchPage favorites={favorites} onToggleFavorite={toggleFavorite} />
        )}
        {activeView === 'favorites' && (
          <FavoritesPage favorites={favorites} onToggleFavorite={toggleFavorite} />
        )}
      </main>
    </div>
  );
}
