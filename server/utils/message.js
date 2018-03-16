var generate = (sender, text) => {
  return {
    sender,
    text,
    sendDate: new Date().getTime()
  };
};

module.exports.generate = generate;
module.exports.NEW = 'newMessage';
module.exports.SEND = 'sendMessage';