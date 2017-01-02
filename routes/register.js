var express = require('express');
var router = express.Router();
var md5 = require('md5');

var database_file = 'cnline.db';

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

router.get('/', function(req, res) {
  res.render('register', { title: 'register', message: '' });
});

router.post('/', function(req, res, next) {
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

module.exports = router;
