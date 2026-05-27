import Avatar from '../ui/Avatar.jsx';
import { formatRelativeTime, truncateText } from '../../utils/helpers.js';

const ConversationList = ({
  conversations = [],
  activeConversation,
  onlineUsers = [],
  onSelect,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="space-y-1 p-2">
        {Array.from({ length: 5 }, (_, i) => (
          <div key={i} className="flex items-center gap-3 px-3 py-3 rounded-xl animate-pulse">
            <div className="h-10 w-10 rounded-full bg-gray-200 shrink-0" />
            <div className="flex-1 space-y-1.5">
              <div className="h-3.5 bg-gray-200 rounded w-1/2" />
              <div className="h-3 bg-gray-200 rounded w-3/4" />
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
        <p className="text-sm text-gray-500">No conversations yet.</p>
        <p className="text-xs text-gray-400 mt-1">Start messaging a creator or business.</p>
      </div>
    );
  }

  return (
    <ul className="space-y-0.5 p-2">
      {conversations.map((conv) => {
        const other     = conv.participant ?? {};
        const otherId   = other._id?.toString();
        const isActive  = activeConversation === otherId;
        const isOnline  = onlineUsers.includes(otherId);
        const lastMsg   = conv.lastMessage;
        const unread    = conv.unreadCount ?? 0;

        return (
          <li key={conv.conversationId}>
            <button
              type="button"
              onClick={() => onSelect?.(other)}
              className={[
                'flex items-center gap-3 w-full px-3 py-3 rounded-xl text-left transition-colors',
                isActive
                  ? 'bg-indigo-50 border border-indigo-100'
                  : 'hover:bg-gray-50 border border-transparent',
              ].join(' ')}
            >
              {/* Avatar + online dot */}
              <div className="relative shrink-0">
                <Avatar
                  src={other.avatar}
                  name={other.name}
                  size="md"
                  showBadge={other.isVerified}
                />
                {isOnline && (
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
                )}
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-1">
                  <p className={`text-sm truncate ${unread > 0 ? 'font-semibold text-gray-900' : 'font-medium text-gray-700'}`}>
                    {other.name ?? 'Unknown'}
                  </p>
                  {lastMsg?.createdAt && (
                    <span className="text-[10px] text-gray-400 shrink-0">
                      {formatRelativeTime(lastMsg.createdAt)}
                    </span>
                  )}
                </div>

                <div className="flex items-center justify-between gap-1 mt-0.5">
                  <p className={`text-xs truncate ${unread > 0 ? 'text-gray-700' : 'text-gray-400'}`}>
                    {lastMsg?.content
                      ? truncateText(lastMsg.content, 45)
                      : <span className="italic">No messages yet</span>}
                  </p>
                  {unread > 0 && (
                    <span className="flex h-4.5 min-w-[18px] items-center justify-center rounded-full bg-indigo-600 px-1 text-[10px] font-bold text-white shrink-0">
                      {unread > 99 ? '99+' : unread}
                    </span>
                  )}
                </div>
              </div>
            </button>
          </li>
        );
      })}
    </ul>
  );
};

export default ConversationList;
