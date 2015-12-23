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
	socket.on('move', function(msg) {
		socket.broadcast.emit('move', msg);
	});
});
 
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});