var express = require('express')
var app = express();
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var port = 3000;

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Database
//var connection = require('./mysql_connection');

// Set frontend path
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

// Routing
app.get('/login', function(req, res) {
  res.render('login', { title: 'login' });
});
app.get('/register', function(req, res) {
  res.render('register', { title: 'register' });
});
app.get('/chat', function(req, res){
  res.render('chat', { title: 'chat' });
});

app.post('/register', function(req, res, next) {
  var username = req.body.username;
  var password = req.body.password;
  var query = 'INSERT INTO users (username, password) VALUES ("' + username + '", ' + '"' + password + '")';
  connection.query(query, function(error, rows, fields) {
  });
});

io.on('connection', function(){ /* … */ });
