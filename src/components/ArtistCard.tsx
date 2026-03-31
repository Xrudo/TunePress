import type { FavoriteArtist } from '../features/favorites/types';

interface ArtistCardProps {
  name: string;
  image: string;
  listeners: string;
  maxListeners: number;
  isFavorite: boolean;
  onCardClick: () => void;
  onToggleFavorite: (artist: FavoriteArtist) => void;
}

// Last.fm placeholder image hash — returned when no real image exists
const LASTFM_PLACEHOLDER = '2a96cbd8b46e442fc41c2b86b821562f';

function isPlaceholderImage(url: string): boolean {
  return !url || url.includes(LASTFM_PLACEHOLDER);
}

function getInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('');
}

function formatListeners(val: string | undefined): string {
  if (!val) return '';
  const n = parseInt(val, 10);
  if (isNaN(n) || n === 0) return '';
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(0)}K`;
  return String(n);
}

export default function ArtistCard({
  name,
  image,
  listeners,
  maxListeners,
  isFavorite,
  onCardClick,
  onToggleFavorite,
}: ArtistCardProps) {
  const listenersNum = parseInt(listeners, 10);
  const relativeWidth = maxListeners > 0 && !isNaN(listenersNum)
    ? Math.round((listenersNum / maxListeners) * 100)
    : 0;

  const formattedListeners = formatListeners(listeners);
  const showImage = !isPlaceholderImage(image);

  return (
    <div className="card-press animate-press-in" onClick={onCardClick}>
      <div className="artist-img-wrap">
        {showImage ? (
          <img src={image} alt={name} />
        ) : (
          <div className="w-full h-full bg-newsprint flex items-center justify-center">
            <span style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: 'clamp(1.5rem, 4vw, 2.5rem)',
              fontWeight: 700,
              color: '#8C8478',
              letterSpacing: '-0.02em',
              userSelect: 'none',
            }}>
              {getInitials(name)}
            </span>
          </div>
        )}
      </div>
      <div className="p-4 border-t border-rule">
        <div className="flex items-start justify-between gap-2">
          <p className="headline text-lg leading-tight mb-1 flex-1">{name}</p>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite({ name, image, listeners });
            }}
            className={`byline transition-colors duration-350 mt-1 ${
              isFavorite ? 'text-scarlet' : 'text-ghost hover:text-ink'
            }`}
            aria-label="Save to favorites"
          >
            {isFavorite ? '★' : '☆'}
          </button>
        </div>
        {formattedListeners ? (
          <>
            <p className="byline mb-2">{formattedListeners} listeners</p>
            <div className="listener-bar">
              <div className="listener-bar-fill" style={{ width: `${relativeWidth}%` }} />
            </div>
          </>
        ) : (
          <p className="byline text-ghost">—</p>
        )}
      </div>
    </div>
  );
}
