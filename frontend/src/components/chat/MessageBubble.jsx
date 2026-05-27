import Avatar from '../ui/Avatar.jsx';
import { formatRelativeTime } from '../../utils/helpers.js';

const MessageBubble = ({ message, currentUserId, otherUser }) => {
  const senderId =
    message.senderId?._id?.toString() ??
    message.senderId?.toString();

  const isSent = senderId === currentUserId?.toString();

  return (
    <div className={`flex items-end gap-2 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar for received messages */}
      {!isSent && (
        <Avatar
          src={otherUser?.avatar}
          name={otherUser?.name}
          size="sm"
          className="shrink-0 mb-1"
        />
      )}

      {/* Bubble + meta */}
      <div className={`flex flex-col gap-1 max-w-xs sm:max-w-sm ${isSent ? 'items-end' : 'items-start'}`}>
        {/* Content */}
        {message.messageType === 'image' && message.fileUrl ? (
          <img
            src={message.fileUrl}
            alt="Shared image"
            className="rounded-xl max-w-full shadow-sm"
            loading="lazy"
          />
        ) : message.messageType === 'file' && message.fileUrl ? (
          <a
            href={message.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className={`px-3 py-2 rounded-2xl text-sm underline ${
              isSent
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-indigo-600 rounded-bl-sm'
            }`}
          >
            📎 View attachment
          </a>
        ) : (
          <div
            className={[
              'px-3.5 py-2 rounded-2xl text-sm leading-relaxed whitespace-pre-wrap break-words',
              isSent
                ? 'bg-indigo-600 text-white rounded-br-sm'
                : 'bg-gray-100 text-gray-900 rounded-bl-sm',
              message.sending ? 'opacity-60' : '',
            ].join(' ')}
          >
            {message.content}
          </div>
        )}

        {/* Timestamp + read receipt */}
        <div className={`flex items-center gap-1 ${isSent ? 'flex-row-reverse' : 'flex-row'}`}>
          <span className="text-[10px] text-gray-400">
            {formatRelativeTime(message.createdAt)}
          </span>
          {isSent && !message.sending && (
            <span
              className={`text-[11px] font-medium ${message.isRead ? 'text-indigo-500' : 'text-gray-300'}`}
              title={message.isRead ? 'Read' : 'Delivered'}
            >
              {message.isRead ? '✓✓' : '✓'}
            </span>
          )}
          {message.sending && (
            <span className="text-[10px] text-gray-300 italic">sending…</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;
