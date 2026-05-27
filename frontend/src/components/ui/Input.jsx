import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  className = '',
  id,
  ...rest
}, ref) => {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <div className="relative">
        {leftIcon && (
          <span className="absolute inset-y-0 left-3 flex items-center text-gray-400 pointer-events-none">
            {leftIcon}
          </span>
        )}

        <input
          ref={ref}
          id={inputId}
          className={[
            'block w-full rounded-lg border bg-white text-sm shadow-sm',
            'placeholder:text-gray-400 transition',
            'focus:outline-none focus:ring-2 focus:border-transparent',
            error
              ? 'border-red-500 focus:ring-red-500'
              : 'border-gray-300 focus:ring-indigo-500',
            leftIcon  ? 'pl-10' : 'pl-3',
            rightIcon ? 'pr-10' : 'pr-3',
            'py-2',
            className,
          ].join(' ')}
          {...rest}
        />

        {rightIcon && (
          <span className="absolute inset-y-0 right-3 flex items-center text-gray-400">
            {rightIcon}
          </span>
        )}
      </div>

      {error      && <p className="mt-1 text-xs text-red-600">{error}</p>}
      {!error && helperText && <p className="mt-1 text-xs text-gray-500">{helperText}</p>}
    </div>
  );
});

Input.displayName = 'Input';
export default Input;
