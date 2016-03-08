var express = require('express');
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = process.env.PORT || 3000;
app.use(express.static('public'));

app.get('/', function(req, res) {
  res.sendFile(__dirname + '/public/default.html');
});

io.on('connection', function(socket) {
  io.set('transports', ['websocket']);
  console.log('new connection on socket.io');
  socket.on('move', function(mov) {
    socket.broadcast.emit('move', mov);
  });
  socket.on('chat message', function(msg, usr) {
    io.emit('chat message', {
      username: usr,
      message: msg
    });
  });
  socket.on('undo', function(und) {
    io.emit('undo', und);
  });
  socket.on('reset', function(res) {
    io.emit('reset', res);
  });
  socket.broadcast.emit('player joined');
  socket.on('disconnect', function() {
    socket.broadcast.emit('player disconnected');
  });
});

server.listen(port, function() {
  console.log('Server listening at port %d', port);
});