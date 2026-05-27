import Button from './Button.jsx';

const EmptyState = ({ icon: Icon, title, description, action, className = '' }) => (
  <div className={`flex flex-col items-center justify-center py-16 px-4 text-center ${className}`}>
    {Icon && (
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-indigo-50">
        <Icon className="h-8 w-8 text-indigo-400" strokeWidth={1.5} />
      </div>
    )}

    <h3 className="text-lg font-semibold text-gray-900">{title}</h3>

    {description && (
      <p className="mt-2 text-sm text-gray-500 max-w-sm leading-relaxed">{description}</p>
    )}

    {action && (
      <div className="mt-6">
        <Button onClick={action.onClick} variant="primary" size="md">
          {action.label}
        </Button>
      </div>
    )}
  </div>
);

export default EmptyState;
