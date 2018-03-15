require('./config');

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


var publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('User connected to socket');

  // socket.emit('newMessage', {
  //   sender: 'Jdub',
  //   text: 'Whats UP?',
  //   sentDate: new Date().getTime()
  // });

  socket.on('sendMessage', (message) => {
    console.log('Received send message', message);
    io.emit('newMessage', {
      sender: message.sender,
      text: message.text,
      sentDate: new Date().getTime()
    });
  });

  socket.on('disconnect', () => {
    console.log('User disconnected from server');
  });
});

server.listen(process.env.PORT, () => {
  console.log('Server started on port ' + process.env.PORT);
});
