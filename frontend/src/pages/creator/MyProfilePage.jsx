import { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, MapPin, Star } from 'lucide-react';
import toast from 'react-hot-toast';
import useCreatorStore from '../../store/creatorStore.js';
import useAuthStore from '../../store/authStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import SocialMediaStats from '../../components/creator/SocialMediaStats.jsx';
import { PageLoader } from '../../components/ui/Loader.jsx';
import { formatCurrency, formatNumber } from '../../utils/helpers.js';

// ─── Profile completeness ─────────────────────────────────────────────────────

const completeness = (p) => {
  if (!p) return 0;
  const checks = [
    !!p.bio, !!p.location,
    (p.niche?.length ?? 0) > 0,
    Object.keys(p.socialMedia ?? {}).length > 0,
    !!(p.pricing?.postRate || p.pricing?.storyRate || p.pricing?.videoRate),
  ];
  return Math.round((checks.filter(Boolean).length / checks.length) * 100);
};

// ─── Add portfolio modal ──────────────────────────────────────────────────────

const AddPortfolioModal = ({ onClose, onAdd }) => {
  const [url,   setUrl]   = useState('');
  const [title, setTitle] = useState('');
  const [thumb, setThumb] = useState('');

  return (
    <Modal isOpen onClose={onClose} title="Add Portfolio Item" size="sm">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">URL</label>
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://instagram.com/p/..."
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Title (optional)</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL (optional)</label>
          <input value={thumb} onChange={(e) => setThumb(e.target.value)}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex gap-2 pt-1">
          <Button variant="primary" className="flex-1" onClick={() => { onAdd({ url, title, thumbnail: thumb }); onClose(); }} disabled={!url}>
            Add
          </Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const MyProfilePage = () => {
  const user = useAuthStore((s) => s.user);
  const {
    profile, isLoading,
    fetchMyProfile, updateProfile, addPortfolioItem, removePortfolioItem,
  } = useCreatorStore();

  const [showPortfolioModal, setShowPortfolioModal] = useState(false);
  const [showPackageModal, setShowPackageModal] = useState(false);
  const [showMetricsModal, setShowMetricsModal] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => {
    fetchMyProfile();
  }, []);

  if (isLoading && !profile) return <DashboardLayout><PageLoader /></DashboardLayout>;

  const niches      = profile?.niche ?? [];
  const socialMedia = profile?.socialMedia ?? {};
  const portfolio   = profile?.portfolio ?? [];
  const pricing     = profile?.pricing ?? {};
  const packages    = profile?.packages ?? [];
  const monthlyViews = profile?.monthlyViews ?? 0;
  const monthlyUploads = profile?.monthlyUploads ?? 0;
  const avgReelViews = profile?.avgReelViews ?? 0;
  const audienceDetails = profile?.audienceDetails ?? '';
  const pct         = completeness(profile);

  const handleAddPortfolio = async (item) => {
    try {
      await addPortfolioItem(item);
      toast.success('Portfolio item added');
    } catch {
      toast.error('Failed to add item');
    }
  };

  const handleRemovePortfolio = async (itemId) => {
    setDeletingId(itemId);
    try {
      await removePortfolioItem(itemId);
      toast.success('Item removed');
    } catch {
      toast.error('Failed to remove item');
    } finally {
      setDeletingId(null);
    }
  };

  const handleAddPackage = async (newPkg) => {
    try {
      const updatedPackages = [...packages, newPkg];
      await updateProfile({ packages: updatedPackages });
      toast.success('Package added');
    } catch {
      toast.error('Failed to add package');
    }
  };

  const handleRemovePackage = async (pkgId) => {
    try {
      const updatedPackages = packages.filter((p) => p._id !== pkgId);
      await updateProfile({ packages: updatedPackages });
      toast.success('Package removed');
    } catch {
      toast.error('Failed to remove package');
    }
  };

  const handleUpdateMetrics = async (metricsData) => {
    try {
      await updateProfile(metricsData);
      toast.success('Metrics updated');
    } catch {
      toast.error('Failed to update metrics');
    }
  };

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── Profile card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-28 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div className="px-6 pb-6">
            <div className="-mt-10 flex items-end justify-between">
              <Avatar src={user?.avatar} name={user?.name} size="xl" showBadge={user?.verificationBadge} className="ring-4 ring-white" />
              <div className="flex items-center gap-3">
                <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${profile?.isPublished ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {profile?.isPublished ? '🟢 Published' : '🔴 Draft Mode'}
                </span>
                <Button
                  variant={profile?.isPublished ? 'outline' : 'primary'}
                  size="sm"
                  onClick={async () => {
                    try {
                      await updateProfile({ isPublished: !profile?.isPublished });
                      toast.success(profile?.isPublished ? 'Profile unpublished.' : 'Profile published! 🎉');
                    } catch {
                      toast.error('Failed to update status');
                    }
                  }}
                >
                  {profile?.isPublished ? 'Unpublish' : 'Publish'}
                </Button>
                <Button variant="outline" size="sm" onClick={() => toast('Profile editing coming soon!')}>
                  <Pencil className="h-4 w-4" /> Edit Profile
                </Button>
              </div>
            </div>

            <div className="mt-3">
              <h1 className="text-xl font-bold text-gray-900">{user?.name}</h1>
              {profile?.location && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-0.5">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              )}
              {profile?.bio && (
                <p className="text-sm text-gray-600 mt-2 leading-relaxed max-w-2xl">{profile.bio}</p>
              )}
              {niches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {niches.map((n) => <Badge key={n} variant="info" size="sm">{n}</Badge>)}
                </div>
              )}
            </div>

            {/* Profile completeness */}
            <div className="mt-5 border-t border-gray-100 pt-4">
              <div className="flex justify-between text-sm mb-1.5">
                <span className="font-medium text-gray-700">Profile Strength</span>
                <span className={pct === 100 ? 'text-green-600 font-semibold' : 'text-indigo-600 font-semibold'}>
                  {pct}%
                </span>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-indigo-600 rounded-full transition-all"
                  style={{ width: `${pct}%` }}
                />
              </div>
              {pct < 100 && (
                <p className="text-xs text-gray-400 mt-1">
                  Complete your profile to attract more brands
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── Social media stats ──────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Social Media</h2>
            <Button variant="ghost" size="sm" onClick={() => toast('Social media editing coming soon!')}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>
          {Object.keys(socialMedia).length === 0 ? (
            <p className="text-sm text-gray-400">No social media added yet.</p>
          ) : (
            <SocialMediaStats socialMedia={socialMedia} />
          )}
        </div>

        {/* ── Portfolio ─────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Portfolio</h2>
            <Button variant="outline" size="sm" onClick={() => setShowPortfolioModal(true)}>
              <Plus className="h-4 w-4" /> Add
            </Button>
          </div>

          {portfolio.length === 0 ? (
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-8 text-center">
              <p className="text-sm text-gray-400">No portfolio items yet.</p>
              <Button variant="primary" size="sm" className="mt-3" onClick={() => setShowPortfolioModal(true)}>
                Add First Item
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((item, idx) => (
                <div key={item._id ?? idx} className="group relative aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200">
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title ?? 'Portfolio item'}
                      className="h-full w-full object-cover"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 p-2 text-center">
                      {item.title ?? 'Item'}
                    </div>
                  )}
                  {/* Delete overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => handleRemovePortfolio(item._id)}
                      disabled={deletingId === item._id}
                      className="opacity-0 group-hover:opacity-100 transition-opacity p-2 bg-red-600 text-white rounded-full hover:bg-red-700"
                      aria-label="Remove item"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Pricing ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Pricing</h2>
            <Button variant="ghost" size="sm" onClick={() => toast('Pricing editing coming soon!')}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>

          {!(pricing.postRate || pricing.storyRate || pricing.videoRate) ? (
            <p className="text-sm text-gray-400">No pricing set. Add rates to attract brands.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { key: 'postRate',  label: 'Feed Post' },
                { key: 'storyRate', label: 'Story'     },
                { key: 'videoRate', label: 'Video/Reel' },
              ].map(({ key, label }) => pricing[key] ? (
                <div key={key} className="bg-indigo-50 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">{label}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">
                    {formatCurrency(pricing[key], pricing.currency ?? 'INR')}
                  </p>
                </div>
              ) : null)}
            </div>
          )}
        </div>

        {/* ── Packages ───────────────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Service Packages</h2>
            <Button variant="outline" size="sm" onClick={() => setShowPackageModal(true)}>
              <Plus className="h-4 w-4" /> Add Package
            </Button>
          </div>

          {packages.length === 0 ? (
            <p className="text-sm text-gray-400">No service packages defined yet. Add packages to showcase your rates to brands.</p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {packages.map((pkg, idx) => (
                <div key={pkg._id ?? idx} className="border border-indigo-100 bg-indigo-50/20 rounded-xl p-4 flex flex-col justify-between relative group">
                  <button
                    onClick={() => handleRemovePackage(pkg._id)}
                    className="absolute top-2 right-2 p-1 bg-red-50 text-red-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-100"
                    aria-label="Delete Package"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                  <div>
                    <h3 className="font-bold text-gray-900 text-sm">{pkg.name}</h3>
                    <div className="space-y-1.5 mt-3 text-xs text-gray-600">
                      <p>🎥 {pkg.reelsCount} Reels</p>
                      <p>📈 {formatNumber(pkg.expectedViews)} Expected Views</p>
                      <p>📅 {pkg.durationDays} Days Duration</p>
                      <p>📊 {pkg.reportingFrequency} Report</p>
                    </div>
                  </div>
                  <div className="border-t border-gray-100 pt-3 mt-4 flex items-baseline justify-between">
                    <span className="text-xs text-gray-500 font-medium">Budget</span>
                    <span className="font-extrabold text-indigo-700 text-base">₹{formatNumber(pkg.price)}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* ── Analytics & Metrics ────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-gray-900">Performance Metrics</h2>
            <Button variant="ghost" size="sm" onClick={() => setShowMetricsModal(true)}>
              <Pencil className="h-3.5 w-3.5" /> Edit
            </Button>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Views</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{formatNumber(monthlyViews)}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Uploads</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{monthlyUploads}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Reel Views</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{formatNumber(avgReelViews)}</p>
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Engagement Rate</p>
              <p className="text-xl font-bold text-gray-900 mt-1">{(profile?.averageEngagement ?? 0).toFixed(1)}%</p>
            </div>
          </div>

          {audienceDetails && (
            <div className="mt-4 border-t border-gray-100 pt-4">
              <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Audience & Demographics</h3>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-3.5 border border-gray-100 rounded-xl">{audienceDetails}</p>
            </div>
          )}
        </div>

        {showPortfolioModal && (
          <AddPortfolioModal onClose={() => setShowPortfolioModal(false)} onAdd={handleAddPortfolio} />
        )}

        {showPackageModal && (
          <AddPackageModal onClose={() => setShowPackageModal(false)} onAdd={handleAddPackage} />
        )}

        {showMetricsModal && (
          <EditMetricsModal
            onClose={() => setShowMetricsModal(false)}
            initialMetrics={{
              monthlyViews,
              monthlyUploads,
              avgReelViews,
              averageEngagement: profile?.averageEngagement ?? 0,
              audienceDetails,
            }}
            onSave={handleUpdateMetrics}
          />
        )}
      </div>
    </DashboardLayout>
  );
};

// ─── Modal components ─────────────────────────────────────────────────────────

const AddPackageModal = ({ onClose, onAdd }) => {
  const [name, setName] = useState('');
  const [reelsCount, setReelsCount] = useState('');
  const [expectedViews, setExpectedViews] = useState('');
  const [durationDays, setDurationDays] = useState('');
  const [reportingFrequency, setReportingFrequency] = useState('weekly');
  const [price, setPrice] = useState('');

  const handleSubmit = () => {
    onAdd({
      name,
      reelsCount: Number(reelsCount) || 0,
      expectedViews: Number(expectedViews) || 0,
      durationDays: Number(durationDays) || 30,
      reportingFrequency,
      price: Number(price) || 0,
    });
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Add Service Package" size="sm">
      <div className="space-y-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Package Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} placeholder="e.g. Starter Reel Package" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Number of Reels</label>
            <input type="number" value={reelsCount} onChange={(e) => setReelsCount(e.target.value)} placeholder="3" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Expected Views</label>
            <input type="number" value={expectedViews} onChange={(e) => setExpectedViews(e.target.value)} placeholder="10000" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Duration (Days)</label>
            <input type="number" value={durationDays} onChange={(e) => setDurationDays(e.target.value)} placeholder="30" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Report Frequency</label>
            <select value={reportingFrequency} onChange={(e) => setReportingFrequency(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="weekly">Weekly Report</option>
              <option value="monthly">Monthly Report</option>
            </select>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Price (₹)</label>
          <input type="number" value={price} onChange={(e) => setPrice(e.target.value)} placeholder="10000" className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="primary" className="flex-1" onClick={handleSubmit} disabled={!name || !price}>Add Package</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

const EditMetricsModal = ({ onClose, initialMetrics, onSave }) => {
  const [monthlyViews, setMonthlyViews] = useState(initialMetrics.monthlyViews ?? 0);
  const [monthlyUploads, setMonthlyUploads] = useState(initialMetrics.monthlyUploads ?? 0);
  const [avgReelViews, setAvgReelViews] = useState(initialMetrics.avgReelViews ?? 0);
  const [averageEngagement, setAverageEngagement] = useState(initialMetrics.averageEngagement ?? 0);
  const [audienceDetails, setAudienceDetails] = useState(initialMetrics.audienceDetails ?? '');

  const handleSubmit = () => {
    onSave({
      monthlyViews: Number(monthlyViews) || 0,
      monthlyUploads: Number(monthlyUploads) || 0,
      avgReelViews: Number(avgReelViews) || 0,
      averageEngagement: Number(averageEngagement) || 0,
      audienceDetails,
    });
    onClose();
  };

  return (
    <Modal isOpen onClose={onClose} title="Edit Performance Metrics" size="sm">
      <div className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Views</label>
            <input type="number" value={monthlyViews} onChange={(e) => setMonthlyViews(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Uploads</label>
            <input type="number" value={monthlyUploads} onChange={(e) => setMonthlyUploads(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Avg Reel Views</label>
            <input type="number" value={avgReelViews} onChange={(e) => setAvgReelViews(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Engagement Rate (%)</label>
            <input type="number" step="0.1" value={averageEngagement} onChange={(e) => setAverageEngagement(e.target.value)} className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Audience Demographics</label>
          <textarea rows={3} value={audienceDetails} onChange={(e) => setAudienceDetails(e.target.value)} placeholder="e.g. 60% Female, 40% Male. Top cities: Mumbai, Delhi, Bangalore." className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
        </div>
        <div className="flex gap-2 pt-2">
          <Button variant="primary" className="flex-1" onClick={handleSubmit}>Save Metrics</Button>
          <Button variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </div>
    </Modal>
  );
};

export default MyProfilePage;
