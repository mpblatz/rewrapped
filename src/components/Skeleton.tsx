export function CardSkeleton() {
  return (
    <div className="bg-card-bg rounded-xl border border-border px-4 py-3 flex items-center gap-3.5">
      <div className="skeleton w-6 h-6 rounded-full shrink-0" />
      <div className="skeleton w-10 h-10 rounded-lg shrink-0" />
      <div className="flex-1 space-y-1.5">
        <div className="skeleton h-3.5 w-3/5" />
        <div className="skeleton h-3 w-2/5" />
      </div>
    </div>
  );
}

export function GridSkeleton({ count = 12 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-card-bg rounded-xl border border-border p-3.5 space-y-3">
          <div className="skeleton w-full aspect-square rounded-lg" />
          <div className="skeleton h-3 w-3/4" />
          <div className="skeleton h-2.5 w-1/2" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton({ count = 10 }: { count?: number }) {
  return (
    <div className="space-y-1.5">
      {Array.from({ length: count }).map((_, i) => (
        <CardSkeleton key={i} />
      ))}
    </div>
  );
}

export function StatSkeleton() {
  return (
    <div className="bg-card-bg rounded-xl border border-border p-4 space-y-1.5">
      <div className="skeleton h-2.5 w-1/3" />
      <div className="skeleton h-6 w-1/2" />
      <div className="skeleton h-2 w-2/5" />
    </div>
  );
}

export function StatsGridSkeleton() {
  return (
    <div className="space-y-3">
      <div className="skeleton h-24 w-full rounded-xl" />
      <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <StatSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
