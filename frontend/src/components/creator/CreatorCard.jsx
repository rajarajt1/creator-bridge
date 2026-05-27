import { Link } from 'react-router-dom';
import { MapPin, TrendingUp, Star, IndianRupee } from 'lucide-react';
import Avatar from '../ui/Avatar.jsx';
import Badge from '../ui/Badge.jsx';
import Card from '../ui/Card.jsx';
import Button from '../ui/Button.jsx';
import { formatNumber } from '../../utils/helpers.js';
import { NICHE_OPTIONS } from '../../utils/constants.js';

const PLATFORM_META = {
  instagram: { abbr: 'IG', bg: 'bg-gradient-to-br from-purple-500 to-pink-500' },
  youtube:   { abbr: 'YT', bg: 'bg-red-600' },
  tiktok:    { abbr: 'TT', bg: 'bg-gray-900' },
  twitter:   { abbr: 'TW', bg: 'bg-sky-500' },
  facebook:  { abbr: 'FB', bg: 'bg-blue-600' },
  linkedin:  { abbr: 'LI', bg: 'bg-blue-700' },
};

const CreatorCard = ({ creator }) => {
  if (!creator) return null;

  const user     = creator.userId ?? creator;
  const name     = user?.name ?? 'Creator';
  const avatar   = user?.avatar ?? '';
  const verified = user?.verificationBadge ?? false;

  const niches     = creator.niche ?? [];
  const visibleN   = niches.slice(0, 3);
  const extraN     = niches.length - 3;

  const socialMedia   = creator.socialMedia ?? {};
  const platforms     = Object.entries(socialMedia)
    .filter(([, v]) => v?.followers || v?.subscribers)
    .slice(0, 4);

  const totalReach   = creator.totalReach ?? 0;
  const engagement   = creator.averageEngagement ?? 0;

  const pricing  = creator.pricing ?? {};
  const minRate  = Math.min(
    pricing.postRate  ?? Infinity,
    pricing.storyRate ?? Infinity,
    pricing.videoRate ?? Infinity,
  );

  const available = creator.availability ?? true;
  const creatorId = creator._id ?? creator.userId?._id;

  return (
    <Card hover className="p-5 flex flex-col gap-4">
      {/* ── Header ──────────────────────────────────────────────────── */}
      <div className="flex items-start gap-3">
        <Avatar src={avatar} name={name} size="lg" showBadge={verified} />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 flex-wrap">
            <h3 className="font-semibold text-gray-900 truncate">{name}</h3>
            {available ? (
              <span className="flex items-center gap-1 text-xs text-green-600 shrink-0">
                <span className="h-2 w-2 rounded-full bg-green-500" />
                Available
              </span>
            ) : (
              <Badge variant="warning" size="sm">Unavailable</Badge>
            )}
          </div>

          {creator.location && (
            <p className="flex items-center gap-1 text-xs text-gray-500 mt-0.5">
              <MapPin className="h-3 w-3 shrink-0" />
              {creator.location}
            </p>
          )}
        </div>
      </div>

      {/* ── Niche tags ───────────────────────────────────────────────── */}
      {visibleN.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {visibleN.map((n) => (
            <Badge key={n} variant="info" size="sm">
              {NICHE_OPTIONS.find((o) => o.value === n)?.label ?? n}
            </Badge>
          ))}
          {extraN > 0 && <Badge variant="default" size="sm">+{extraN} more</Badge>}
        </div>
      )}

      {/* ── Platform stats ───────────────────────────────────────────── */}
      {platforms.length > 0 && (
        <div className="flex flex-wrap gap-3">
          {platforms.map(([platform, data]) => {
            const meta  = PLATFORM_META[platform];
            const count = data.followers ?? data.subscribers ?? 0;
            return (
              <div key={platform} className="flex items-center gap-1.5">
                <span
                  className={`flex h-5 w-5 items-center justify-center rounded text-white text-[9px] font-bold shrink-0 ${meta?.bg ?? 'bg-gray-500'}`}
                >
                  {meta?.abbr ?? platform.slice(0, 2).toUpperCase()}
                </span>
                <span className="text-xs font-medium text-gray-700">{formatNumber(count)}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Metrics ──────────────────────────────────────────────────── */}
      <div className="flex items-center gap-4 border-t border-gray-100 pt-3 flex-wrap">
        <div>
          <p className="text-sm font-semibold text-gray-900">{formatNumber(totalReach)}</p>
          <p className="text-xs text-gray-500 flex items-center gap-0.5">
            <TrendingUp className="h-3 w-3" /> Total Reach
          </p>
        </div>

        {engagement > 0 && (
          <div>
            <p className="text-sm font-semibold text-gray-900">{engagement.toFixed(1)}%</p>
            <p className="text-xs text-gray-500 flex items-center gap-0.5">
              <Star className="h-3 w-3" /> Engagement
            </p>
          </div>
        )}

        {minRate < Infinity && (
          <div className="ml-auto text-right">
            <p className="text-sm font-semibold text-indigo-600 flex items-center gap-0.5">
              <IndianRupee className="h-3 w-3" /> {formatNumber(minRate)}+
            </p>
            <p className="text-xs text-gray-500">Starting rate</p>
          </div>
        )}
      </div>

      {/* ── CTA ──────────────────────────────────────────────────────── */}
      <Link to={`/creators/${creatorId}`}>
        <Button variant="outline" size="sm" className="w-full">
          View Profile
        </Button>
      </Link>
    </Card>
  );
};

export default CreatorCard;
