var express = require('express');
var path = require('path');
var router = express.Router();

// GET method route
router.get('/', function (req, res, next) {
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

// POST method route
router.post('/', function (req, res, next) {
  if (req.body && req.body.empcd) {
    res.cookie('empcd', req.body.empcd)
  }
  if (req.body && req.body.token) {
    req.session.token = req.body.token;
    res.cookie('token', req.body.token)
  }
  res.sendFile(path.join(__dirname, '../public', 'index.html'))
});

module.exports = router;