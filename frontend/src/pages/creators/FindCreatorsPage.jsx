import { useEffect, useState } from 'react';
import { SlidersHorizontal, X, ChevronDown } from 'lucide-react';
import useCreatorStore from '../../store/creatorStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import CreatorCard from '../../components/creator/CreatorCard.jsx';
import CreatorFilters from '../../components/creator/CreatorFilters.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import Select from '../../components/ui/Select.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { Users } from 'lucide-react';

const SORT_OPTIONS = [
  { value: 'rating',       label: 'Highest Rated'    },
  { value: 'totalReach',   label: 'Most Followers'   },
  { value: 'engagement',   label: 'Best Engagement'  },
  { value: 'newest',       label: 'Newest First'     },
];

const FindCreatorsPage = () => {
  const {
    creators, pagination, filters, isLoading,
    fetchCreators, setFilters, resetFilters,
  } = useCreatorStore();

  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [sortBy, setSortBy] = useState('rating');
  const [search, setSearch] = useState('');

  useEffect(() => {
    fetchCreators({ ...filters, search, sortBy }, 1);
  }, [filters, sortBy]);

  const handleSearch = (val) => {
    setSearch(val);
    fetchCreators({ ...filters, search: val, sortBy }, 1);
  };

  const handlePage = (page) => {
    fetchCreators({ ...filters, search, sortBy }, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    setShowMobileFilter(false);
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* ── Page header ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Creators</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? 'Searching…' : `${pagination.total ?? 0} creators found`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            {/* Mobile filter toggle */}
            <Button
              variant="outline"
              size="sm"
              className="sm:hidden"
              onClick={() => setShowMobileFilter(true)}
            >
              <SlidersHorizontal className="h-4 w-4" /> Filters
            </Button>

            {/* Sort */}
            <Select
              options={SORT_OPTIONS}
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-44"
            />
          </div>
        </div>

        {/* ── Search bar ──────────────────────────────────────────────── */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search creators by name or niche…"
            onSearch={handleSearch}
            className="max-w-lg"
          />
        </div>

        {/* ── Layout ─────────────────────────────────────────────────── */}
        <div className="flex gap-6">
          {/* Desktop sidebar filters */}
          <aside className="hidden sm:block w-64 shrink-0">
            <CreatorFilters
              initialFilters={filters}
              onApply={handleApplyFilters}
              onReset={resetFilters}
            />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                    <Skeleton count={4} />
                  </div>
                ))}
              </div>
            ) : creators.length === 0 ? (
              <EmptyState
                icon={Users}
                title="No creators found"
                description="Try adjusting your filters or search terms."
                action={{ label: 'Reset Filters', onClick: resetFilters }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
                  {creators.map((c) => (
                    <CreatorCard key={c._id ?? c.userId} creator={c} />
                  ))}
                </div>

                {/* Pagination */}
                {pagination.pages > 1 && (
                  <div className="flex items-center justify-center gap-2 mt-8">
                    <Button
                      variant="outline" size="sm"
                      disabled={pagination.page <= 1}
                      onClick={() => handlePage(pagination.page - 1)}
                    >
                      Previous
                    </Button>
                    <span className="text-sm text-gray-600">
                      Page {pagination.page} of {pagination.pages}
                    </span>
                    <Button
                      variant="outline" size="sm"
                      disabled={pagination.page >= pagination.pages}
                      onClick={() => handlePage(pagination.page + 1)}
                    >
                      Next
                    </Button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>

        {/* ── Mobile filter modal ──────────────────────────────────────── */}
        {showMobileFilter && (
          <div className="fixed inset-0 z-50 flex">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setShowMobileFilter(false)}
            />
            <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowMobileFilter(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <CreatorFilters
                initialFilters={filters}
                onApply={handleApplyFilters}
                onReset={() => { resetFilters(); setShowMobileFilter(false); }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindCreatorsPage;
