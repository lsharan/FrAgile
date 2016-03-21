var express = require('express');
var router = express.Router();
var path = require('path');
var fs = require('fs');

/* GET home page. */

router.get('/', function(req, res, next) {
  console.log('In');
  fs.readFile('./public/json/activities.json', 'utf8', function(err, data) {
 if (err)
   res.send(err);
 else {
   var data = JSON.parse(data)
   var actions = data.actions;

   var filtered = actions.filter(function(element) {
     if (req.query.cardID)
       return (req.query.cardID == element.links.cardID)
     else
       return true;
   })
   res.send(filtered);
 }
});
});

module.exports = router;
