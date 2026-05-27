import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import useCampaignStore from '../../store/campaignStore.js';
import useApplicationStore from '../../store/applicationStore.js';
import useAuthStore from '../../store/authStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import CampaignCard from '../../components/campaign/CampaignCard.jsx';
import CampaignFilters from '../../components/campaign/CampaignFilters.jsx';
import SearchInput from '../../components/ui/SearchInput.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { Megaphone } from 'lucide-react';

const FindCampaignsPage = () => {
  const {
    campaigns, pagination, filters, isLoading,
    fetchCampaigns, setFilters, resetFilters,
  } = useCampaignStore();

  const { myApplications, fetchMyApplications } = useApplicationStore();
  const user = useAuthStore((s) => s.user);
  const isCreator = user?.role === 'creator';

  const [showMobileFilter, setShowMobileFilter] = useState(false);

  useEffect(() => {
    fetchCampaigns(filters, 1);
    if (isCreator) fetchMyApplications();
  }, []);

  // Map campaignId → application status for creators
  const appliedMap = {};
  if (isCreator) {
    myApplications.forEach((a) => {
      const cid = a.campaignId?._id ?? a.campaignId;
      if (cid) appliedMap[cid] = a.status;
    });
  }

  const handleSearch = (search) => {
    fetchCampaigns({ ...filters, search }, 1);
  };

  const handleApplyFilters = (newFilters) => {
    setFilters(newFilters);
    fetchCampaigns(newFilters, 1);
    setShowMobileFilter(false);
  };

  const handlePage = (page) => {
    fetchCampaigns(filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Find Campaigns</h1>
            <p className="text-sm text-gray-500 mt-0.5">
              {isLoading ? 'Searching…' : `${pagination.total ?? 0} campaigns available`}
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="sm:hidden w-fit"
            onClick={() => setShowMobileFilter(true)}
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </Button>
        </div>

        {/* ── Search ──────────────────────────────────────────────────── */}
        <div className="mb-6">
          <SearchInput
            placeholder="Search campaigns by title or keyword…"
            onSearch={handleSearch}
            className="max-w-lg"
          />
        </div>

        {/* ── Layout ─────────────────────────────────────────────────── */}
        <div className="flex gap-6">
          {/* Desktop filter sidebar */}
          <aside className="hidden sm:block w-64 shrink-0">
            <CampaignFilters
              initialFilters={filters}
              onApply={handleApplyFilters}
              onReset={() => { resetFilters(); fetchCampaigns({}, 1); }}
            />
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {Array.from({ length: 6 }, (_, i) => (
                  <div key={i} className="bg-white rounded-xl border border-gray-200 p-4 space-y-3">
                    <Skeleton count={5} />
                  </div>
                ))}
              </div>
            ) : campaigns.length === 0 ? (
              <EmptyState
                icon={Megaphone}
                title="No campaigns found"
                description="Try adjusting your filters or search terms."
                action={{ label: 'Reset Filters', onClick: () => { resetFilters(); fetchCampaigns({}, 1); } }}
              />
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {campaigns.map((c) => (
                    <CampaignCard
                      key={c._id}
                      campaign={c}
                      applicationStatus={isCreator ? appliedMap[c._id] : undefined}
                    />
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
            <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
            <div className="relative ml-auto w-80 max-w-full bg-white h-full overflow-y-auto p-5 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-gray-900">Filters</h3>
                <button onClick={() => setShowMobileFilter(false)} className="p-1 rounded-lg hover:bg-gray-100">
                  <X className="h-5 w-5 text-gray-500" />
                </button>
              </div>
              <CampaignFilters
                initialFilters={filters}
                onApply={handleApplyFilters}
                onReset={() => { resetFilters(); fetchCampaigns({}, 1); setShowMobileFilter(false); }}
              />
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default FindCampaignsPage;
