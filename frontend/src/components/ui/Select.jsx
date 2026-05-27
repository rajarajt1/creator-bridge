import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  options = [],
  error,
  placeholder = 'Select an option',
  className = '',
  id,
  ...rest
}, ref) => {
  const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

  return (
    <div className="w-full">
      {label && (
        <label htmlFor={selectId} className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
      )}

      <select
        ref={ref}
        id={selectId}
        className={[
          'block w-full rounded-lg border bg-white px-3 py-2 text-sm shadow-sm transition',
          'focus:outline-none focus:ring-2 focus:border-transparent',
          error
            ? 'border-red-500 focus:ring-red-500'
            : 'border-gray-300 focus:ring-indigo-500',
          className,
        ].join(' ')}
        {...rest}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>

      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
});

Select.displayName = 'Select';
export default Select;
