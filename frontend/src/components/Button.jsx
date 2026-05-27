function Button({ children, variant = 'primary', disabled = false, type = 'button', onClick }) {
  const styles = {
    primary: { backgroundColor: '#4f46e5', color: '#fff' },
    secondary: { backgroundColor: '#e5e7eb', color: '#111827' },
    danger: { backgroundColor: '#ef4444', color: '#fff' },
  };

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      style={{
        padding: '0.5rem 1.25rem',
        borderRadius: '0.375rem',
        border: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
        opacity: disabled ? 0.6 : 1,
        fontWeight: '500',
        ...styles[variant],
      }}
    >
      {children}
    </button>
  );
}

export default Button;
