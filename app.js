const { connect } = require('http2');

var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

let connectCount = 0;

io.on('connection', (socket) => {
  connectCount++;
  socket.emit('status', {status: 'connected', connectCount: connectCount} );
  console.log('a user connected');
  socket.broadcast.emit('a user connected', connectCount);
  socket.on('disconnect', () => {
    connectCount--;
    io.sockets.emit('user disconnected', connectCount);
    console.log('user disconnected');
  });
  socket.on('chat message', (msg) => {
    console.log('message: ' + msg);
    socket.broadcast.emit('chat message', msg);
    });
});

http.listen(3000, () => {
  console.log('listening on *:3000');
});