import { GENRES, type Genre } from './types';

interface GenreFilterProps {
  activeGenre: Genre | null;
  onSelect: (genre: Genre | null) => void;
}

export default function GenreFilter({ activeGenre, onSelect }: GenreFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        className={`genre-tag ${activeGenre === null ? 'active' : ''}`}
        onClick={() => onSelect(null)}
      >
        All
      </button>
      {GENRES.map((g) => (
        <button
          key={g}
          className={`genre-tag ${activeGenre === g ? 'active' : ''}`}
          onClick={() => onSelect(g)}
        >
          {g}
        </button>
      ))}
    </div>
  );
}
