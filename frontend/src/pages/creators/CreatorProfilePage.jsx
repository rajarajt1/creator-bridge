import { useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, MessageSquare, MapPin, Star, Briefcase } from 'lucide-react';
import useCreatorStore from '../../store/creatorStore.js';
import useAuthStore from '../../store/authStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import SocialMediaStats from '../../components/creator/SocialMediaStats.jsx';
import { PageLoader } from '../../components/ui/Loader.jsx';
import { formatCurrency, formatNumber } from '../../utils/helpers.js';

const CreatorProfilePage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { selectedCreator: creator, fetchCreatorById, isLoading } = useCreatorStore();
  const currentUser = useAuthStore((s) => s.user);

  useEffect(() => {
    if (id) fetchCreatorById(id);
  }, [id]);

  if (isLoading) return <DashboardLayout><PageLoader /></DashboardLayout>;

  if (!creator) {
    return (
      <DashboardLayout>
        <div className="flex flex-col items-center justify-center min-h-64 gap-3">
          <p className="text-gray-500">Creator not found.</p>
          <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
        </div>
      </DashboardLayout>
    );
  }

  const profile     = creator.profile ?? creator;
  const user        = creator.user ?? {};
  const name        = user.name ?? profile.name ?? 'Creator';
  const avatar      = user.avatar ?? profile.avatar ?? '';
  const isVerified  = user.verificationBadge ?? false;
  const niches      = profile.niche ?? [];
  const rating      = profile.rating?.average ?? 0;
  const reviews     = profile.rating?.count ?? 0;
  const portfolio   = profile.portfolio ?? [];
  const pricing     = profile.pricing ?? {};
  const socialMedia = profile.socialMedia ?? {};
  const isBusiness  = currentUser?.role === 'business';

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

        {/* ── Back button ─────────────────────────────────────────────── */}
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* ── Cover + Avatar ────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
          <div className="h-32 bg-gradient-to-r from-indigo-500 to-purple-600" />
          <div className="px-6 pb-6">
            <div className="-mt-12 flex items-end justify-between">
              <Avatar src={avatar} name={name} size="xl" showBadge={isVerified} className="ring-4 ring-white" />
              {isBusiness && (
                <Link to={`/messages?userId=${user._id ?? creator._id}`}>
                  <Button variant="primary" size="md">
                    <MessageSquare className="h-4 w-4" /> Message
                  </Button>
                </Link>
              )}
            </div>

            <div className="mt-3">
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-2xl font-bold text-gray-900">{name}</h1>
                {isVerified && <Badge variant="success" size="sm">Verified</Badge>}
              </div>

              {profile.location && (
                <p className="flex items-center gap-1.5 text-sm text-gray-500 mt-1">
                  <MapPin className="h-3.5 w-3.5" /> {profile.location}
                </p>
              )}

              {rating > 0 && (
                <p className="flex items-center gap-1.5 text-sm text-amber-600 mt-1">
                  <Star className="h-3.5 w-3.5 fill-amber-500" />
                  {rating.toFixed(1)} <span className="text-gray-400">({reviews} reviews)</span>
                </p>
              )}

              {profile.bio && (
                <p className="text-sm text-gray-600 mt-3 leading-relaxed max-w-2xl">{profile.bio}</p>
              )}

              {niches.length > 0 && (
                <div className="flex flex-wrap gap-1.5 mt-3">
                  {niches.map((n) => (
                    <Badge key={n} variant="info" size="sm">{n}</Badge>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* ── Social media stats ──────────────────────────────────────── */}
        {Object.keys(socialMedia).length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Social Media</h2>
            <SocialMediaStats socialMedia={socialMedia} />
          </div>
        )}

        {/* ── Portfolio ─────────────────────────────────────────────── */}
        {portfolio.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Portfolio</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {portfolio.map((item, idx) => (
                <a
                  key={item._id ?? idx}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group block aspect-square rounded-xl overflow-hidden bg-gray-100 border border-gray-200 hover:border-indigo-400 transition-colors"
                >
                  {item.thumbnail ? (
                    <img
                      src={item.thumbnail}
                      alt={item.title ?? 'Portfolio item'}
                      className="h-full w-full object-cover group-hover:scale-105 transition-transform"
                      loading="lazy"
                    />
                  ) : (
                    <div className="h-full w-full flex items-center justify-center text-xs text-gray-400 p-2 text-center">
                      {item.title ?? 'View'}
                    </div>
                  )}
                </a>
              ))}
            </div>
          </div>
        )}

        {/* ── Pricing ───────────────────────────────────────────────── */}
        {(pricing.postRate || pricing.storyRate || pricing.videoRate) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Pricing</h2>
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
          </div>
        )}

        {/* ── Packages ───────────────────────────────────────────────── */}
        {profile.packages && profile.packages.length > 0 && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Service Packages</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {profile.packages.map((pkg, idx) => (
                <div key={pkg._id ?? idx} className="border border-indigo-100 bg-indigo-50/20 rounded-xl p-4 flex flex-col justify-between">
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
          </div>
        )}

        {/* ── Performance Metrics ────────────────────────────────────── */}
        {(profile.monthlyViews || profile.avgReelViews || profile.averageEngagement || profile.audienceDetails) && (
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
            <h2 className="font-semibold text-gray-900 mb-4">Performance Metrics</h2>
            
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {profile.monthlyViews > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Views</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatNumber(profile.monthlyViews)}</p>
                </div>
              )}
              {profile.monthlyUploads > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Monthly Uploads</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{profile.monthlyUploads}</p>
                </div>
              )}
              {profile.avgReelViews > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Avg Reel Views</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{formatNumber(profile.avgReelViews)}</p>
                </div>
              )}
              {profile.averageEngagement > 0 && (
                <div className="bg-gray-50 border border-gray-100 rounded-xl p-4 text-center">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Engagement Rate</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{profile.averageEngagement.toFixed(1)}%</p>
                </div>
              )}
            </div>

            {profile.audienceDetails && (
              <div className="mt-4 border-t border-gray-100 pt-4">
                <h3 className="text-sm font-semibold text-gray-700 mb-1.5">Audience & Demographics</h3>
                <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line bg-gray-50/50 p-3.5 border border-gray-100 rounded-xl">{profile.audienceDetails}</p>
              </div>
            )}
          </div>
        )}

        {/* ── Reviews placeholder ─────────────────────────────────────── */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
          <h2 className="font-semibold text-gray-900 mb-2">Reviews</h2>
          <p className="text-sm text-gray-400 italic">Reviews coming soon.</p>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default CreatorProfilePage;
