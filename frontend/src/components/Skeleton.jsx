/**
 * Skeleton Loading Components
 * Provides loading placeholders for various UI elements
 */

export function Skeleton({ className = '', width, height, rounded = 'md' }) {
  const roundedClass = {
    none: '',
    sm: 'rounded-sm',
    md: 'rounded-md',
    lg: 'rounded-lg',
    xl: 'rounded-xl',
    '2xl': 'rounded-2xl',
    '3xl': 'rounded-3xl',
    full: 'rounded-full',
  }[rounded] || 'rounded-md';

  return (
    <div
      className={`animate-pulse bg-white/10 ${roundedClass} ${className}`}
      style={{
        width: width || '100%',
        height: height || '1rem',
      }}
    />
  );
}

export function SkeletonText({ lines = 3, className = '' }) {
  return (
    <div className={`space-y-2 ${className}`}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          height="0.875rem"
          width={i === lines - 1 ? '60%' : '100%'}
        />
      ))}
    </div>
  );
}

export function SkeletonCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-white/5 p-5 ${className}`}>
      <Skeleton height="1.5rem" width="60%" className="mb-3" />
      <SkeletonText lines={2} />
      <div className="mt-4 flex gap-2">
        <Skeleton height="2rem" width="5rem" rounded="lg" />
        <Skeleton height="2rem" width="5rem" rounded="lg" />
      </div>
    </div>
  );
}

export function SkeletonTable({ rows = 5, columns = 4, className = '' }) {
  return (
    <div className={`overflow-hidden rounded-xl border border-white/10 bg-black/20 ${className}`}>
      <div className="border-b border-white/10 bg-black/30 px-3 py-3">
        <div className="flex gap-4">
          {Array.from({ length: columns }).map((_, i) => (
            <Skeleton key={i} height="0.75rem" width={`${100 / columns - 2}%`} />
          ))}
        </div>
      </div>
      <div className="divide-y divide-white/10">
        {Array.from({ length: rows }).map((_, rowIdx) => (
          <div key={rowIdx} className="flex gap-4 px-3 py-3">
            {Array.from({ length: columns }).map((_, colIdx) => (
              <Skeleton key={colIdx} height="0.875rem" width={`${100 / columns - 2}%`} />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}

export function SkeletonStatCard({ className = '' }) {
  return (
    <div className={`rounded-2xl border border-white/10 bg-gradient-to-b from-white/10 to-white/5 p-5 ${className}`}>
      <Skeleton height="0.75rem" width="4rem" className="mb-3" />
      <Skeleton height="2rem" width="3rem" />
    </div>
  );
}

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="space-y-2">
            <Skeleton height="1.75rem" width="10rem" />
            <Skeleton height="1rem" width="20rem" />
          </div>
          <div className="grid grid-cols-3 gap-3 md:w-[420px]">
            <SkeletonStatCard />
            <SkeletonStatCard />
            <SkeletonStatCard />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-12">
        <div className="rounded-2xl border border-white/10 bg-white/5 p-5 lg:col-span-3">
          <Skeleton height="1rem" width="5rem" className="mb-4" />
          <Skeleton height="2.5rem" className="mb-3" rounded="lg" />
          <div className="space-y-2">
            <Skeleton height="2rem" rounded="lg" />
            <Skeleton height="2rem" rounded="lg" />
          </div>
        </div>
        <div className="lg:col-span-9">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <SkeletonCard />
            <SkeletonCard />
            <SkeletonCard />
          </div>
        </div>
      </div>
    </div>
  );
}

export function AdminDashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-indigo-500/15 via-white/5 to-transparent p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="space-y-2">
            <Skeleton height="1.75rem" width="12rem" />
            <Skeleton height="1rem" width="24rem" />
          </div>
          <div className="flex gap-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} height="2.25rem" width="5rem" rounded="full" />
            ))}
          </div>
        </div>
      </div>

      {/* Stats skeleton */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
        <SkeletonStatCard />
      </div>

      {/* Tables skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="space-y-2">
          <Skeleton height="1rem" width="6rem" className="mb-2" />
          <SkeletonTable rows={5} columns={3} />
        </div>
        <div className="space-y-2">
          <Skeleton height="1rem" width="8rem" className="mb-2" />
          <SkeletonTable rows={5} columns={3} />
        </div>
      </div>
    </div>
  );
}
