var express = require('express');
var axios = require('axios');
const db = require('../api/config/db')
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res, next) {
    console.log("============== API Call ======================");
//   res.send('respond with a resource');
    let sql = req.query.sql;
    console.log("sql:"+ sql);

    axios.get(db.DB_URL + '?q=' + sql).then(x => x.data).then(reault => res.send(reault))
});

router.get('/:sql', function (req, res, next) {
    var sql = req.params.sql;
    console.log("========Test 쇼===========");
    console.log("sql:"+ decodeURIComponent(sql));
    axios.get(db.DB_URL + '?q=' + sql).then(x => x.data).then(reault => res.send(reault))
  });

module.exports = router;
