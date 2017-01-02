var express = require('express')
var app = express();
var bodyParser = require('body-parser');
var server = require('http').createServer(app);
var io = require('socket.io')(server);
var session = require('express-session');
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
app.use(session({
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true
}));

// Routing
app.get('/login', function(req, res) {
  req.session.destroy();
  res.render('login', { title: 'login', message: '' });
});
app.get('/register', function(req, res) {
  res.render('register', { title: 'register', message: '' });
});
app.get('/chat', function(req, res){
  if (req.session.u_id)
    res.render('chat', { title: 'chat' });
  else
    res.redirect('login');
});

app.post('/login', function(req, res, next) {
  var message = '';
  var username = req.body.username;
  var password = md5(req.body.password);
  var query = 'SELECT id, username, password FROM users WHERE username = ?';
  db.serialize(function() {
    db.each(query, username, function(err, row) {
      if (!err) {
        if (password == row.password) {
          req.session.u_id = row.id;
          res.redirect('chat');
        } else {
          res.render('login', { title: 'login', message: 'Wrong username or password.' });
        }
      } else {
        console.log(err);
      }
    });
  });
});
app.post('/register', function(req, res, next) {
  var message = '';
  var username = req.body.username;
  var password = md5(req.body.password);
  var query = 'SELECT username FROM users WHERE username = ?';
  db.serialize(function() {
    db.all(query, username, function(err, rows) {
      if (!err) {
        if (rows.length == 0) {
          not_exist = true;
          var query = 'INSERT INTO users (username, password) VALUES (?, ?)';
          db.serialize(function() {
            db.run(query, [username, password]);
          });
          res.render('login', { title: 'login', message: 'Registed.' });
        } else {
          res.render('register', { title: 'register', message: 'Failed: username existed!' });
        }
      } else {
        console.log(err);
      }
    });
  });
});

io.on('connection', function(){ /* … */ });
