import { useNavigate } from 'react-router-dom';
import {
  FileText,
  CheckCircle,
  XCircle,
  MessageSquare,
  Megaphone,
  BadgeCheck,
  Bell,
} from 'lucide-react';
import { formatRelativeTime } from '../../utils/helpers.js';

// ─── Type → icon / colour mapping ────────────────────────────────────────────

const TYPE_META = {
  application_received: {
    icon: FileText,
    bg:   'bg-indigo-100',
    color:'text-indigo-600',
    path: (id) => `/campaigns/${id}`,
  },
  application_accepted: {
    icon: CheckCircle,
    bg:   'bg-green-100',
    color:'text-green-600',
    path: (id) => `/applications`,
  },
  application_rejected: {
    icon: XCircle,
    bg:   'bg-red-100',
    color:'text-red-600',
    path: () => `/applications`,
  },
  new_message: {
    icon: MessageSquare,
    bg:   'bg-blue-100',
    color:'text-blue-600',
    path: (id) => `/messages`,
  },
  campaign_update: {
    icon: Megaphone,
    bg:   'bg-amber-100',
    color:'text-amber-600',
    path: (id) => `/campaigns/${id}`,
  },
  profile_verified: {
    icon: BadgeCheck,
    bg:   'bg-purple-100',
    color:'text-purple-600',
    path: () => `/profile`,
  },
};

const NotificationItem = ({ notification, onMarkRead }) => {
  const navigate  = useNavigate();
  const meta      = TYPE_META[notification?.type] ?? {
    icon:  Bell,
    bg:    'bg-gray-100',
    color: 'text-gray-500',
    path:  () => '/',
  };
  const Icon = meta.icon;

  const handleClick = () => {
    if (!notification.isRead) {
      onMarkRead?.(notification._id);
    }
    const path = meta.path(notification.relatedId);
    if (path) navigate(path);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      className={[
        'flex items-start gap-3 w-full px-4 py-3 text-left transition-colors hover:bg-gray-50',
        notification.isRead ? 'opacity-70' : '',
      ].join(' ')}
    >
      {/* Icon */}
      <span
        className={`mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-full ${meta.bg}`}
      >
        <Icon className={`h-4.5 w-4.5 ${meta.color}`} />
      </span>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p
          className={`text-sm leading-snug ${
            notification.isRead ? 'text-gray-600' : 'font-semibold text-gray-900'
          }`}
        >
          {notification.title}
        </p>

        {notification.message && (
          <p className="mt-0.5 text-xs text-gray-500 line-clamp-2">{notification.message}</p>
        )}

        <p className="mt-1 text-[10px] text-gray-400">
          {formatRelativeTime(notification.createdAt)}
        </p>
      </div>

      {/* Unread dot */}
      {!notification.isRead && (
        <span className="mt-2 h-2 w-2 shrink-0 rounded-full bg-indigo-600" aria-label="Unread" />
      )}
    </button>
  );
};

export default NotificationItem;
