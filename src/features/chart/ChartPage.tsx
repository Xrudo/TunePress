import { useEffect, useState } from 'react';
import { fetchTopArtists } from './api';
import type { Artist } from './types';
import type { Genre } from '../genres/types';
import type { FavoriteArtist } from '../favorites/types';
import ArtistGrid from './ArtistGrid';
import GenreFilter from '../genres/GenreFilter';
import ArtistModal from '../artist/ArtistModal';
import SkeletonGrid from '../../components/Spinner';
import ErrorMessage from '../../components/ErrorMessage';
import axios from 'axios';

const BASE = 'https://ws.audioscrobbler.com/2.0/';
const KEY = import.meta.env.VITE_LASTFM_API_KEY;

interface ChartPageProps {
  favorites: FavoriteArtist[];
  onToggleFavorite: (artist: FavoriteArtist) => void;
}

export default function ChartPage({ favorites, onToggleFavorite }: ChartPageProps) {
  const [artists, setArtists] = useState<Artist[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeGenre, setActiveGenre] = useState<Genre | null>(null);
  const [selectedArtist, setSelectedArtist] = useState<string | null>(null);

  const load = async (genre: Genre | null) => {
    setIsLoading(true);
    setError(null);
    try {
      if (genre) {
        const { data } = await axios.get<{ topartists: { artist: Artist[] } }>(BASE, {
          params: { method: 'tag.gettopartists', tag: genre, api_key: KEY, format: 'json' },
        });
        const raw = data.topartists?.artist ?? [];
        // Show immediately, then enrich listener counts in parallel
        setArtists(raw);
        const results = await Promise.allSettled(
          raw.map((a) =>
            axios.get<{ artist: { stats: { listeners: string } } }>(BASE, {
              params: { method: 'artist.getinfo', artist: a.name, api_key: KEY, format: 'json' },
            }).then((r) => ({ name: a.name, listeners: r.data.artist.stats.listeners }))
          )
        );
        setArtists((prev) =>
          prev.map((a) => {
            const found = results.find(
              (r) => r.status === 'fulfilled' && r.value.name === a.name
            );
            return found && found.status === 'fulfilled'
              ? { ...a, listeners: found.value.listeners }
              : a;
          })
        );
      } else {
        const data = await fetchTopArtists();
        setArtists(data.artists.artist);
      }
    } catch {
      setError('Could not load artists. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    load(activeGenre);
  }, [activeGenre]);

  if (error) return <ErrorMessage message={error} onRetry={() => load(activeGenre)} />;

  return (
    <div className="max-w-6xl mx-auto px-6">
      <header className="pt-12 pb-8">
        <div className="rule-thick pb-4 pt-4">
          <p className="kicker mb-2">Music Discovery</p>
          <h1 className="headline text-4xl">Top Artists</h1>
        </div>
      </header>

      <div className="mb-8">
        <GenreFilter activeGenre={activeGenre} onSelect={setActiveGenre} />
      </div>

      {isLoading ? (
        <SkeletonGrid />
      ) : (
        <ArtistGrid
          artists={artists}
          favorites={favorites}
          onCardClick={setSelectedArtist}
          onToggleFavorite={onToggleFavorite}
        />
      )}

      {selectedArtist && (
        <ArtistModal artistName={selectedArtist} onClose={() => setSelectedArtist(null)} />
      )}
    </div>
  );
}
