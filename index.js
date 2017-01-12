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
var dl = require('delivery');
var fs = require('fs');

var port = 3000;
server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Database
var database_file = 'cnline.db';
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

db.serialize(function() {
  db.run('CREATE TABLE IF NOT EXISTS users (id integer primary key, username varchar(50), password varchar(64))');
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

var download = require('./routes/download');
app.use('/download', download);

user_socket_id = {};

function create_table_name(id1, id2) {
  var table_name;
  if (id1 < id2) {
    table_name = 'r' + id1 + '_' + id2;
  } else {
    table_name = 'r' + id2 + '_' + id1;
  }

  return table_name;
}

io.on('connection', function(socket) {
  if (!socket.handshake.session.u_id) { return; }

  console.log('user ' + socket.handshake.session.u_id + ' has connected.');
  console.log('socket.id = ' + socket.id);

  user_socket_id[socket.handshake.session.u_id] = socket.id;

  socket.broadcast.emit('online', socket.handshake.session.u_id);
  for (var key in user_socket_id) {
    socket.emit('online', key);
  }

  socket.on('disconnect', function() {
    if (!socket.handshake.session.u_id) { return; }

    console.log('user ' + socket.handshake.session.u_id + ' has disconnected.');

    delete user_socket_id[socket.handshake.session.u_id];

    socket.broadcast.emit('offline', socket.handshake.session.u_id);
  });

  socket.on('open room', function(uid) {
    if (!socket.handshake.session.u_id) { return; }

    console.log('user ' + socket.handshake.session.u_id + ' open room to ' + uid + '.');

    var table_name = create_table_name(socket.handshake.session.u_id, uid);

    db.serialize(function() {
      db.run('CREATE TABLE IF NOT EXISTS ' + table_name + ' (id integer primary key, msg varchar(320))');
    });
    var query = 'SELECT msg FROM ' + table_name;
    db.serialize(function() {
      db.all(query, function(err, rows) {
        socket.emit('log response', { uid: uid, log_msg: rows })
      });
    });
  });

  socket.on('new message', function(data) {
    if (!socket.handshake.session.u_id) { return; }

    console.log('user ' + socket.handshake.session.u_id + ' new message to ' + data.to + '.');

    var to_socket_id = user_socket_id[data.to];
    if (to_socket_id) {
      socket.broadcast.to(to_socket_id).emit('broadcast msg', { sender_id: socket.handshake.session.u_id, msg: data.msg });
    }

    var table_name = create_table_name(socket.handshake.session.u_id, data.to);
    var query = 'INSERT INTO ' + table_name + ' (msg) VALUES (?)';
    db.serialize(function() {
      db.run(query, [data.msg]);
    });
  });


  // File transfer
  var delivery = dl.listen(socket);
  delivery.on('receive.success', function(file) {
    fs.writeFile('./files_temp/' + file.name, file.buffer, function(err) {
      if (err) {
        console.log('File could not be saved. - ' + file.name);
      } else {
        console.log('File saved. - ' + file.name);
      }
    });
  });

  socket.on('file sent', function(data, callback) {
    if (!socket.handshake.session.u_id) { return; }

    console.log('user ' + socket.handshake.session.u_id + ' transfer file to ' + data.to + '.');

    var to_socket_id = user_socket_id[data.to];
    if (to_socket_id) {
      socket.broadcast.to(to_socket_id).emit('file incoming', { sender_id: socket.handshake.session.u_id, filename: data.filename });

      callback({ online: true });
    } else {
      fs.unlink('./files_temp/' + data.filename);
      console.log('File deleted. - ' + data.filename);

      callback({ online: false });
    }
  });

  socket.on('file confirm', function(data) {
    if (!socket.handshake.session.u_id) { return; }

    if(data.ok) {
      console.log('user ' + socket.handshake.session.u_id + ' confirm file.');
    } else {
      console.log('user ' + socket.handshake.session.u_id + ' reject file.');

      fs.unlink('./files_temp/' + data.filename);
      console.log('File deleted. - ' + data.filename);
    }
  });
});
