var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

app.get('/', function(req, res){
  res.sendFile(__dirname + '/public/login.html');
});

io.on('connection', function(){ /* … */ });
