var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var md5 = require('md5');

var port = 3000;
var database_file = 'cnline.db';

server.listen(port, function () {
  console.log('Server listening at port %d', port);
});

// Database
var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

db.serialize(function() {
  db.run("CREATE TABLE IF NOT EXISTS users (id integer primary key, username varchar(50), password varchar(64))");
});

// Set environment
app.use(bodyParser());
app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/public');
app.set('view engine', 'ejs');

// Routing
app.get('/login', function(req, res) {
  res.render('login', { title: 'login' });
});
app.get('/register', function(req, res) {
  res.render('register', { title: 'register', message: '' });
});
app.get('/chat', function(req, res){
  res.render('chat', { title: 'chat' });
});

app.post('/register', function(req, res, next) {
  var message = '';
  var username = req.body.username;
  var password = md5(req.body.password);
  var query = 'SELECT username, password FROM users WHERE username = ?';
  var not_exist = false;
  db.serialize(function() {
    db.all(query, username, function(err, rows) {
      if (!err) {
        if (rows.length == 0)
          not_exist = true;
      } else {
        console.log(err);
      }
    });
  });

  if (not_exist) {
    var query = 'INSERT INTO users (username, password) VALUES (?, ?)';
    db.serialize(function() {
      db.run(query, [username, password]);
    });
  } else {
    message = 'Failed: username existed!';
    res.render('register', { title: 'register', message: message });
  }
});

io.on('connection', function(){ /* … */ });
