import { useState, useEffect, useRef, useCallback } from 'react';
import { Send, ArrowDown } from 'lucide-react';
import useChatStore from '../../store/chatStore.js';
import useAuthStore from '../../store/authStore.js';
import Avatar from '../ui/Avatar.jsx';
import { Spinner } from '../ui/Loader.jsx';
import MessageBubble from './MessageBubble.jsx';
import { generateConversationId } from '../../utils/helpers.js';

// ─── Typing indicator dots ────────────────────────────────────────────────────

const TypingIndicator = ({ otherUser }) => (
  <div className="flex items-end gap-2">
    <Avatar src={otherUser?.avatar} name={otherUser?.name} size="sm" className="shrink-0 mb-1" />
    <div className="flex gap-1 bg-gray-100 rounded-2xl rounded-bl-sm px-3 py-2.5">
      {[0, 150, 300].map((delay) => (
        <span
          key={delay}
          className="h-2 w-2 rounded-full bg-gray-400 animate-bounce"
          style={{ animationDelay: `${delay}ms` }}
        />
      ))}
    </div>
  </div>
);

// ─── Component ────────────────────────────────────────────────────────────────

const ChatWindow = ({
  otherUser,
  onlineUsers = [],
  onSendTypingStart,
  onSendTypingStop,
  onEmitMessage,
}) => {
  const { messages, isLoading, typingUsers, fetchMessages, sendMessage, markRead } = useChatStore();
  const currentUser = useAuthStore((s) => s.user);

  const [content,    setContent]    = useState('');
  const [page,       setPage]       = useState(1);
  const [hasMore,    setHasMore]    = useState(true);
  const [loadingMore,setLoadingMore] = useState(false);
  const [showJump,   setShowJump]   = useState(false);

  const containerRef   = useRef(null);
  const messagesEndRef = useRef(null);
  const isInitialLoad  = useRef(true);

  const conversationId = otherUser?._id && currentUser?._id
    ? generateConversationId(currentUser._id, otherUser._id)
    : null;

  const isTyping = conversationId ? typingUsers[conversationId] : false;
  const isOnline = onlineUsers.includes(otherUser?._id?.toString());

  // ── Initial load ──────────────────────────────────────────────────────────

  useEffect(() => {
    if (!otherUser?._id) return;
    isInitialLoad.current = true;
    setPage(1);
    setHasMore(true);
    fetchMessages(otherUser._id, 1).then((pagination) => {
      if (pagination && 1 >= pagination.pages) setHasMore(false);
    });
    if (conversationId) markRead(conversationId);
  }, [otherUser?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ── Scroll to bottom on new messages (only if near bottom) ───────────────

  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    const distanceFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
    const nearBottom = distanceFromBottom < 150;

    if (nearBottom || isInitialLoad.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: isInitialLoad.current ? 'auto' : 'smooth' });
      isInitialLoad.current = false;
    } else {
      setShowJump(true);
    }
  }, [messages.length, isTyping]);

  // ── Load more when scrolled to top ───────────────────────────────────────

  const handleScroll = useCallback(
    async (e) => {
      const el = e.target;
      const distFromBottom = el.scrollHeight - el.scrollTop - el.clientHeight;
      setShowJump(distFromBottom > 200);

      if (el.scrollTop === 0 && hasMore && !loadingMore) {
        const prevScrollHeight = el.scrollHeight;
        setLoadingMore(true);
        const nextPage = page + 1;
        const pagination = await fetchMessages(otherUser._id, nextPage);
        if (pagination && nextPage >= pagination.pages) setHasMore(false);
        setPage(nextPage);
        setLoadingMore(false);
        // Preserve scroll position after prepending older messages
        requestAnimationFrame(() => {
          el.scrollTop = el.scrollHeight - prevScrollHeight;
        });
      }
    },
    [hasMore, loadingMore, page, otherUser?._id, fetchMessages]
  );

  // ── Send message ─────────────────────────────────────────────────────────

  const handleSend = async (e) => {
    e?.preventDefault();
    const text = content.trim();
    if (!text || !otherUser?._id) return;

    setContent('');
    onSendTypingStop?.(conversationId);

    try {
      const msg = await sendMessage(otherUser._id, text);
      // Also emit real-time via socket for instant delivery
      if (msg && onEmitMessage) {
        onEmitMessage({ ...msg, conversationId });
      }
    } catch {
      // chatStore already handles error + rollback
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleInputChange = (e) => {
    setContent(e.target.value);
    onSendTypingStart?.(conversationId);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    setShowJump(false);
  };

  // ── Empty state ───────────────────────────────────────────────────────────

  if (!otherUser) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <p className="text-lg font-semibold text-gray-900 mb-1">Your Messages</p>
        <p className="text-sm text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full bg-white">
      {/* ── Header ────────────────────────────────────────────────────── */}
      <div className="flex items-center gap-3 px-4 py-3 border-b border-gray-200 shrink-0">
        <div className="relative">
          <Avatar
            src={otherUser.avatar}
            name={otherUser.name}
            size="md"
            showBadge={otherUser.verificationBadge}
          />
          {isOnline && (
            <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-2 ring-white" />
          )}
        </div>
        <div>
          <p className="font-semibold text-gray-900">{otherUser.name}</p>
          <p className={`text-xs ${isOnline ? 'text-green-600' : 'text-gray-400'}`}>
            {isOnline ? 'Online' : 'Offline'}
          </p>
        </div>
      </div>

      {/* ── Messages ──────────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        className="flex-1 overflow-y-auto px-4 py-4 space-y-3"
        onScroll={handleScroll}
      >
        {/* Load more spinner */}
        {loadingMore && <Spinner size="sm" className="py-2" />}

        {/* Initial loading */}
        {isLoading && messages.length === 0 && <Spinner size="sm" className="py-8" />}

        {/* No messages yet */}
        {!isLoading && messages.length === 0 && (
          <div className="flex items-center justify-center py-12">
            <p className="text-sm text-gray-400">No messages yet. Say hello! 👋</p>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble
            key={msg._id}
            message={msg}
            currentUserId={currentUser?._id}
            otherUser={otherUser}
          />
        ))}

        {/* Typing indicator */}
        {isTyping && <TypingIndicator otherUser={otherUser} />}

        <div ref={messagesEndRef} />
      </div>

      {/* Jump to bottom FAB */}
      {showJump && (
        <button
          type="button"
          onClick={scrollToBottom}
          className="absolute bottom-20 right-6 flex h-8 w-8 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
          aria-label="Scroll to latest messages"
        >
          <ArrowDown className="h-4 w-4" />
        </button>
      )}

      {/* ── Input ─────────────────────────────────────────────────────── */}
      <div className="px-4 py-3 border-t border-gray-200 shrink-0">
        <form onSubmit={handleSend} className="flex items-end gap-2">
          <textarea
            value={content}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="Type a message…"
            rows={1}
            className="flex-1 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition max-h-32"
            style={{ overflowY: content.split('\n').length > 3 ? 'auto' : 'hidden' }}
          />
          <button
            type="submit"
            disabled={!content.trim()}
            className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-indigo-600 text-white transition-colors hover:bg-indigo-700 disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Send message"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
