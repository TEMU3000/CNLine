var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require('express-session')({
  secret: 'keyboard cat',
  resave: true,
  saveUninitialized: true
});
var sharedsession = require('express-socket.io-session');

var port = 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Database
var database_file = 'cnline.db';
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (id integer primary key, username varchar(50), password varchar(64))");
});

// Set environment
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');
app.use(session);
io.use(sharedsession(session));

// Routing
var login = require('./routes/login');
app.use('/login', login);

var register = require('./routes/register');
app.use('/register', register);

var chat = require('./routes/chat');
app.use('/chat', chat);

user_connected = {};
user_socket_id = {};

io.on('connection', function(socket) {
  if (socket.handshake.session.u_id) {
    console.log('user ' + socket.handshake.session.u_id + ' has connected.');
    console.log('socket.id = ' + socket.id);
    user_connected[socket.handshake.session.u_id] = true;
    user_socket_id[socket.handshake.session.u_id] = socket.id;

    socket.broadcast.emit('online', socket.handshake.session.u_id);
    for (var key in user_connected) {
      socket.emit('online', key);
    }
  }

  socket.on('disconnect', function() {
    if (socket.handshake.session.u_id) {
      console.log('user ' + socket.handshake.session.u_id + ' has disconnected.');
      delete user_connected[socket.handshake.session.u_id];
      delete user_socket_id[socket.handshake.session.u_id];

      socket.broadcast.emit('offline', socket.handshake.session.u_id);
    }
  });

  socket.on('new message', function(data) {
    var to_socket_id = user_socket_id[data['to']];
    if (to_socket_id) {
      socket.broadcast.to(to_socket_id).emit('broadcast msg', { sender_id: socket.handshake.session.u_id, msg: data['msg'] });
    }
  });
});
