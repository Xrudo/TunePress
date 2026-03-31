import { useMemo, useState } from 'react';
import type { FavoriteArtist } from './types';
import ArtistCard from '../../components/ArtistCard';
import ArtistModal from '../artist/ArtistModal';
import { useWikipediaImages } from '../../hooks/useWikipediaImages';

interface FavoritesPageProps {
  favorites: FavoriteArtist[];
  onToggleFavorite: (artist: FavoriteArtist) => void;
}

export default function FavoritesPage({ favorites, onToggleFavorite }: FavoritesPageProps) {
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const names = useMemo(() => favorites.map((a) => a.name), [favorites]);
  const wikiImages = useWikipediaImages(names);

  const maxListeners = favorites.reduce((max, a) => Math.max(max, parseInt(a.listeners, 10) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <header className="pt-12 pb-8">
        <div className="rule-thick pb-4 pt-4">
          <p className="kicker mb-2">Your Collection</p>
          <h1 className="headline text-4xl">Favorites</h1>
        </div>
      </header>

      {favorites.length === 0 ? (
        <div className="py-20">
          <div className="rule-thick pb-6 pt-4">
            <p className="kicker mb-2">Empty</p>
            <h2 className="headline text-2xl mb-3">No saved artists</h2>
            <p className="font-body text-sm text-smudge">
              Browse the charts and bookmark artists to save them here.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 stagger">
          {favorites.map((artist) => (
            <ArtistCard
              key={artist.name}
              name={artist.name}
              image={wikiImages.get(artist.name) ?? ''}
              listeners={artist.listeners}
              maxListeners={maxListeners}
              isFavorite={true}
              onCardClick={() => setSelectedArtist(artist.name)}
              onToggleFavorite={onToggleFavorite}
            />
          ))}
        </div>
      )}

      {selectedArtist && (
        <ArtistModal artistName={selectedArtist} onClose={() => setSelectedArtist(null)} />
      )}
    </div>
  );
}
