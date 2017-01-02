var express = require('express');
var router = express.Router();
var md5 = require('md5');

var database_file = 'cnline.db';

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

router.get('/', function(req, res) {
  req.session.destroy();
  res.render('login', { title: 'login', message: '' });
});

router.post('/', function(req, res, next) {
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
    res.render('login', { title: 'login', message: 'Wrong username or password.' });
  });
});

module.exports = router;
