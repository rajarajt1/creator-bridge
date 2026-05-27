const Card = ({ children, className = '', hover = false, onClick }) => (
  <div
    onClick={onClick}
    role={onClick ? 'button' : undefined}
    tabIndex={onClick ? 0 : undefined}
    onKeyDown={onClick ? (e) => e.key === 'Enter' && onClick(e) : undefined}
    className={[
      'bg-white rounded-xl shadow-sm border border-gray-100',
      hover   ? 'transition-shadow hover:shadow-md' : '',
      onClick ? 'cursor-pointer' : '',
      className,
    ].join(' ')}
  >
    {children}
  </div>
);

export default Card;
