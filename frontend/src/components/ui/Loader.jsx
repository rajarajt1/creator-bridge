import { Loader2 } from 'lucide-react';

// ─── Spinner ──────────────────────────────────────────────────────────────────

const SPINNER_SIZES = { sm: 'h-4 w-4', md: 'h-8 w-8', lg: 'h-12 w-12' };

const Spinner = ({ size = 'md', className = '' }) => (
  <div className={`flex items-center justify-center ${className}`}>
    <Loader2 className={`${SPINNER_SIZES[size] ?? SPINNER_SIZES.md} animate-spin text-indigo-600`} />
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const SkeletonRow = () => (
  <div className="animate-pulse space-y-2">
    <div className="h-4 bg-gray-200 rounded-md w-3/4" />
    <div className="h-4 bg-gray-200 rounded-md w-1/2" />
  </div>
);

const Skeleton = ({ count = 1, className = '' }) => (
  <div className={`space-y-4 ${className}`}>
    {Array.from({ length: count }, (_, i) => (
      <SkeletonRow key={i} />
    ))}
  </div>
);

// ─── Full-page loader ─────────────────────────────────────────────────────────

const PageLoader = () => (
  <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm">
    <div className="flex flex-col items-center gap-3">
      <Loader2 className="h-10 w-10 animate-spin text-indigo-600" />
      <p className="text-sm text-gray-500 font-medium">Loading…</p>
    </div>
  </div>
);

// ─── Unified export ───────────────────────────────────────────────────────────

const Loader = ({ variant = 'spinner', count, size, className }) => {
  if (variant === 'skeleton') return <Skeleton count={count} className={className} />;
  if (variant === 'page')     return <PageLoader />;
  return <Spinner size={size} className={className} />;
};

export default Loader;
export { Spinner, Skeleton, PageLoader };
