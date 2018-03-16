var generate = (sender, text) => {
  return {
    sender,
    text,
    sendDate: new Date().getTime()
  };
};
var generateLocation = (sender, coords) => {
  var url = `https://www.google.com/maps?q=${coords.latitude},${coords.longitude}`;
  return {
    sender,
    url,
    sendDate: new Date().getTime()
  };
};

module.exports.generate = generate;
module.exports.generateLocation = generateLocation;
module.exports.NEW = 'newMessage';
module.exports.SEND = 'sendMessage';
module.exports.NEWLOC = 'newGeolocationMessage';
module.exports.SENDLOC = 'sendGeolocationMessage';