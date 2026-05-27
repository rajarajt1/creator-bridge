function Input({ label, name, type = 'text', value, onChange, error, placeholder, required, minLength }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
      {label && (
        <label htmlFor={name} style={{ fontSize: '0.875rem', fontWeight: '500' }}>
          {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        minLength={minLength}
        style={{
          padding: '0.5rem 0.75rem',
          border: `1px solid ${error ? '#ef4444' : '#d1d5db'}`,
          borderRadius: '0.375rem',
          fontSize: '1rem',
          outline: 'none',
        }}
      />
      {error && <span style={{ color: '#ef4444', fontSize: '0.75rem' }}>{error}</span>}
    </div>
  );
}

export default Input;
