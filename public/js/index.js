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

socket.on('newGeolocationMessage', (message) => {
  var li = jQuery('<li></li>');
  var a = jQuery('<a target="_blank">My Current Location</a>');
  li.text(`${message.sender}: `);
  a.attr('href', message.url);

  li.append(a);
  jQuery('#messages').append(li);
});

jQuery('#message-form').on('submit', function (event) {
  event.preventDefault();
  var input = jQuery('[name=message]');

  socket.emit('sendMessage', {
      sender: jQuery('[name=username]').val(), 
      text: input.val()
    }, function () {
      console.log('acknowledged sent message');
      input.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    alert('Your browser does not support geolocation!');
    return;
  }

  var uname = jQuery('[name=username]').val();

  locationButton.attr('disabled','disabled');
  locationButton.text('Sending...');

  navigator.geolocation.getCurrentPosition(function (position) {
    console.log(position);

    socket.emit('sendGeolocationMessage',{
      sender: uname,
      location: {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude
      }
    }, function () {
      locationButton.removeAttr('disabled');
      locationButton.text('Send Location');
    });
  }, function (error) {
    alert('Failed to fetch your location');
    locationButton.text('Send Location');
    locationButton.removeAttr('disabled');
  })
});