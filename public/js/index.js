var socket = io();

socket.on('connect', () => {
  console.log('Connected to server');
  // socket.emit('sendMessage', {
  //   sender: 'Stephen',
  //   text: 'Hey bro!'
  // });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server');
});

socket.on('newMessage', (message) => {
  console.log('New Message', message);

  var li = jQuery('<li></li>');
  li.text(`${message.sender}: ${message.text}`);
  
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (event) {
  event.preventDefault();
  socket.emit('sendMessage', {
      sender: jQuery('[name=username]').val(), 
      text: jQuery('[name=message]').val()
    }, function () {
      console.log('acknowledged sent message');
    });
});