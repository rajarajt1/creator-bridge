import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Send, CheckCircle, Clock, TrendingUp,
  ArrowRight, Plus, Eye, BarChart2,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useApplicationStore from '../../store/applicationStore.js';
import useCampaignStore from '../../store/campaignStore.js';
import useCreatorStore from '../../store/creatorStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { formatCurrency, formatRelativeTime } from '../../utils/helpers.js';

// ─── Stat card ────────────────────────────────────────────────────────────────

const StatCard = ({ icon: Icon, label, value, color, sub }) => (
  <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm">
    <div className="flex items-start justify-between">
      <div>
        <p className="text-sm text-gray-500">{label}</p>
        <p className="text-2xl font-bold text-gray-900 mt-0.5">{value}</p>
        {sub && <p className="text-xs text-gray-400 mt-1">{sub}</p>}
      </div>
      <div className={`p-2.5 rounded-xl ${color}`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
    </div>
  </div>
);

// ─── Profile completeness ─────────────────────────────────────────────────────

const completeness = (profile) => {
  if (!profile) return 0;
  const fields = ['bio', 'location', 'niche', 'socialMedia', 'pricing'];
  const filled  = fields.filter((f) => {
    const v = profile[f];
    if (!v) return false;
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object') return Object.keys(v).length > 0;
    return Boolean(v);
  });
  return Math.round((filled.length / fields.length) * 100);
};

// ─── Status badge variant ─────────────────────────────────────────────────────

const STATUS_VARIANT = {
  pending:   'default',
  reviewing: 'info',
  accepted:  'success',
  rejected:  'error',
  withdrawn: 'warning',
};

// ─── Component ────────────────────────────────────────────────────────────────

const CreatorDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { myApplications, fetchMyApplications, isLoading: appsLoading } = useApplicationStore();
  const { campaigns, fetchCampaigns, isLoading: campaignsLoading } = useCampaignStore();
  const { profile, fetchMyProfile } = useCreatorStore();

  useEffect(() => {
    fetchMyApplications();
    fetchMyProfile();
    // Fetch recommended campaigns based on first niche
  }, []);

  useEffect(() => {
    if (profile?.niche?.length) {
      fetchCampaigns({ category: profile.niche[0] }, 1);
    } else {
      fetchCampaigns({}, 1);
    }
  }, [profile?.niche]);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const total    = myApplications.length;
  const accepted = myApplications.filter((a) => a.status === 'accepted').length;
  const pending  = myApplications.filter((a) => a.status === 'pending').length;
  const pct      = completeness(profile);

  const stats = [
    { label: 'Total Applications', value: total,    icon: Send,        color: 'bg-indigo-600' },
    { label: 'Accepted',           value: accepted, icon: CheckCircle, color: 'bg-green-600'  },
    { label: 'Pending',            value: pending,  icon: Clock,       color: 'bg-amber-500'  },
    { label: 'Profile Views',      value: '—',      icon: Eye,         color: 'bg-purple-600', sub: 'MVP placeholder' },
  ];

  const recent       = [...myApplications].slice(0, 5);
  const recommended  = campaigns.slice(0, 3);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">

        {/* ── Welcome banner ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar} name={user?.name} size="lg" showBadge={user?.verificationBadge} />
            <div>
              <h1 className="text-xl font-bold">Welcome back, {user?.name?.split(' ')[0]}! 👋</h1>
              <p className="text-indigo-200 text-sm mt-0.5">Your creative journey continues</p>
            </div>
          </div>

          {/* Profile completeness */}
          <div className="w-full sm:w-48 shrink-0">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-indigo-200">Profile strength</span>
              <span className="font-semibold">{pct}%</span>
            </div>
            <div className="h-2 bg-white/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-amber-400 rounded-full transition-all duration-700"
                style={{ width: `${pct}%` }}
              />
            </div>
            {pct < 100 && (
              <Link to="/profile" className="text-xs text-amber-300 hover:underline mt-1 block">
                Complete profile →
              </Link>
            )}
          </div>
        </div>

        {/* ── Stats grid ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => (
            <StatCard key={s.label} {...s} />
          ))}
        </div>

        {/* ── Main content ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Recent applications */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Applications</h2>
              <Link to="/applications" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {appsLoading ? (
                Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="px-5 py-3"><Skeleton /></div>
                ))
              ) : recent.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-gray-400">No applications yet.</p>
                  <Link to="/campaigns">
                    <Button variant="primary" size="sm" className="mt-3">Find Campaigns</Button>
                  </Link>
                </div>
              ) : (
                recent.map((app) => (
                  <div key={app._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {app.campaignId?.title ?? 'Campaign'}
                      </p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {formatRelativeTime(app.createdAt)}
                      </p>
                    </div>
                    <Badge variant={STATUS_VARIANT[app.status] ?? 'default'} size="sm" className="capitalize ml-3 shrink-0">
                      {app.status}
                    </Badge>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick actions */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'Browse Campaigns',   to: '/campaigns',    icon: BarChart2 },
                  { label: 'My Applications',    to: '/applications', icon: Send      },
                  { label: 'Edit Profile',        to: '/profile',      icon: TrendingUp},
                ].map(({ label, to, icon: Icon }) => (
                  <Link key={to} to={to}
                    className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 transition-colors text-sm font-medium text-gray-700"
                  >
                    <Icon className="h-4 w-4 text-indigo-600" />
                    {label}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ── Recommended campaigns ──────────────────────────────────── */}
        {recommended.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recommended for You</h2>
              <Link to="/campaigns" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
                See all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
              {recommended.map((c) => (
                <div key={c._id} className="p-5">
                  <p className="text-sm font-semibold text-gray-900 line-clamp-1">{c.title}</p>
                  <p className="text-xs text-gray-500 mt-1 line-clamp-2">{c.description}</p>
                  <div className="flex items-center justify-between mt-3">
                    <Badge variant="info" size="sm">{c.category}</Badge>
                    <Link to={`/campaigns/${c._id}`} className="text-xs text-indigo-600 hover:underline">
                      View →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default CreatorDashboard;
