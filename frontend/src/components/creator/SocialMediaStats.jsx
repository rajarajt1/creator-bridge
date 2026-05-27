import { ExternalLink } from 'lucide-react';
import { formatNumber } from '../../utils/helpers.js';

const PLATFORM_META = {
  instagram: { label: 'Instagram', abbr: 'IG', bg: 'bg-gradient-to-br from-purple-500 to-pink-500', countLabel: 'Followers',  engLabel: 'Eng. rate',  isPercent: true  },
  youtube:   { label: 'YouTube',   abbr: 'YT', bg: 'bg-red-600',                                    countLabel: 'Subscribers', engLabel: 'Avg views', isPercent: false },
  tiktok:    { label: 'TikTok',    abbr: 'TT', bg: 'bg-gray-900',                                   countLabel: 'Followers',  engLabel: 'Avg views', isPercent: false },
  twitter:   { label: 'Twitter/X', abbr: 'TW', bg: 'bg-sky-500',                                    countLabel: 'Followers',  engLabel: 'Eng. rate',  isPercent: true  },
  facebook:  { label: 'Facebook',  abbr: 'FB', bg: 'bg-blue-600',                                   countLabel: 'Followers',  engLabel: 'Eng. rate',  isPercent: true  },
  linkedin:  { label: 'LinkedIn',  abbr: 'LI', bg: 'bg-blue-700',                                   countLabel: 'Connections',engLabel: 'Eng. rate',  isPercent: true  },
};

const buildHref = (platform, handle) => {
  const cleanHandle = handle?.replace(/^@/, '') ?? '';
  const map = {
    instagram: `https://instagram.com/${cleanHandle}`,
    youtube:   cleanHandle.startsWith('http') ? cleanHandle : `https://youtube.com/@${cleanHandle}`,
    tiktok:    `https://tiktok.com/@${cleanHandle}`,
    twitter:   `https://x.com/${cleanHandle}`,
    facebook:  `https://facebook.com/${cleanHandle}`,
    linkedin:  `https://linkedin.com/in/${cleanHandle}`,
  };
  return map[platform] ?? '#';
};

const SocialMediaStats = ({ socialMedia = {} }) => {
  const entries = Object.entries(socialMedia).filter(
    ([, v]) => v && typeof v === 'object' && (v.followers || v.subscribers || v.username)
  );

  if (entries.length === 0) {
    return <p className="text-sm text-gray-500 italic">No social media connected yet.</p>;
  }

  return (
    <div className="space-y-2.5">
      {entries.map(([platform, data]) => {
        const meta   = PLATFORM_META[platform] ?? { label: platform, abbr: platform.slice(0, 2).toUpperCase(), bg: 'bg-gray-500', countLabel: 'Followers', engLabel: 'Engagement', isPercent: false };
        const count  = data.followers ?? data.subscribers ?? 0;
        const eng    = data.engagementRate ?? data.avgViews ?? null;
        const handle = data.username ?? data.channelId ?? data.url ?? '';
        const href   = handle ? buildHref(platform, handle) : null;

        return (
          <div
            key={platform}
            className="flex items-center gap-3 p-3 rounded-xl border border-gray-100 hover:border-indigo-100 hover:bg-indigo-50/30 transition-colors"
          >
            {/* Platform icon */}
            <span
              className={`flex h-9 w-9 items-center justify-center rounded-lg text-white text-[10px] font-bold shrink-0 ${meta.bg}`}
            >
              {meta.abbr}
            </span>

            {/* Name + handle */}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900">{meta.label}</p>
              {handle && (
                <p className="text-xs text-gray-500 truncate">@{handle.replace(/^@/, '')}</p>
              )}
            </div>

            {/* Follower count */}
            <div className="text-right shrink-0">
              <p className="text-sm font-semibold text-gray-900">{formatNumber(count)}</p>
              <p className="text-xs text-gray-400">{meta.countLabel}</p>
            </div>

            {/* Engagement */}
            {eng != null && (
              <div className="text-right shrink-0 ml-2">
                <p className="text-sm font-semibold text-indigo-600">
                  {meta.isPercent ? `${eng}%` : formatNumber(eng)}
                </p>
                <p className="text-xs text-gray-400">{meta.engLabel}</p>
              </div>
            )}

            {/* External link */}
            {href && (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="ml-1 shrink-0 text-gray-300 hover:text-indigo-600 transition-colors"
                aria-label={`Open ${meta.label}`}
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        );
      })}
    </div>
  );
};

export default SocialMediaStats;
