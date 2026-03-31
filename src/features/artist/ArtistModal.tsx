import { useEffect, useState } from 'react';
import { fetchArtistInfo, fetchTopTracks } from './api';
import type { ArtistDetail, Track } from './types';

interface ArtistModalProps {
  artistName: string;
  onClose: () => void;
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').replace(/&quot;/g, '"').replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>').trim();
}

function formatListeners(val: string): string {
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

function formatPlays(val: string): string {
  const n = parseInt(val, 10);
  if (isNaN(n)) return val;
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M plays`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K plays`;
  return `${n} plays`;
}

export default function ArtistModal({ artistName, onClose }: ArtistModalProps) {
  const [artist, setArtist] = useState<ArtistDetail | null>(null);
  const [tracks, setTracks] = useState<Track[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [artistData, tracksData] = await Promise.all([
          fetchArtistInfo(artistName),
          fetchTopTracks(artistName),
        ]);
        setArtist(artistData);
        const t = tracksData.toptracks?.track;
        setTracks(Array.isArray(t) ? t : []);
      } catch {
        setError('Could not load artist details. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    load();
  }, [artistName]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const image = artist?.image.find((img) => img.size === 'extralarge')?.['#text']
    || artist?.image.find((img) => img.size === 'large')?.['#text']
    || '';

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-panel" onClick={(e) => e.stopPropagation()}>
        {isLoading && (
          <div className="p-5">
            <div className="rule-thick pb-5 pt-4 flex items-start justify-between">
              <div className="space-y-2 flex-1">
                <div className="skeleton-press h-3 w-20 mb-3" />
                <div className="skeleton-press h-8 w-2/3" />
              </div>
            </div>
            <div className="skeleton-press aspect-video mb-4" />
            <div className="space-y-2">
              <div className="skeleton-press h-3 w-full" />
              <div className="skeleton-press h-3 w-5/6" />
              <div className="skeleton-press h-3 w-4/6" />
            </div>
          </div>
        )}

        {error && (
          <div className="p-5">
            <div className="rule-thick pb-5 pt-4 flex items-start justify-between">
              <p className="kicker text-scarlet">Error</p>
              <button className="byline hover:text-scarlet transition-colors" onClick={onClose}>Close</button>
            </div>
            <p className="font-body text-sm text-smudge">{error}</p>
          </div>
        )}

        {!isLoading && !error && artist && (
          <>
            <div className="rule-thick p-5 flex items-start justify-between">
              <div>
                <p className="kicker mb-1">{artist.tags?.tag?.[0]?.name ?? 'Artist'}</p>
                <h2 className="headline text-3xl">{artist.name}</h2>
              </div>
              <button
                className="byline hover:text-scarlet transition-colors duration-350 mt-1 ml-4 shrink-0"
                onClick={onClose}
              >
                Close
              </button>
            </div>

            <div className="p-5">
              {image && (
                <div className="artist-img-wrap mb-4" style={{ aspectRatio: '16/9' }}>
                  <img src={image} alt={artist.name} />
                </div>
              )}

              <p className="byline mb-4">
                {formatListeners(artist.stats.listeners)} monthly listeners
              </p>

              {artist.bio?.summary && (
                <p className="font-body text-sm text-byline leading-relaxed mb-6">
                  {stripHtml(artist.bio.summary).slice(0, 300)}
                  {stripHtml(artist.bio.summary).length > 300 ? '...' : ''}
                </p>
              )}

              {tracks.length > 0 && (
                <div className="mt-6">
                  <p className="kicker mb-3">Top Tracks</p>
                  <div className="rule-thick mb-0" />
                  {tracks.map((track, i) => (
                    <div key={track.name} className="track-row">
                      <span className="track-number">{String(i + 1).padStart(2, '0')}</span>
                      <span className="track-name">{track.name}</span>
                      <span className="track-plays">{formatPlays(track.playcount)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
