import { BadgeCheck } from 'lucide-react';
import { getInitials } from '../../utils/helpers.js';

const SIZES = {
  sm: { wrap: 'h-8 w-8',   text: 'text-xs', badge: 'h-3.5 w-3.5 -bottom-0.5 -right-0.5' },
  md: { wrap: 'h-10 w-10', text: 'text-sm', badge: 'h-4   w-4   -bottom-0.5 -right-0.5' },
  lg: { wrap: 'h-14 w-14', text: 'text-base',badge: 'h-5   w-5   -bottom-1   -right-1'   },
  xl: { wrap: 'h-20 w-20', text: 'text-xl',  badge: 'h-6   w-6   -bottom-1   -right-1'   },
};

// Deterministic background colour from name
const PALETTE = [
  'bg-indigo-500', 'bg-purple-500', 'bg-pink-500',
  'bg-rose-500',   'bg-amber-500',  'bg-green-500',
  'bg-teal-500',   'bg-cyan-500',
];
const pickColor = (name) => PALETTE[(name?.charCodeAt(0) ?? 0) % PALETTE.length];

const Avatar = ({ src, name, size = 'md', showBadge = false, className = '' }) => {
  const s = SIZES[size] ?? SIZES.md;

  return (
    <div className={`relative inline-flex shrink-0 ${className}`}>
      {src ? (
        <img
          src={src}
          alt={name ?? 'avatar'}
          className={`${s.wrap} rounded-full object-cover ring-2 ring-white`}
        />
      ) : (
        <div
          className={`${s.wrap} ${pickColor(name)} rounded-full flex items-center justify-center text-white font-semibold ${s.text} ring-2 ring-white select-none`}
        >
          {getInitials(name)}
        </div>
      )}

      {showBadge && (
        <BadgeCheck
          className={`absolute ${s.badge} text-indigo-600 fill-white`}
          aria-label="Verified"
        />
      )}
    </div>
  );
};

export default Avatar;
