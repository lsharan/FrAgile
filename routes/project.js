var express = require('express');
var router = express.Router();
var project = require('../models/project.js');
var backLogsBugList = require('../models/backlogBuglist.js');
var fs = require('fs'),
    list;

/* GET home page. */

router.get('/', function(req, res, next) {
  //releaseId = req.query.id.replace("/","");
  projectId = req.query.id.replace("/","");
  project.findProj(projectId, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      // console.log(doc);
      // console.log("--------------------------");
      console.log(doc);
      console.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!");
      res.send(doc);
    }
  });
  // fs.readFile("./public/json/"+req.query.id.replace("/","")+".json", "utf-8", function(error, data) {
  //    list = data;
  //    list =  JSON.parse(list);
  //    res.send(list);
  //    console.log("Reading Project.json");
  // });
});

router.post('/', function(req, res, next) {
  var newProject = new project(
    {
      name : "Project 2",
      description : "project 1 is a project. What else it can be!",
      date : Date.now()
    }
  );
  newProject.save(function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      console.log("----------------Ready to creay backLogsBugList");
      var backBug = new backLogsBugList(
        {
          projectId : doc._id,
          backlogs: {
            listName: "Backlogs"
          },
          buglist: {
            listName: "BugLists"
          }
        }
      );
      backBug.save(function(err, doc) {
        if(err){
          res.send(err);
        }
        else {
          console.log("------------ Done addong backBug");
          res.send(doc);
        }
      });
    }
  });
});

router.post('/release', function(req, res, next) {
  projectId = "56ea78ea15eac2a96fedb5ee"; // TODO: get dynamic data
//  console.log(project);
  release = {
    name : "Release Name 2",
    description : "Bla bla bla Description 2",
    creationDate : Date.now(),
    releaseDate : Date.now()
  };
  project.addRelease(projectId, release, function(err, doc) {
    if(err){
      res.send(err);
    }
    else {
      res.send(doc);
    }
  });
});


module.exports = router;
