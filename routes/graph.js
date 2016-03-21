var express = require('express');
var router = express.Router();
var fs = require('fs'),
    list;

/* GET home page. */

router.get('/', function(req, res, next) {
  fs.readFile("./public/json/"+req.query.id+".json", "utf-8", function(error, data) {
     list = data;
     list1 =  JSON.parse(list);
     res.send(list1);
     console.log(" Reading Graphs");
  });
});

module.exports = router;
