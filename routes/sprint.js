var express = require('express');
var router = express.Router();
var sprint = require('../models/sprint.js');
var project = require('../models/project.js');
var fs = require('fs'),
    list;

/* GET home page. */

router.get('/', function(req, res, next) {
  releaseId = req.query.id.replace("/","");
  release.findRelease(releaseId, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      // console.log(doc);
      // console.log("--------------------------");
      res.send(doc);
    }
  });
  // fs.readFile("./public/json/"+req.query.id.replace("/","")+".json", "utf-8", function(error, data) {
  //    list = data;
  //    list =  JSON.parse(list);
  //    res.send(list);
  //    console.log("Reading sprint");
  // });
});

router.post('/', function(req, res, next) {
  console.log("------------------------------1---------------------------");
  var newSprint = new sprint(
    {
      name: "new Sprint 2",
      endDate: Date.now(),
      startDate: Date.now(),
      description: "Description String 2",
          list: [
            {
              group : "inProgress",
              listName: "Picked",
              stories : []
            },
            {
              group : "inProgress",
              listName: "In progress",
              stories : []
            },
            {
              group : "inProgress",
              listName: "SSSSSSS",
              stories : []
            },
            {
              group : "inProgress",
              listName: "AAAAAA",
              stories : []
            },
            {
              group : "Releasable",
              listName: "Releasable",
              stories : []
            }
          ]
  }
  );
  newSprint.save(function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      projectId = "56ea78ea15eac2a96fedb5ee";
      releaseId = "56ea797b924ce3c56f7d2e58";
      project.addSprint(projectId, releaseId, doc, function(err, doc) {
        if(err){
          res.send(err);
        }
        else {
          res.send(doc);
        }
      });
    //  console.log(project);
      // project.updateRel(projectId, doc, function(err, doc) {
      //   if(err){
      //     res.send(err);
      //   }
      //   else {
      //     res.send(doc);
      //   }
      // });
    }
  });
});

module.exports = router;
