const { connect } = require('http2');

var express = require('express');
var app = require('express')();
var http = require('http').createServer(app);
var io = require('socket.io')(http);

app.use(express.static(__dirname + '/public'));

app.get('/socket', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});
app.get('/microphone', (req, res) => {
  res.sendFile(__dirname + '/public/microphone.html');
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