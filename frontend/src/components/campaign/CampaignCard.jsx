import { Link } from 'react-router-dom';
import { Calendar, Users, IndianRupee, ChevronRight } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { formatDate, formatCurrency, formatNumber } from '../../utils/helpers.js';
import { NICHE_OPTIONS, BUDGET_TYPES } from '../../utils/constants.js';

const STATUS_VARIANT = {
  active:    'success',
  draft:     'default',
  paused:    'warning',
  completed: 'info',
  cancelled: 'error',
};

const PLATFORM_META = {
  instagram: { abbr: 'IG', bg: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  youtube:   { abbr: 'YT', bg: 'bg-red-600' },
  tiktok:    { abbr: 'TT', bg: 'bg-gray-900' },
  twitter:   { abbr: 'TW', bg: 'bg-sky-500' },
  facebook:  { abbr: 'FB', bg: 'bg-blue-600' },
  linkedin:  { abbr: 'LI', bg: 'bg-blue-700' },
};

const DeadlineBadge = ({ deadline }) => {
  if (!deadline) return null;
  const daysLeft = Math.ceil((new Date(deadline) - Date.now()) / 86_400_000);
  if (daysLeft < 0)  return <Badge variant="error"   size="sm">Expired</Badge>;
  if (daysLeft <= 3) return <Badge variant="error"   size="sm">Closes in {daysLeft}d</Badge>;
  if (daysLeft <= 7) return <Badge variant="warning" size="sm">Closes in {daysLeft}d</Badge>;
  return (
    <span className="flex items-center gap-1 text-xs text-gray-500">
      <Calendar className="h-3 w-3" />
      {formatDate(deadline)}
    </span>
  );
};

const CampaignCard = ({ campaign, showApplyButton = true }) => {
  if (!campaign) return null;

  const business   = campaign.businessId ?? {};
  const bizName    = business.name  ?? 'Business';
  const bizAvatar  = business.avatar ?? '';
  const platforms  = campaign.requirements?.platforms ?? [];
  const budgetType = BUDGET_TYPES.find((t) => t.value === campaign.budget?.type)?.label ?? campaign.budget?.type ?? '';
  const categoryLabel = NICHE_OPTIONS.find((n) => n.value === campaign.category)?.label ?? campaign.category ?? '';

  return (
    <Card hover className="p-5 flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2.5 min-w-0">
          <Avatar src={bizAvatar} name={bizName} size="sm" />
          <div className="min-w-0">
            <p className="text-xs text-gray-500 truncate">{bizName}</p>
            <h3 className="text-base font-semibold text-gray-900 leading-snug line-clamp-2">
              {campaign.title}
            </h3>
          </div>
        </div>
        <Badge variant={STATUS_VARIANT[campaign.status] ?? 'default'} size="sm" className="shrink-0 capitalize">
          {campaign.status}
        </Badge>
      </div>

      {/* ── Category + Platform tags ─────────────────────────────────── */}
      <div className="flex flex-wrap gap-1.5">
        {categoryLabel && <Badge variant="info" size="sm">{categoryLabel}</Badge>}
        {platforms.slice(0, 3).map((p) => {
          const meta = PLATFORM_META[p];
          return (
            <span
              key={p}
              className={`flex h-5 w-5 items-center justify-center rounded text-white text-[9px] font-bold ${meta?.bg ?? 'bg-gray-500'}`}
              title={p}
            >
              {meta?.abbr ?? p.slice(0, 2).toUpperCase()}
            </span>
          );
        })}
        {platforms.length > 3 && (
          <Badge variant="default" size="sm">+{platforms.length - 3}</Badge>
        )}
      </div>

      {/* ── Budget + Deadline ────────────────────────────────────────── */}
      <div className="flex items-center justify-between flex-wrap gap-2">
        <div className="flex items-center gap-1 text-sm font-semibold text-gray-900">
          <IndianRupee className="h-4 w-4 text-indigo-500" />
          {campaign.budget?.amount
            ? formatCurrency(campaign.budget.amount)
            : budgetType || 'Negotiable'}
        </div>
        <DeadlineBadge deadline={campaign.deadline} />
      </div>

      {/* ── Requirements summary ─────────────────────────────────────── */}
      {campaign.requirements?.minFollowers > 0 && (
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Users className="h-3 w-3" />
          Min. {formatNumber(campaign.requirements.minFollowers)} followers required
        </p>
      )}

      {/* ── Footer: apps count + CTA ─────────────────────────────────── */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-3 mt-auto gap-2">
        <p className="text-xs text-gray-500 flex items-center gap-1">
          <Users className="h-3 w-3" />
          {campaign.applicationsCount ?? 0} applicants
        </p>

        <Link to={`/campaigns/${campaign._id}`}>
          <Button variant={showApplyButton ? 'primary' : 'outline'} size="sm">
            {showApplyButton ? 'Apply Now' : 'View Details'}
            <ChevronRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </Card>
  );
};

export default CampaignCard;
