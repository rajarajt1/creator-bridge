import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  ArrowLeft, Calendar, IndianRupee, Users, CheckSquare,
  MapPin, Clock, Briefcase, MessageSquare,
} from 'lucide-react';
import { differenceInDays, isPast, parseISO } from 'date-fns';
import toast from 'react-hot-toast';
import useCampaignStore from '../../store/campaignStore.js';
import useApplicationStore from '../../store/applicationStore.js';
import useAuthStore from '../../store/authStore.js';
import useCreatorStore from '../../store/creatorStore.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import Avatar from '../../components/ui/Avatar.jsx';
import Badge from '../../components/ui/Badge.jsx';
import Button from '../../components/ui/Button.jsx';
import Modal from '../../components/ui/Modal.jsx';
import CampaignCard from '../../components/campaign/CampaignCard.jsx';
import { PageLoader } from '../../components/ui/Loader.jsx';
import { formatCurrency, formatDate, formatRelativeTime, formatNumber } from '../../utils/helpers.js';

// ─── Deadline badge ───────────────────────────────────────────────────────────

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  const date = typeof deadline === 'string' ? parseISO(deadline) : new Date(deadline);
  if (isPast(date)) return <Badge variant="error" size="sm">Deadline passed</Badge>;
  const days = differenceInDays(date, new Date());
  if (days <= 3) return <Badge variant="error" size="sm">{days}d left</Badge>;
  if (days <= 7) return <Badge variant="warning" size="sm">{days}d left</Badge>;
  return <Badge variant="success" size="sm">{days}d left</Badge>;
};

// ─── Apply modal ─────────────────────────────────────────────────────────────

const applySchema = z.object({
  coverLetter:  z.string().min(50, 'Cover letter must be at least 50 characters').max(1000),
  proposedRate: z.coerce.number().positive('Rate must be positive').optional().or(z.literal('')),
});

