// chat-server/index.js

const express = require('express');
const http    = require('http');
const { Server } = require('socket.io');

const app    = express();
const server = http.createServer(app);

// 1) Enable CORS so any client can connect
const io = new Server(server, {
  cors: {
    origin: '*'
  }
});

io.on('connection', socket => {
  // 2) Assign a guest ID
  const guestId = 'Guest_' + Math.floor(Math.random() * 1000);

  // 3) Tell the new client their ID
  socket.emit('welcome', { id: guestId });

  // 4) Broadcast join notice to everyone
  io.emit('chat', {
    nick: 'System',
    text: `${guestId} joined the chat.`,
    ts: Date.now()
  });

  // 5) Relay incoming chat messages
  socket.on('chat', msg => {
    io.emit('chat', { ...msg, ts: Date.now() });
  });

  // 6) Broadcast leave notice on disconnect
  socket.on('disconnect', () => {
    io.emit('chat', {
      nick: 'System',
      text: `${guestId} left the chat.`,
      ts: Date.now()
    });
  });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`🚀 Chat server listening on http://localhost:${PORT}`);
});
