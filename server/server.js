// require('./config');

const path = require('path');
const express = require('express');

var app = express();
var publicPath = path.join(__dirname, '../public');

app.use(express.static(publicPath));

app.listen(process.env.PORT, () => {
  console.log('Server started on port ' + process.env.PORT);
});
