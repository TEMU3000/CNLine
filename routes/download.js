var express = require('express');
var router = express.Router();
var fs = require('fs');

router.get('/', function(req, res) {
  var file = './files_temp/' + req.query.filename;
  res.download(file, function(err) {
    fs.unlink('./files_temp/' + req.query.filename);
    console.log('File deleted. - ' + req.query.filename);
  });
});

module.exports = router;
