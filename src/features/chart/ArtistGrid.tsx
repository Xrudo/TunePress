import { useMemo } from 'react';
import ArtistCard from '../../components/ArtistCard';
import type { Artist } from './types';
import type { FavoriteArtist } from '../favorites/types';
import { useWikipediaImages } from '../../hooks/useWikipediaImages';

interface ArtistGridProps {
  artists: Artist[];
  favorites: FavoriteArtist[];
  onCardClick: (name: string) => void;
  onToggleFavorite: (artist: FavoriteArtist) => void;
}

export default function ArtistGrid({ artists, favorites, onCardClick, onToggleFavorite }: ArtistGridProps) {
  const names = useMemo(() => artists.map((a) => a.name), [artists]);
  const wikiImages = useWikipediaImages(names);

  const maxListeners = artists.reduce((max, a) => Math.max(max, parseInt(a.listeners, 10) || 0), 0);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5 stagger">
      {artists.map((artist) => {
        const image = wikiImages.get(artist.name) ?? '';
        const isFavorite = favorites.some((f) => f.name === artist.name);

        return (
          <ArtistCard
            key={artist.mbid || artist.name}
            name={artist.name}
            image={image}
            listeners={artist.listeners}
            maxListeners={maxListeners}
            isFavorite={isFavorite}
            onCardClick={() => onCardClick(artist.name)}
            onToggleFavorite={onToggleFavorite}
          />
        );
      })}
    </div>
  );
}
