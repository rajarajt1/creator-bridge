import { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useChatStore from '../../store/chatStore.js';
import useAuthStore from '../../store/authStore.js';
import useSocket from '../../hooks/useSocket.js';
import DashboardLayout from '../../components/layout/DashboardLayout.jsx';
import ConversationList from '../../components/chat/ConversationList.jsx';
import ChatWindow from '../../components/chat/ChatWindow.jsx';
import { MessageSquare } from 'lucide-react';

const MessagesPage = () => {
  const location  = useLocation();
  const navigate  = useNavigate();
  const user      = useAuthStore((s) => s.user);

  const {
    conversations,
    activeConversation,
    setActiveConversation,
    fetchConversations,
    isLoading,
  } = useChatStore();

  const {
    socket,
    isConnected,
    onlineUsers,
    joinConversation,
    sendTypingStart,
    sendTypingStop,
    emitMessage,
  } = useSocket();

  const [otherUser, setOtherUser] = useState(null);
  const [showChat,  setShowChat]  = useState(false); // mobile: toggle panel

  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle ?userId= query param (direct link from profile/campaign)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const userId = params.get('userId');
    if (userId && conversations.length > 0) {
      const conv = conversations.find(
        (c) => c.participant?._id?.toString() === userId
      );
      if (conv) {
        handleSelectConversation(conv.participant);
      }
    }
  }, [location.search, conversations]);

  const handleSelectConversation = (other) => {
    setOtherUser(other);
    setActiveConversation(other._id?.toString());
    setShowChat(true);
  };

  const handleBack = () => {
    setShowChat(false);
    setOtherUser(null);
    setActiveConversation(null);
  };

  return (
    <DashboardLayout>
      <div className="flex h-[calc(100vh-64px)] overflow-hidden">

        {/* ── Conversation list panel ─────────────────────────────────── */}
        <div
          className={[
            'w-full sm:w-80 lg:w-96 border-r border-gray-200 bg-white flex flex-col',
            showChat ? 'hidden sm:flex' : 'flex',
          ].join(' ')}
        >
          <div className="px-4 py-3 border-b border-gray-100 shrink-0">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-indigo-600" />
              <h1 className="font-semibold text-gray-900">Messages</h1>
              {!isConnected && (
                <span className="text-xs text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                  Connecting…
                </span>
              )}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto">
            <ConversationList
              conversations={conversations}
              activeConversation={activeConversation}
              onlineUsers={onlineUsers}
              onSelect={handleSelectConversation}
              isLoading={isLoading}
            />
          </div>
        </div>

        {/* ── Chat window panel ───────────────────────────────────────── */}
        <div
          className={[
            'flex-1 flex flex-col',
            showChat ? 'flex' : 'hidden sm:flex',
          ].join(' ')}
        >
          {/* Mobile back button */}
          {showChat && (
            <button
              onClick={handleBack}
              className="sm:hidden flex items-center gap-2 px-4 py-2.5 border-b border-gray-100 text-sm text-gray-600 hover:bg-gray-50"
            >
              ← Back to conversations
            </button>
          )}

          <div className="flex-1 overflow-hidden relative">
            <ChatWindow
              otherUser={otherUser}
              onlineUsers={onlineUsers}
              onSendTypingStart={sendTypingStart}
              onSendTypingStop={sendTypingStop}
              onEmitMessage={emitMessage}
            />
          </div>
        </div>

      </div>
    </DashboardLayout>
  );
};

export default MessagesPage;
