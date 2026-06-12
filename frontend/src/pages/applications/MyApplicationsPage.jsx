import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useApplicationStore from '../../store/applicationStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { Send } from 'lucide-react';
import { formatRelativeTime, truncateText } from '../../utils/helpers.js';
import ReportFormModal from '../../components/campaign/ReportFormModal.jsx';
import ReportViewModal from '../../components/campaign/ReportViewModal.jsx';

const STATUS_TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'pending',   label: 'Pending'   },
  { key: 'reviewing', label: 'Reviewing' },
  { key: 'accepted',  label: 'Accepted'  },
  { key: 'rejected',  label: 'Rejected'  },
];

const STATUS_VARIANT = {
  pending:   'default',
  reviewing: 'info',
  accepted:  'success',
  rejected:  'error',
  withdrawn: 'warning',
};

const MyApplicationsPage = () => {
  const { myApplications, fetchMyApplications, withdraw, isLoading } = useApplicationStore();
  const [activeTab, setActiveTab] = useState('all');
  const [withdrawingId, setWithdrawingId] = useState(null);
  const [selectedCampaignId, setSelectedCampaignId] = useState(null);
  const [showReportForm, setShowReportForm] = useState(false);
  const [showReportView, setShowReportView] = useState(false);

  useEffect(() => {
    fetchMyApplications();
  }, []);

  const filtered = activeTab === 'all'
    ? myApplications
    : myApplications.filter((a) => a.status === activeTab);

  const handleWithdraw = async (id) => {
    if (!window.confirm('Withdraw this application?')) return;
    setWithdrawingId(id);
    try {
      await withdraw(id);
      toast.success('Application withdrawn');
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to withdraw');
    } finally {
      setWithdrawingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-5">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Applications</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {myApplications.length} application{myApplications.length !== 1 ? 's' : ''} total
          </p>
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1 overflow-x-auto">
          {STATUS_TABS.map((t) => {
            const count = t.key === 'all'
              ? myApplications.length
              : myApplications.filter((a) => a.status === t.key).length;
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

        {/* ── List ────────────────────────────────────────────────────── */}
        {isLoading ? (
          <div className="space-y-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4">
                <Skeleton count={3} />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Send}
            title={activeTab === 'all' ? 'No applications yet' : `No ${activeTab} applications`}
            description="Browse campaigns and apply to start collaborating with brands."
            action={{ label: 'Find Campaigns', onClick: () => window.location.href = '/campaigns' }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((app) => {
              const campaign = app.campaignId ?? {};
              const business = app.businessId ?? campaign.businessId ?? {};

              return (
                <div
                  key={app._id}
                  className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
                    <div className="flex items-start gap-3 min-w-0">
                      <Avatar
                        src={business.avatar ?? business.logo}
                        name={business.name ?? business.businessName}
                        size="sm"
                        className="shrink-0 mt-0.5"
                      />
                      <div className="min-w-0">
                        <Link
                          to={`/campaigns/${campaign._id ?? app.campaignId}`}
                          className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm"
                        >
                          {campaign.title ?? 'Campaign'}
                        </Link>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {business.name ?? business.businessName ?? 'Business'} ·{' '}
                          Applied {formatRelativeTime(app.createdAt)}
                        </p>
                        {app.coverLetter && (
                          <p className="text-xs text-gray-400 mt-1.5 leading-relaxed">
                            {truncateText(app.coverLetter, 120)}
                          </p>
                        )}
                        {app.businessNotes && (
                          <div className="mt-2 bg-amber-50 border border-amber-200 rounded-lg px-3 py-2 text-xs text-amber-800">
                            <span className="font-semibold">Brand note: </span>
                            {app.businessNotes}
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Status + action */}
                    <div className="flex items-center gap-2 shrink-0">
                      <Badge variant={STATUS_VARIANT[app.status] ?? 'default'} size="sm" className="capitalize">
                        {app.status}
                      </Badge>
                      {app.status === 'accepted' && (
                        <div className="flex gap-1.5">
                          <Button
                            variant="primary"
                            size="sm"
                            className="text-xs py-1 px-2.5"
                            onClick={() => {
                              setSelectedCampaignId(campaign._id ?? app.campaignId);
                              setShowReportForm(true);
                            }}
                          >
                            Submit Report
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="text-xs py-1 px-2.5"
                            onClick={() => {
                              setSelectedCampaignId(campaign._id ?? app.campaignId);
                              setShowReportView(true);
                            }}
                          >
                            View Reports
                          </Button>
                        </div>
                      )}
                      {app.status === 'pending' && (
                        <Button
                          variant="ghost"
                          size="sm"
                          isLoading={withdrawingId === app._id}
                          onClick={() => handleWithdraw(app._id)}
                          className="text-red-500 hover:bg-red-50 text-xs"
                        >
                          Withdraw
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {showReportForm && selectedCampaignId && (
          <ReportFormModal
            isOpen={showReportForm}
            onClose={() => {
              setShowReportForm(false);
              setSelectedCampaignId(null);
            }}
            campaignId={selectedCampaignId}
            onSubmitSuccess={fetchMyApplications}
          />
        )}

        {showReportView && selectedCampaignId && (
          <ReportViewModal
            isOpen={showReportView}
            onClose={() => {
              setShowReportView(false);
              setSelectedCampaignId(null);
            }}
            campaignId={selectedCampaignId}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

export default MyApplicationsPage;
