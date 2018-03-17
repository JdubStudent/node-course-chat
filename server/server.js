require('./config');

const path = require('path');
const express = require('express');
const socketIO = require('socket.io');
const http = require('http');
const msg = require('./utils/message');
const {isRealString} = require('./utils/validation');
const {Users} = require('./utils/users');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

var users = new Users();


var publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

io.on('connection', (socket) => {
  console.log('User connected to socket');

  socket.on('join', (params, callback) => {
    if (!isRealString(params.name) || !isRealString(params.room)) {
      return callback('name and room must be valid');
    }
    socket.join(params.room);

    users.removeUser(socket.id);
    users.addUser(socket.id, params.name, params.room);

    socket.emit(msg.NEW, msg.generate('Admin', 'Welcome to the Chat!'));
    socket.broadcast.to(params.room).emit(msg.NEW, msg.generate('Admin', `New user ${params.name} has joined room.`));
    io.to(params.room).emit('updateUserList', users.getUserList(params.room));
    callback();
  });

  socket.on(msg.SEND, (message, callback) => {
    console.log('Received send message', message);
    var room = users.getUser(socket.id).room;
    io.to(room).emit(msg.NEW, msg.generate(message.sender, message.text));
    // socket.broadcast.emit(msg.NEW, msg.generate(message.sender, message.text));
    callback();
  });

  socket.on(msg.SENDLOC, (message, callback) => {
    console.log(message);
    var l = message.location;
    var room = users.getUser(socket.id).room;

    callback();
    io.to(room).emit(msg.NEWLOC, msg.generateLocation(message.sender, message.location));
  })

  socket.on('disconnect', () => {
    console.log('User disconnected from server');
    var rem = users.removeUser(socket.id);
    io.to(rem.room).emit(msg.NEW, msg.generate('Admin', `${rem.name} has left the chat room.`));
    io.to(rem.room).emit('updateUserList', users.getUserList(rem.room));
  });
});

server.listen(process.env.PORT, () => {
  console.log('Server started on port ' + process.env.PORT);
});
