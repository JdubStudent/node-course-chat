var params = jQuery.deparam(window.location.search);
console.log(params);
// var username = jQuery('[name=username]');
// username.val(params.name);
var socket = io();

function scrollToBottom() {
  //selectors
  var messages = jQuery('#messages');
  var newMessage = messages.children('li:last-child');
  //heights
  var messagesHeight = messages.prop('clientHeight');
  var scrollTop = messages.prop('scrollTop');
  var scrollHeight = messages.prop('scrollHeight');
  var newMessageHeight = newMessage.innerHeight();
  var lastMessageHeight = newMessage.prev().innerHeight();

  var offsetPadding = 20;
  messagesHeight += newMessageHeight+lastMessageHeight;

  if (messagesHeight + scrollTop + offsetPadding >= scrollHeight) {
    // console.log('Should scroll messages');
    messages.scrollTop(scrollHeight);
  }
}

socket.on('connect', () => {
  console.log('Connected to server.');
  // socket.emit('sendMessage', {
  //   sender: 'Stephen',
  //   text: 'Hey bro!'
  // });
  socket.emit('join', params, function (err) {
    if (err) {
      alert(err);
      window.location.href = '/';
    }else {
      console.log('No error joining chat.');
    }
  });
});

socket.on('disconnect', () => {
  console.log('Disconnected from server.');
});

socket.on('updateUserList', function (list) {
  console.log(list);
  var ul = jQuery('<ul></ul>');

  list.forEach(function (user) {
    ul.append(jQuery('<li></li>').text(user));
  });
  jQuery('#users').html(ul);
});

socket.on('newMessage', (message) => {
  console.log('New Message', message);

  var formattedt = moment(message.sendDate).format('h:mm a');

  var template = jQuery('#message-template').html();
  if (params.name === message.sender) message.sender = 'Me';

  var html = Mustache.render(template, {
    sender: message.sender,
    sendDate: formattedt,
    text: message.text
  });

  // var li = jQuery('<li></li>');
  // li.text(`${message.sender} ${formattedt}: ${message.text}`);
  
  jQuery('#messages').append(html);
  scrollToBottom();
});

socket.on('newGeolocationMessage', (message) => {
  var formattedt = moment(message.sendDate).format('h:mm a');

  if (params.name === message.sender) message.sender = 'Me';

  var template = jQuery('#location-message-template').html();
  var html = Mustache.render(template, {
    sender: message.sender,
    sendDate: formattedt,
    url: message.url
  });

  // var li = jQuery('<li></li>');
  // var a = jQuery('<a target="_blank">My Current Location</a>');

  // li.text(`${message.sender} ${formattedt}: `);
  // a.attr('href', message.url);

  // li.append(a);
  jQuery('#messages').append(html);
  scrollToBottom();
});

jQuery('#message-form').on('submit', function (event) {
  event.preventDefault();
  var input = jQuery('[name=message]');
  var message = input.val();
  var sender = params.name;

  if (sender.trim() === '') {
    return alert('Please enter a username to join the chat!');
  }

  if (message.trim() === '') {

    return;
  }
  console.log('Sender', sender);
  socket.emit('sendMessage', {
      sender, 
      text: message
    }, function () {
      // console.log('acknowledged sent message');
      input.val('');
    });
});

var locationButton = jQuery('#send-location');

locationButton.on('click', function () {
  if (!navigator.geolocation) {
    alert('Your browser does not support geolocation!');
    return;
  }
  
  // if (params.name.trim() === '') {
  //   return alert('Please enter a username to join the chat!');
  // }

  locationButton.attr('disabled','disabled');
  locationButton.text('Sending...');

  navigator.geolocation.getCurrentPosition(function (position) {
    // console.log(position);

    socket.emit('sendGeolocationMessage',{
      sender: params.name,
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