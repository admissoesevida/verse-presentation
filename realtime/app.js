var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);

http.listen(3000, function () {
  console.log('listening on port 3000');
});

io.on("connection", function (client) {
  client.on('updateVerse', function(msg) {
    io.emit('updateVerse', msg);
  });
});