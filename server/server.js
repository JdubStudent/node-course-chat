require('./config');

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const msg = require('./utils/message');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);


var publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('User connected to socket');

  socket.emit(msg.NEW, msg.generate('Admin', 'Welcome to the Chat!'));
  socket.broadcast.emit(msg.NEW, msg.generate('Admin', 'New user joined chat'));

  socket.on(msg.SEND, (message, callback) => {
    console.log('Received send message', message);
    io.emit(msg.NEW, msg.generate(message.sender, message.text));
    // socket.broadcast.emit(msg.NEW, msg.generate(message.sender, message.text));
    callback();
  });

  socket.on(msg.SENDLOC, (message, callback) => {
    console.log(message);
    var l = message.location;
    callback();
    io.emit(msg.NEWLOC, msg.generateLocation(message.sender, message.location));
  })

  socket.on('disconnect', () => {
    console.log('User disconnected from server');
  });
});

server.listen(process.env.PORT, () => {
  console.log('Server started on port ' + process.env.PORT);
});
