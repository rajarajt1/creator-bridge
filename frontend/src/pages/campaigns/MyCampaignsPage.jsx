import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Plus, Pencil, Trash2, Users, Eye, ToggleLeft, ToggleRight } from 'lucide-react';
import toast from 'react-hot-toast';
import useCampaignStore from '../../store/campaignStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import EmptyState from '../../components/ui/EmptyState.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { Megaphone } from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers.js';

const TABS = [
  { key: 'all',       label: 'All'       },
  { key: 'active',    label: 'Active'    },
  { key: 'paused',    label: 'Paused'    },
  { key: 'draft',     label: 'Draft'     },
  { key: 'completed', label: 'Completed' },
];

const STATUS_VARIANT = {
  active:    'success',
  paused:    'warning',
  draft:     'default',
  completed: 'info',
  cancelled: 'error',
};

// ─── Stat mini card ───────────────────────────────────────────────────────────

const QuickStat = ({ label, value }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="text-xl font-bold text-gray-900 mt-0.5">{value}</p>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const MyCampaignsPage = () => {
  const navigate = useNavigate();
  const { myCampaigns, fetchMyCampaigns, deleteCampaign, toggleStatus, isLoading } = useCampaignStore();
  const [activeTab, setActiveTab] = useState('all');
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);

  useEffect(() => {
    fetchMyCampaigns();
  }, []);

  const filtered = activeTab === 'all'
    ? myCampaigns
    : myCampaigns.filter((c) => c.status === activeTab);

  // Quick stats
  const total     = myCampaigns.length;
  const active    = myCampaigns.filter((c) => c.status === 'active').length;
  const totalApps = myCampaigns.reduce((s, c) => s + (c.applicationsCount ?? 0), 0);
  const totalViews = myCampaigns.reduce((s, c) => s + (c.views ?? 0), 0);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this campaign? This cannot be undone.')) return;
    setDeletingId(id);
    try {
      await deleteCampaign(id);
      toast.success('Campaign deleted');
    } catch {
      toast.error('Failed to delete');
    } finally {
      setDeletingId(null);
    }
  };

  const handleToggle = async (id) => {
    setTogglingId(id);
    try {
      await toggleStatus(id);
      toast.success('Status updated');
    } catch {
      toast.error('Failed to update status');
    } finally {
      setTogglingId(null);
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-5xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── Header ──────────────────────────────────────────────────── */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Campaigns</h1>
            <p className="text-sm text-gray-500 mt-0.5">{total} campaigns total</p>
          </div>
          <Link to="/campaigns/create">
            <Button variant="primary" size="md">
              <Plus className="h-4 w-4" /> New Campaign
            </Button>
          </Link>
        </div>

        {/* ── Quick stats ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <QuickStat label="Total" value={total} />
          <QuickStat label="Active" value={active} />
          <QuickStat label="Applications" value={totalApps} />
          <QuickStat label="Total Views" value={totalViews || '—'} />
        </div>

        {/* ── Tabs ────────────────────────────────────────────────────── */}
        <div className="flex gap-1 bg-gray-100 rounded-xl p-1">
          {TABS.map((t) => {
            const count = t.key === 'all' ? total : myCampaigns.filter((c) => c.status === t.key).length;
            return (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={[
                  'flex-1 py-1.5 px-3 rounded-lg text-sm font-medium transition-colors',
                  activeTab === t.key
                    ? 'bg-white shadow-sm text-gray-900'
                    : 'text-gray-500 hover:text-gray-700',
                ].join(' ')}
              >
                {t.label}
                {count > 0 && (
                  <span className={`ml-1.5 text-xs ${activeTab === t.key ? 'text-indigo-600' : 'text-gray-400'}`}>
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
              <div key={i} className="bg-white rounded-xl border border-gray-200 p-4"><Skeleton /></div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <EmptyState
            icon={Megaphone}
            title={activeTab === 'all' ? 'No campaigns yet' : `No ${activeTab} campaigns`}
            description="Create your first campaign to start finding creators."
            action={{ label: 'Create Campaign', onClick: () => navigate('/campaigns/create') }}
          />
        ) : (
          <div className="space-y-3">
            {filtered.map((c) => (
              <div
                key={c._id}
                className="bg-white rounded-xl border border-gray-200 shadow-sm px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <Link to={`/campaigns/${c._id}`} className="font-semibold text-gray-900 hover:text-indigo-600 transition-colors text-sm">
                      {c.title}
                    </Link>
                    <Badge variant={STATUS_VARIANT[c.status] ?? 'default'} size="sm" className="capitalize">
                      {c.status}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 mt-1 text-xs text-gray-400">
                    <span className="flex items-center gap-1">
                      <Users className="h-3 w-3" /> {c.applicationsCount ?? 0} applications
                    </span>
                    <span className="flex items-center gap-1">
                      <Eye className="h-3 w-3" /> {c.views ?? 0} views
                    </span>
                    <span>{formatRelativeTime(c.createdAt)}</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0">
                  <Link to={`/campaigns/${c._id}/applications`}>
                    <Button variant="ghost" size="sm" title="View applications">
                      <Users className="h-4 w-4" />
                    </Button>
                  </Link>

                  {/* Toggle active/paused */}
                  {(c.status === 'active' || c.status === 'paused') && (
                    <button
                      onClick={() => handleToggle(c._id)}
                      disabled={togglingId === c._id}
                      className="p-1.5 rounded-lg hover:bg-gray-100 transition-colors"
                      title={c.status === 'active' ? 'Pause campaign' : 'Activate campaign'}
                    >
                      {c.status === 'active'
                        ? <ToggleRight className="h-5 w-5 text-green-600" />
                        : <ToggleLeft className="h-5 w-5 text-gray-400" />
                      }
                    </button>
                  )}

                  <Link to={`/campaigns/${c._id}/edit`}>
                    <Button variant="ghost" size="sm" title="Edit campaign">
                      <Pencil className="h-4 w-4" />
                    </Button>
                  </Link>

                  <Button
                    variant="ghost"
                    size="sm"
                    title="Delete campaign"
                    isLoading={deletingId === c._id}
                    onClick={() => handleDelete(c._id)}
                    className="text-red-500 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default MyCampaignsPage;
