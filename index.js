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

io.on('connection', function(socket) {
  console.log(socket.handshake.session.u_id);
});