const ApplyModal = ({ campaign, onClose }) => {
  const { apply, fetchMyApplications, isLoading } = useApplicationStore();
  const profile = useCreatorStore((s) => s.profile);
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ resolver: zodResolver(applySchema) });

  const coverLetterLen = (watch('coverLetter') ?? '').length;

  const budgetHint = (() => {
    const b = campaign.budget ?? {};
    if (b.type === 'fixed')        return formatCurrency(b.amount ?? 0);
    if (b.type === 'range')        return `${formatCurrency(b.min ?? 0)} – ${formatCurrency(b.max ?? 0)}`;
    if (b.type === 'product-based') return 'Product-based';
    return 'Negotiable';
  })();

  const socialEntries = profile?.socialMedia
    ? Object.entries(profile.socialMedia).filter(([, v]) => v?.handle)
    : [];

  const onSubmit = async (data) => {
    try {
      await apply(campaign._id, {
        coverLetter:  data.coverLetter,
        proposedRate: data.proposedRate || undefined,
      });
      await fetchMyApplications();
      toast.success('Application submitted successfully!');
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message ?? 'Failed to submit application');
    }
  };

  return (
    <Modal isOpen onClose={onClose} title={`Apply to: ${campaign.title}`} size="md">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">

        {/* ── Stats summary (read-only) ─────────────────────────── */}
        {socialEntries.length > 0 && (
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
            <p className="text-xs font-semibold text-indigo-700 uppercase tracking-wider mb-3">Your Stats</p>
            <div className="grid grid-cols-2 gap-x-6 gap-y-1.5">
              {socialEntries.map(([platform, stats]) => (
                <div key={platform} className="flex items-center justify-between">
                  <span className="text-xs text-gray-500 capitalize">{platform}</span>
                  <span className="text-xs font-semibold text-gray-900">
                    {formatNumber(stats.followers ?? 0)} followers
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Cover letter ─────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="text-sm font-medium text-gray-700">Cover Letter</label>
            <span className={`text-xs tabular-nums ${
              coverLetterLen < 50 ? 'text-red-500' : 'text-gray-400'
            }`}>
              {coverLetterLen} / 1000
            </span>
          </div>
          <textarea
            rows={5}
            placeholder="Tell the brand why you're a great fit, your past experience, and what value you'll bring…"
            className={`block w-full rounded-lg border px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:border-transparent resize-none ${
              errors.coverLetter
                ? 'border-red-400 focus:ring-red-500'
                : 'border-gray-300 focus:ring-indigo-500'
            }`}
            {...register('coverLetter')}
          />
          {errors.coverLetter ? (
            <p className="mt-1 text-xs text-red-600">{errors.coverLetter.message}</p>
          ) : (
            <p className="mt-1 text-xs text-gray-400">Minimum 50 characters required</p>
          )}
        </div>

        {/* ── Proposed rate ────────────────────────────────────── */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Your Rate (₹){' '}
            <span className="text-gray-400 font-normal">optional</span>
          </label>
          <input
            type="number"
            min="0"
            placeholder={`Campaign budget: ${budgetHint}`}
            className="block w-full rounded-lg border border-gray-300 px-3 py-2 text-sm shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            {...register('proposedRate')}
          />
          {errors.proposedRate && (
            <p className="mt-1 text-xs text-red-600">{errors.proposedRate.message}</p>
          )}
        </div>

        <div className="flex gap-2 pt-1">
          <Button type="submit" variant="primary" className="flex-1" isLoading={isLoading}>
            Submit Application
          </Button>
          <Button type="button" variant="outline" onClick={onClose}>Cancel</Button>
        </div>
      </form>
    </Modal>
  );
};

// ─── Component ────────────────────────────────────────────────────────────────

const STATUS_VARIANT = {
  active:    'success',
  paused:    'warning',
  draft:     'default',
  completed: 'info',
  cancelled: 'error',
};

const CampaignDetailPage = () => {
  const { id }    = useParams();
  const navigate  = useNavigate();
  const { selectedCampaign: campaign, fetchCampaignById, campaigns, isLoading } = useCampaignStore();
  const { myApplications, fetchMyApplications } = useApplicationStore();
  const user = useAuthStore((s) => s.user);

  const [showApplyModal, setShowApplyModal] = useState(false);

  useEffect(() => {
    if (id) fetchCampaignById(id);
    if (user?.role === 'creator') fetchMyApplications();
  }, [id]);

  if (isLoading) return <DashboardLayout><PageLoader /></DashboardLayout>;
  if (!campaign) return (
    <DashboardLayout>
      <div className="flex flex-col items-center justify-center min-h-64 gap-3">
        <p className="text-gray-500">Campaign not found.</p>
        <Button variant="outline" onClick={() => navigate(-1)}>Go Back</Button>
      </div>
    </DashboardLayout>
  );

  const isCreator   = user?.role === 'creator';
  const isOwner     = campaign.businessId?._id === user?._id || campaign.businessId === user?._id;
  const existingApp = myApplications.find(
    (a) => (a.campaignId?._id ?? a.campaignId) === id
  );
  const hasApplied  = Boolean(existingApp);
  const deadline    = campaign.deadline ? new Date(campaign.deadline) : null;
  const isExpired   = deadline ? isPast(deadline) : false;
  const business    = campaign.businessId ?? {};
  const budget      = campaign.budget ?? {};
  const reqs        = campaign.requirements ?? {};
  const similar     = campaigns.filter((c) => c._id !== id && c.category === campaign.category).slice(0, 3);

  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-6">

        {/* Back */}
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" /> Back
        </button>

        {/* ── Main card ────────────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2 mb-2">
                <Badge variant={STATUS_VARIANT[campaign.status] ?? 'default'} size="sm" className="capitalize">
                  {campaign.status}
                </Badge>
                <Badge variant="info" size="sm">{campaign.category}</Badge>
                <DeadlineBadge deadline={campaign.deadline} />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">{campaign.title}</h1>
            </div>

            {/* Actions */}
            <div className="flex gap-2 shrink-0">
              {isCreator && !isOwner && (
                hasApplied ? (
                  <Badge variant={existingApp.status === 'accepted' ? 'success' : 'info'} size="md" className="capitalize self-start">
                    Applied: {existingApp.status}
                  </Badge>
                ) : (
                  <Button
                    variant="primary"
                    disabled={isExpired || campaign.status !== 'active'}
                    onClick={() => setShowApplyModal(true)}
                  >
                    Apply Now
                  </Button>
                )
              )}
              {isOwner && (
                <Link to={`/campaigns/${id}/edit`}>
                  <Button variant="outline">Edit Campaign</Button>
                </Link>
              )}
            </div>
          </div>
        </div>

        {/* ── Two column layout ─────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Description + requirements */}
          <div className="lg:col-span-2 space-y-5">
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3">About This Campaign</h2>
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">{campaign.description}</p>
            </div>

            {/* Requirements */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-5">
              <h2 className="font-semibold text-gray-900 mb-3">Requirements</h2>
              <ul className="space-y-2 text-sm text-gray-700">
                {reqs.platforms?.length > 0 && (
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-indigo-500 shrink-0" />
                    Platforms: {reqs.platforms.join(', ')}
                  </li>
                )}
                {reqs.contentType?.length > 0 && (
                  <li className="flex items-center gap-2">
                    <CheckSquare className="h-4 w-4 text-indigo-500 shrink-0" />
                    Content type: {reqs.contentType.join(', ')}
                  </li>
                )}
                {reqs.minFollowers > 0 && (
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-indigo-500 shrink-0" />
                    Minimum {Number(reqs.minFollowers).toLocaleString()} followers
                  </li>
                )}
                {reqs.location && (
                  <li className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 text-indigo-500 shrink-0" />
                    Location: {reqs.location}
                  </li>
                )}
              </ul>
            </div>

            {/* Tags */}
            {campaign.tags?.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {campaign.tags.map((t) => (
                  <span key={t} className="px-2.5 py-1 bg-gray-100 text-gray-600 text-xs rounded-full">#{t}</span>
                ))}
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Business card */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Posted By</p>
              <div className="flex items-center gap-3">
                <Avatar src={business.avatar ?? business.logo} name={business.name ?? business.businessName} size="md" />
                <div className="min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">
                    {business.name ?? business.businessName ?? 'Brand'}
                  </p>
                  {business._id && (
                    <Link to={`/businesses/${business._id}`} className="text-xs text-indigo-600 hover:underline">
                      View profile
                    </Link>
                  )}
                </div>
              </div>
              {isCreator && business._id && (
                <Link to={`/messages?userId=${business._id}`} className="mt-3 block">
                  <Button variant="outline" size="sm" className="w-full">
                    <MessageSquare className="h-3.5 w-3.5" /> Message
                  </Button>
                </Link>
              )}
            </div>

            {/* Budget */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</p>
              <div className="flex items-center gap-1.5">
                <IndianRupee className="h-4 w-4 text-indigo-500" />
                <span className="font-semibold text-gray-900">
                  {budget.type === 'fixed'
                    ? formatCurrency(budget.amount ?? 0, budget.currency ?? 'INR')
                    : budget.type === 'product-based'
                    ? 'Product-based'
                    : 'Negotiable'}
                </span>
              </div>
            </div>

            {/* Deadline */}
            {deadline && (
              <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4 space-y-2">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Deadline</p>
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4 text-indigo-500" />
                  <span className="text-sm font-medium text-gray-900">{formatDate(deadline)}</span>
                </div>
                <DeadlineBadge deadline={campaign.deadline} />
              </div>
            )}

            {/* Applications count */}
            <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-4">
              <p className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-1">Applications</p>
              <p className="text-2xl font-bold text-gray-900">{campaign.applicationsCount ?? 0}</p>
            </div>
          </div>
        </div>

        {/* ── Similar campaigns ─────────────────────────────────────── */}
        {similar.length > 0 && (
          <div>
            <h2 className="font-semibold text-gray-900 mb-3">Similar Campaigns</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {similar.map((c) => <CampaignCard key={c._id} campaign={c} />)}
            </div>
          </div>
        )}

        {showApplyModal && (
          <ApplyModal campaign={campaign} onClose={() => setShowApplyModal(false)} />
        )}
      </div>
    </DashboardLayout>
  );
};

export default CampaignDetailPage;
