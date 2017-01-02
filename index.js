var app = require('express')();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Set frontend path
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

// Routing
app.get('/login', function(req, res){
  res.render('login', { title: 'login' });
});
app.get('/register', function(req, res){
  res.render('register', { title: 'register' });
})

io.on('connection', function(){ /* … */ });
