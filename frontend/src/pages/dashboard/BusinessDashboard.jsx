import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import useCreatorStore from '../../store/creatorStore.js';
import {
  Megaphone, Users, CheckCircle, Eye,
  ArrowRight, Plus, MoreHorizontal,
} from 'lucide-react';
import useAuthStore from '../../store/authStore.js';
import useApplicationStore from '../../store/applicationStore.js';
import useCampaignStore from '../../store/campaignStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Button from '../../components/ui/Button.jsx';
import { Skeleton } from '../../components/ui/Loader.jsx';
import { formatRelativeTime } from '../../utils/helpers.js';

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

// ─── Campaign status badge ────────────────────────────────────────────────────

const CAMP_STATUS = {
  active:    'success',
  paused:    'warning',
  draft:     'default',
  completed: 'info',
  cancelled: 'error',
};

const APP_STATUS = {
  pending:   'default',
  reviewing: 'info',
  accepted:  'success',
  rejected:  'error',
  withdrawn: 'warning',
};

// ─── Component ────────────────────────────────────────────────────────────────

const BusinessDashboard = () => {
  const user = useAuthStore((s) => s.user);
  const { myCampaigns, fetchMyCampaigns, isLoading: campLoading } = useCampaignStore();
  const { campaignApplications, fetchCampaignApplications, isLoading: appsLoading } = useApplicationStore();
  const { profile, fetchMyProfile, updateProfile } = useCreatorStore();

  useEffect(() => {
    fetchMyCampaigns();
    fetchMyProfile();
  }, []);

  // Pull recent applications for the first active campaign
  const firstActive = myCampaigns.find((c) => c.status === 'active');
  useEffect(() => {
    if (firstActive?._id) {
      fetchCampaignApplications(firstActive._id);
    }
  }, [firstActive?._id]);

  // ── Stats ─────────────────────────────────────────────────────────────────

  const activeCamps  = myCampaigns.filter((c) => c.status === 'active').length;
  const totalApps    = myCampaigns.reduce((s, c) => s + (c.applicationsCount ?? 0), 0);
  const topCampaign  = [...myCampaigns].sort((a, b) => (b.applicationsCount ?? 0) - (a.applicationsCount ?? 0))[0];

  const stats = [
    { label: 'Active Campaigns',     value: activeCamps,           icon: Megaphone,   color: 'bg-indigo-600' },
    { label: 'Total Applications',   value: totalApps,             icon: Users,       color: 'bg-amber-500'  },
    { label: 'Selected Creators',    value: '—',                   icon: CheckCircle, color: 'bg-green-600', sub: 'MVP placeholder' },
    { label: 'Total Views',          value: '—',                   icon: Eye,         color: 'bg-purple-600', sub: 'MVP placeholder' },
  ];

  const recentApps = campaignApplications.slice(0, 5);

  return (
    <DashboardLayout>
      <div className="max-w-6xl mx-auto space-y-6 p-4 sm:p-6">

        {/* ── Welcome banner ─────────────────────────────────────────── */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Avatar src={user?.avatar} name={user?.name} size="lg" />
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-bold">Welcome, {user?.name?.split(' ')[0]}! 👋</h1>
                <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-indigo-500/50 text-white uppercase tracking-wider">
                  {user?.subscriptionPlan || 'free'}
                </span>
                <Link to="/choose-plan" className="text-xs text-amber-300 hover:underline">Upgrade</Link>
              </div>
              <p className="text-indigo-200 text-sm mt-0.5">Manage your campaigns & find top creators</p>
            </div>
          </div>

          <Link to="/campaigns/create">
            <Button variant="secondary" size="md" className="shrink-0">
              <Plus className="h-4 w-4" /> Post Campaign
            </Button>
          </Link>
        </div>
        
        {/* ── Publish Warning Banner ──────────────────────────────────── */}
        {profile && !profile.isPublished && (
          <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex gap-3">
              <span className="text-2xl mt-0.5">⚠️</span>
              <div>
                <h4 className="font-semibold text-amber-900 text-sm">Company profile is currently in Draft mode</h4>
                <p className="text-xs text-amber-700 mt-0.5">Publish your company details to make your brand visible to creators and gain more organic interest.</p>
              </div>
            </div>
            <Button
              variant="primary"
              size="sm"
              className="shrink-0 bg-amber-600 hover:bg-amber-700 border-transparent text-white"
              onClick={async () => {
                try {
                  await updateProfile({ isPublished: true });
                  toast.success('Your business profile is now live! 🎉');
                } catch {
                  toast.error('Failed to publish profile');
                }
              }}
            >
              Publish Now
            </Button>
          </div>
        )}

        {/* ── Stats ──────────────────────────────────────────────────── */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((s) => <StatCard key={s.label} {...s} />)}
        </div>

        {/* ── Main content ───────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Active campaigns list */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Your Campaigns</h2>
              <Link to="/my-campaigns" className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5">
                View all <ArrowRight className="h-3 w-3" />
              </Link>
            </div>

            <div className="divide-y divide-gray-50">
              {campLoading ? (
                Array.from({ length: 3 }, (_, i) => (
                  <div key={i} className="px-5 py-3"><Skeleton /></div>
                ))
              ) : myCampaigns.length === 0 ? (
                <div className="px-5 py-10 text-center">
                  <p className="text-sm text-gray-400 mb-3">No campaigns yet.</p>
                  <Link to="/campaigns/create">
                    <Button variant="primary" size="sm">
                      <Plus className="h-4 w-4" /> Post First Campaign
                    </Button>
                  </Link>
                </div>
              ) : (
                myCampaigns.slice(0, 6).map((c) => (
                  <div key={c._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors group">
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{c.title}</p>
                      <p className="text-xs text-gray-400 mt-0.5">
                        {c.applicationsCount ?? 0} applications · {formatRelativeTime(c.createdAt)}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 ml-3 shrink-0">
                      <Badge variant={CAMP_STATUS[c.status] ?? 'default'} size="sm" className="capitalize">
                        {c.status}
                      </Badge>
                      <Link
                        to={`/campaigns/${c._id}/applications`}
                        className="text-xs text-indigo-600 hover:underline opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        View apps
                      </Link>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Quick actions + top campaign */}
          <div className="space-y-4">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Quick Actions</h2>
              <div className="space-y-2">
                {[
                  { label: 'Post New Campaign', to: '/campaigns/create', icon: Plus,        primary: true },
                  { label: 'Find Creators',     to: '/creators',         icon: Users,       primary: false },
                  { label: 'My Campaigns',      to: '/my-campaigns',     icon: Megaphone,   primary: false },
                ].map(({ label, to, icon: Icon, primary }) => (
                  <Link key={to} to={to}
                    className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg border transition-colors text-sm font-medium ${
                      primary
                        ? 'bg-indigo-600 text-white border-indigo-600 hover:bg-indigo-700'
                        : 'border-gray-200 text-gray-700 hover:border-indigo-300 hover:bg-indigo-50'
                    }`}
                  >
                    <Icon className={`h-4 w-4 ${primary ? 'text-white' : 'text-indigo-600'}`} />
                    {label}
                  </Link>
                ))}
              </div>
            </div>

            {/* Top campaign highlight */}
            {topCampaign && (
              <div className="bg-amber-50 border border-amber-200 rounded-xl p-5">
                <p className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-2">Top Campaign</p>
                <p className="font-semibold text-gray-900 text-sm">{topCampaign.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {topCampaign.applicationsCount ?? 0} applications received
                </p>
                <Link
                  to={`/campaigns/${topCampaign._id}/applications`}
                  className="mt-3 inline-flex items-center gap-1 text-xs text-amber-700 font-medium hover:underline"
                >
                  View applications <ArrowRight className="h-3 w-3" />
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* ── Recent applications received ───────────────────────────── */}
        {recentApps.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h2 className="font-semibold text-gray-900">Recent Applications Received</h2>
              {firstActive && (
                <Link to={`/campaigns/${firstActive._id}/applications`}
                  className="text-xs text-indigo-600 hover:underline flex items-center gap-0.5"
                >
                  View all <ArrowRight className="h-3 w-3" />
                </Link>
              )}
            </div>
            <div className="divide-y divide-gray-50">
              {recentApps.map((app) => (
                <div key={app._id} className="flex items-center justify-between px-5 py-3 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <Avatar src={app.creatorId?.avatar} name={app.creatorId?.name} size="sm" />
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{app.creatorId?.name ?? 'Creator'}</p>
                      <p className="text-xs text-gray-400">{formatRelativeTime(app.createdAt)}</p>
                    </div>
                  </div>
                  <Badge variant={APP_STATUS[app.status] ?? 'default'} size="sm" className="capitalize ml-3 shrink-0">
                    {app.status}
                  </Badge>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </DashboardLayout>
  );
};

export default BusinessDashboard;
