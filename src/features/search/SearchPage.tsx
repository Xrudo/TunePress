import { useEffect, useMemo, useState } from 'react';
import { searchArtists } from './api';
import type { SearchArtist } from './types';
import type { FavoriteArtist } from '../favorites/types';
import ArtistCard from '../../components/ArtistCard';
import SearchBar from './SearchBar';
import ArtistModal from '../artist/ArtistModal';
import SkeletonGrid from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import { useWikipediaImages } from '../../hooks/useWikipediaImages';

interface SearchPageProps {
  favorites: FavoriteArtist[];
  onToggleFavorite: (artist: FavoriteArtist) => void;
}

export default function SearchPage({ favorites, onToggleFavorite }: SearchPageProps) {
  const [query, setQuery] = useState('');
  const [artists, setArtists] = useState<SearchArtist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  useEffect(() => {
    if (!query.trim()) {
      setArtists([]);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchArtists(query);
        const results = data.results?.artistmatches?.artist ?? [];
        setArtists(Array.isArray(results) ? results : []);
      } catch {
        setError('Could not search artists. Please try again.');
      } finally {
        setIsLoading(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  const names = useMemo(() => artists.map((a) => a.name), [artists]);
  const wikiImages = useWikipediaImages(names);

  const maxListeners = artists.reduce((max, a) => Math.max(max, parseInt(a.listeners, 10) || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-6">
      <header className="pt-12 pb-8">
        <div className="rule-thick pb-4 pt-4">
          <p className="kicker mb-2">Search</p>
          <h1 className="headline text-4xl">Find Artists</h1>
        </div>
      </header>

      <div className="mb-10">
        <SearchBar value={query} onChange={setQuery} />
      </div>

      {error && <ErrorMessage message={error} onRetry={() => setQuery(query + ' ')} />}

      {isLoading && <SkeletonGrid />}

      {!isLoading && !error && query.trim() && artists.length === 0 && (
        <div className="py-20">
          <div className="rule-thick pb-6 pt-4">
            <p className="kicker mb-2">No results</p>
            <h2 className="headline text-2xl mb-3">No artists found</h2>
            <p className="font-body text-sm text-smudge">Try a different search term.</p>
          </div>
        </div>
      )}

      {!isLoading && artists.length > 0 && (
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
                onCardClick={() => setSelectedArtist(artist.name)}
                onToggleFavorite={onToggleFavorite}
              />
            );
          })}
        </div>
      )}

      {selectedArtist && (
        <ArtistModal artistName={selectedArtist} onClose={() => setSelectedArtist(null)} />
      )}
    </div>
  );
}
