var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
  socket.emit('sendMessage', {
    sender: 'Stephen',
    text: 'Hey bro!'
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
  console.log('New Message', message);
});