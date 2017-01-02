var express = require('express');
var router = express.Router();

var database_file = 'cnline.db';

var sqlite3 = require("sqlite3").verbose();
var db = new sqlite3.Database(database_file);

router.get('/', function(req, res){
  if (req.session.u_id) {
    var query = 'SELECT username FROM users';
    db.serialize(function() {
      db.all(query, function(err, rows) {
        res.render('chat', { title: 'chat', userlist: rows });
      });
    });
  } else {
    res.redirect('login');
  }
});

module.exports = router;
