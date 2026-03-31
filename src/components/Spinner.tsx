export default function SkeletonGrid() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-5">
      {Array.from({ length: 10 }).map((_, i) => (
        <div key={i} className="card-press">
          <div className="skeleton-press aspect-square" />
          <div className="p-4 border-t border-rule space-y-2">
            <div className="skeleton-press h-4 w-3/4" />
            <div className="skeleton-press h-3 w-1/2" />
          </div>
        </div>
      ))}
    </div>
  );
}
