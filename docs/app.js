// 1) Connect to your Heroku server
const socket = io('https://lucky-chat-server-904002951871.herokuapp.com', {
    transports: ['websocket','polling']
  });
  
  // 2) UI elements
  const chatEl     = document.getElementById('chat');
  const nickInput  = document.getElementById('nick-input');
  const setNickBtn = document.getElementById('set-nick');
  const msgInput   = document.getElementById('msg-input');
  const sendBtn    = document.getElementById('send-btn');
  
  let nickname;
  
  // 3) Utility to append & scroll
  function appendLine(text) {
    const div = document.createElement('div');
    div.textContent = text;
    chatEl.appendChild(div);
    chatEl.scrollTop = chatEl.scrollHeight;
  }
  
  // 4) Welcome from server
  socket.on('welcome', ({ id }) => {
    nickname = id;
    appendLine(`🤖 You are: ${nickname}`);
  });
  
  // 5) Show join/leave/chat
  socket.on('chat', ({ nick, text, ts }) => {
    const time = new Date(ts).toLocaleTimeString();
    appendLine(`[${time}] ${nick}: ${text}`);
  });
  
  // 6) Error/success logging
  socket.on('connect', () => console.log('✅ Connected (mobile)!'));
  socket.on('connect_error', err => console.error('❌ Connect error', err));
  
  // 7) Send a message
  sendBtn.onclick = () => {
    const text = msgInput.value.trim();
    if (!text) return;
    socket.emit('chat', { nick: nickname, text });
    msgInput.value = '';
  };
  
  // 8) Set a one-time nickname
  setNickBtn.onclick = () => {
    const newNick = nickInput.value.trim();
    if (newNick) {
      const old = nickname;
      nickname = newNick;
      appendLine(`✅ Your name is now: ${nickname}`);
      socket.emit('chat', { nick: 'System', text: `${old} → ${nickname}` });
    }
    nickInput.disabled = setNickBtn.disabled = true;
    nickInput.value = '';
  };
  