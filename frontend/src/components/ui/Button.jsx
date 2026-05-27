import { Loader2 } from 'lucide-react';

const variants = {
  primary:   'bg-indigo-600 hover:bg-indigo-700 text-white focus:ring-indigo-500',
  secondary: 'bg-amber-500 hover:bg-amber-600 text-white focus:ring-amber-400',
  outline:   'border-2 border-indigo-600 text-indigo-600 hover:bg-indigo-50 bg-transparent focus:ring-indigo-500',
  ghost:     'text-gray-600 hover:bg-gray-100 bg-transparent focus:ring-gray-400',
  danger:    'bg-red-600 hover:bg-red-700 text-white focus:ring-red-500',
};

const sizes = {
  sm: 'px-3 py-1.5 text-xs',
  md: 'px-4 py-2 text-sm',
  lg: 'px-6 py-3 text-base',
};

const Button = ({
  variant = 'primary',
  size = 'md',
  isLoading = false,
  disabled = false,
  children,
  className = '',
  ...rest
}) => (
  <button
    disabled={disabled || isLoading}
    className={[
      'inline-flex items-center justify-center gap-2 rounded-lg font-medium',
      'transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2',
      'disabled:opacity-60 disabled:cursor-not-allowed',
      variants[variant] ?? variants.primary,
      sizes[size] ?? sizes.md,
      className,
    ].join(' ')}
    {...rest}
  >
    {isLoading && <Loader2 className="h-4 w-4 animate-spin shrink-0" />}
    {children}
  </button>
);

export default Button;
