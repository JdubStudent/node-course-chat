const moment = require('moment');

var d = moment();
d.add(6, 'hour').add(33, 'minutes');
// d.add(33, 'minutes');

console.log(d.format('h:mm a'));