const variants = {
  default: 'bg-gray-100 text-gray-700',
  success: 'bg-green-100 text-green-700',
  warning: 'bg-amber-100 text-amber-700',
  error:   'bg-red-100   text-red-700',
  info:    'bg-indigo-100 text-indigo-700',
};

const sizes = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1 text-sm',
};

const Badge = ({ variant = 'default', size = 'md', children, className = '' }) => (
  <span
    className={[
      'inline-flex items-center gap-1 rounded-full font-medium',
      variants[variant] ?? variants.default,
      sizes[size]    ?? sizes.md,
      className,
    ].join(' ')}
  >
    {children}
  </span>
);

export default Badge;
