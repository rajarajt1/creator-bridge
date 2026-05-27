import { useEffect, useRef, useCallback, useState } from 'react';
import { io } from 'socket.io-client';
import { SOCKET_URL } from '../utils/constants.js';
import useChatStore from '../store/chatStore.js';
import useNotificationStore from '../store/notificationStore.js';

// ─── Module-level singleton so the socket survives re-renders ─────────────────
let socketInstance = null;

const getSocket = () => {
  if (!socketInstance) {
    socketInstance = io(SOCKET_URL, {
      autoConnect: false,
      withCredentials: true,
    });
  }
  return socketInstance;
};

// ─── Typing debounce timing (ms) ─────────────────────────────────────────────
const TYPING_DEBOUNCE_MS = 1500;

// ─────────────────────────────────────────────────────────────────────────────

const useSocket = (user) => {
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const typingTimerRef = useRef({});   // { [conversationId]: timerId }

  const addMessage          = useChatStore((s) => s.addMessage);
  const setTyping            = useChatStore((s) => s.setTyping);
  const messages             = useChatStore((s) => s.messages);
  const activeConv           = useChatStore((s) => s.activeConversation);
  const addNotification      = useNotificationStore((s) => s.addNotification);
  const incrementNotifUnread = useNotificationStore((s) => s.incrementUnread);

  useEffect(() => {
    if (!user?._id) return;

    const socket = getSocket();

    // ── Connection ────────────────────────────────────────────────────────────

    const onConnect = () => {
      setIsConnected(true);
      socket.emit('user_online', user._id);
    };

    const onDisconnect = () => setIsConnected(false);

    // ── Messaging ─────────────────────────────────────────────────────────────

    const onNewMessage = (message) => {
      addMessage(message);
      // Increment chat unread badge only when not looking at that conversation
      const isActive = message.senderId === activeConv || message.senderId?._id === activeConv;
      if (!isActive) {
        useChatStore.setState((s) => ({ unreadCount: (s.unreadCount ?? 0) + 1 }));
      }
    };

    // ── Server-side notifications (application status, etc.) ──────────────────

    const onNotification = (notification) => {
      addNotification(notification);
      incrementNotifUnread();
    };

    // ── Typing indicators ─────────────────────────────────────────────────────

    const onUserTyping = ({ userId, conversationId }) => {
      if (userId !== user._id) {
        setTyping(conversationId ?? userId, true);
      }
    };

    const onUserStopTyping = ({ userId, conversationId }) => {
      if (userId !== user._id) {
        setTyping(conversationId ?? userId, false);
      }
    };

    // ── Read receipts ─────────────────────────────────────────────────────────

    const onMessagesRead = ({ conversationId }) => {
      // Mark all messages in this conversation as read in local state
      useChatStore.setState((state) => ({
        messages: state.messages.map((m) =>
          m.conversationId === conversationId ? { ...m, isRead: true } : m
        ),
      }));
    };

    // ── Presence ──────────────────────────────────────────────────────────────

    const onOnlineUsers   = (userIds) => setOnlineUsers(userIds);
    const onUserOffline   = (userId)  => setOnlineUsers((prev) => prev.filter((id) => id !== userId));

    // ── Register listeners ────────────────────────────────────────────────────

    socket.on('connect',         onConnect);
    socket.on('disconnect',      onDisconnect);
    socket.on('new_message',     onNewMessage);
    socket.on('notification',    onNotification);
    socket.on('user_typing',     onUserTyping);
    socket.on('user_stop_typing',onUserStopTyping);
    socket.on('messages_read',   onMessagesRead);
    socket.on('online_users',    onOnlineUsers);
    socket.on('user_offline',    onUserOffline);

    if (!socket.connected) {
      socket.connect();
    } else {
      // Already connected from a previous mount — emit presence immediately
      socket.emit('user_online', user._id);
      setIsConnected(true);
    }

    return () => {
      socket.off('connect',          onConnect);
      socket.off('disconnect',       onDisconnect);
      socket.off('new_message',      onNewMessage);
      socket.off('notification',     onNotification);
      socket.off('user_typing',      onUserTyping);
      socket.off('user_stop_typing', onUserStopTyping);
      socket.off('messages_read',    onMessagesRead);
      socket.off('online_users',     onOnlineUsers);
      socket.off('user_offline',     onUserOffline);

      // Disconnect and reset singleton so the next login gets a fresh socket
      socket.disconnect();
      socketInstance = null;
    };
  }, [user?._id]); // eslint-disable-line react-hooks/exhaustive-deps

  // ─── Emitter helpers ───────────────────────────────────────────────────────

  const joinConversation = useCallback((conversationId) => {
    const socket = getSocket();
    if (socket.connected && conversationId) {
      socket.emit('join_conversation', conversationId);
    }
  }, []);

  const sendTypingStart = useCallback((conversationId) => {
    const socket = getSocket();
    if (!socket.connected || !conversationId) return;

    // Cancel any pending stop timer for this conversation
    if (typingTimerRef.current[conversationId]) {
      clearTimeout(typingTimerRef.current[conversationId]);
      delete typingTimerRef.current[conversationId];
    }

    socket.emit('typing_start', { conversationId, userId: user?._id });

    // Auto-stop after debounce period (safeguard if sendTypingStop is never called)
    typingTimerRef.current[conversationId] = setTimeout(() => {
      socket.emit('typing_stop', { conversationId, userId: user?._id });
      delete typingTimerRef.current[conversationId];
    }, TYPING_DEBOUNCE_MS);
  }, [user?._id]);

  const sendTypingStop = useCallback((conversationId) => {
    const socket = getSocket();
    if (!socket.connected || !conversationId) return;

    if (typingTimerRef.current[conversationId]) {
      clearTimeout(typingTimerRef.current[conversationId]);
      delete typingTimerRef.current[conversationId];
    }

    socket.emit('typing_stop', { conversationId, userId: user?._id });
  }, [user?._id]);

  const emitMessage = useCallback((data) => {
    const socket = getSocket();
    if (socket.connected) {
      socket.emit('send_message', data);
    }
  }, []);

  return {
    socket: socketInstance,
    isConnected,
    onlineUsers,
    joinConversation,
    sendTypingStart,
    sendTypingStop,
    emitMessage,
  };
};

export default useSocket;
