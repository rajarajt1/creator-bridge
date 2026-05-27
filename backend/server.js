import 'dotenv/config';
import http from 'http';
import { Server } from 'socket.io';
import app from './src/app.js';
import connectDB from './src/config/db.js';

const PORT = process.env.PORT || 5000;

// ─── HTTP server ──────────────────────────────────────────────────────────────

const server = http.createServer(app);

// ─── Socket.io ────────────────────────────────────────────────────────────────

const io = new Server(server, {
  cors: {
    origin: process.env.CLIENT_URL,
    credentials: true,
  },
});

// userId (string) → socketId (string)
const onlineUsers = new Map();

io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  // ── Presence ──────────────────────────────────────────────────────────────

  // Client emits this immediately after connecting, passing its userId
  socket.on('user_online', (userId) => {
    if (!userId) return;
    onlineUsers.set(String(userId), socket.id);
    // Broadcast updated online-user list to all clients
    io.emit('online_users', Array.from(onlineUsers.keys()));
    console.log(`🟢 User ${userId} is online (socket ${socket.id})`);
  });

  // ── Conversations ─────────────────────────────────────────────────────────

  // Join a conversation room so room-scoped events work
  socket.on('join_conversation', (conversationId) => {
    if (!conversationId) return;
    socket.join(conversationId);
  });

  // ── Messaging ─────────────────────────────────────────────────────────────

  // Real-time message relay
  // data: { conversationId, receiverId, content, senderId, messageId? }
  socket.on('send_message', (data) => {
    if (!data?.receiverId || !data?.content) return;

    const receiverSocketId = onlineUsers.get(String(data.receiverId));
    if (receiverSocketId) {
      io.to(receiverSocketId).emit('new_message', data);
    }

    // Delivery confirmation back to sender
    socket.emit('message_delivered', { messageId: data.messageId ?? null });
  });

  // ── Typing indicators ─────────────────────────────────────────────────────

  // data: { conversationId, userId }
  socket.on('typing_start', (data) => {
    if (!data?.conversationId) return;
    socket.to(data.conversationId).emit('user_typing', { userId: data.userId });
  });

  socket.on('typing_stop', (data) => {
    if (!data?.conversationId) return;
    socket.to(data.conversationId).emit('user_stop_typing', { userId: data.userId });
  });

  // ── Read receipts ─────────────────────────────────────────────────────────

  // data: { conversationId, userId }
  socket.on('mark_read', (data) => {
    if (!data?.conversationId) return;
    socket.to(data.conversationId).emit('messages_read', data);
  });

  // ── Disconnect ────────────────────────────────────────────────────────────

  socket.on('disconnect', () => {
    for (const [userId, socketId] of onlineUsers.entries()) {
      if (socketId === socket.id) {
        onlineUsers.delete(userId);
        io.emit('user_offline', userId);
        console.log(`🔴 User ${userId} disconnected (socket ${socket.id})`);
        break;
      }
    }
    console.log(`🔌 Client disconnected: ${socket.id}`);
  });
});

// ─── Exports (used by controllers to emit events & check presence) ────────────

export { io, onlineUsers };

// Keep legacy alias so existing controller imports of `userSocketMap` still work
export { onlineUsers as userSocketMap };

// ─── Start ────────────────────────────────────────────────────────────────────

connectDB().then(() => {
  server.listen(PORT, () => {
    console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
  });
});
