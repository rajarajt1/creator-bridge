import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import useApplicationStore from '../../store/applicationStore.js';
import useCampaignStore from '../../store/campaignStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import ApplicationCard from '../../components/campaign/ApplicationCard.jsx';
import Badge from '../../components/ui/Badge.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { Users } from 'lucide-react';

const STATUS_TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'accepted',  label: 'Accepted'  },
  { key: 'rejected',  label: 'Rejected'  },
];

const CampaignApplicationsPage = () => {
  const { id: campaignId } = useParams();
  const navigate = useNavigate();
  const { campaignApplications, fetchCampaignApplications, updateStatus, isLoading } = useApplicationStore();
  const { selectedCampaign, fetchCampaignById } = useCampaignStore();

  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    if (campaignId) {
      fetchCampaignApplications(campaignId);
      fetchCampaignById(campaignId);
    }
  }, [campaignId]);

  const handleUpdateStatus = async (appId, status) => {
    try {
      await updateStatus(appId, status);
      toast.success(`Application ${status}`);
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Update failed');
    }
  };

  const filtered = activeTab === 'all'
    ? campaignApplications
    : campaignApplications.filter((a) => a.status === activeTab);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">

        {/* ── Back + header ─────────────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {selectedCampaign && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <p className="text-xs text-gray-500 mb-1">Applications for</p>
            <h1 className="text-xl font-bold text-gray-900">{selectedCampaign.title}</h1>
            <p className="text-sm text-gray-500 mt-1">
              {campaignApplications.length} total application{campaignApplications.length !== 1 ? 's' : ''}
            </p>
          </div>
        )}

        {/* ── Tabs ─────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {STATUS_TABS.map((t) => {
            const count = t.key === 'all'
              ? campaignApplications.length
              : campaignApplications.filter((a) => a.status === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={[
                  'flex-1 min-w-[70px] py-1.5 px-3 rounded-lg text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === t.key
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                {t.label}
                {count > 0 && (
                  <span className={`ml-1 text-xs ${activeTab === t.key ? 'text-indigo-600' : 'text-gray-400'}`}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* ── Application list ─────────────────────────────────────── */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <Skeleton count={3} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Users}
            title={activeTab === 'all' ? 'No applications yet' : `No ${activeTab} applications`}
            description="Applications from creators will appear here."
          />
        ) : (
          <div className="space-y-4">
            {filtered.map((app) => (
              <ApplicationCard
                key={app._id}
                application={app}
                onUpdateStatus={handleUpdateStatus}
              />
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CampaignApplicationsPage;
