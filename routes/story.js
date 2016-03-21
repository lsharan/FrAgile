var express = require('express');
var router = express.Router();
var story = require('../models/story.js');
var sprint = require('../models/sprint.js');
var backlogsBuglist = require('../models/backlogBuglist.js');
var fs = require('fs'),
    list;

/* GET home page. */

router.get('/', function(req, res, next) {
  fs.readFile("./public/json/"+req.query.id.replace("/","")+".json", "utf-8", function(error, data) {
     list = data;
     list =  JSON.parse(list);
     res.send(list);
     console.log("Reading Story");
  });
});
router.post('/delete', function(req, res, next){
  projectId = "56ea78ea15eac2a96fedb5ee";
  sprintId = "56ea89de1d4b0a2572f25b9c";
  listId = "56ea89de1d4b0a2572f25ba0";
  storyId = "56eba38bf44831487912cbd5";
  //res.send(deleteFromSprint(sprintId, listId, storyId));
  //res.send(deleteFromBacklog(projectId, storyId));
  story.deleteStory(storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      res.send(deleteFromSprint(sprintId, listId, storyId));
      return(doc);
    }
  });
});

router.post('/', function(req, res, next){
//TODO: Need to get dynamic data
   var newStory=new story(
     {
       listId:"backlog",
       //storyCreatorId: {type:Schema.Types.ObjectId,ref:'User'},
       storyStatus:"Completed",
       heading: "This story has been created for a story testing purpose",
       description: "This was the description given by the scrum master for the story during story creation",
       descriptionStatus: true,
       timeStamp: Date.now(),
       lastUpdated:Date.now(),
       checklistGroupCount: 3,
       attachmentsCount: 3,
       commentCount: 3,
       labelStatus: 3,
       attachmentList: [{
         fileName: "images/11.jpg",
         timeStamp: Date.now(),
       }],
       checklist: [
         {
           checklistHeading:"Checklist Group",
           checkedCount: 1,
           items: [{
             text: "This is checklist cl1 description",
             checked: true,
           }]
         }
       ]
       //memberList: ["String01","String02"]
       //labelList:[{type:Schema.Types.ObjectId,ref:'Label'}],
     }
     );
     newStory.save(function(err,doc){
       if(err)
       res.send("ERROR-- "+err);
       else {
         projectId = "56ea78ea15eac2a96fedb5ee";//TODO: pass dynamicaly
         sprintId = "56ea89de1d4b0a2572f25b9c";
         listId = "56ea89de1d4b0a2572f25ba0";
         console.log("--------------------------------Adding Story ----" + doc["_id"]);
         //res.send(loadToBuglist(projectId, doc));
         res.send(loadToSprint(sprintId, listId, doc));
       }
     });
});
module.exports = router;
function loadToBacklog(projectId, doc) {
  backlogsBuglist.addStoryBacklog(projectId, doc["_id"], function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function deleteFromBacklog(projectId, storyId) {
  backlogsBuglist.deleteStoryBacklog(projectId, storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Deleted from Backog");
      return(doc);
    }
  });
}
function loadToBuglist(projectId, doc) {
  backlogsBuglist.addStoryBuglist(projectId, doc["_id"], function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function deleteFromBuglist(projectId, storyId) {
  backlogsBuglist.deleteStoryBuglist(projectId, storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function loadToSprint(sprintId, listId, doc) {
  sprint.addStory(sprintId, listId, doc["_id"], function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Added");
      return(doc);
    }
  });
}
function deleteFromSprint(sprintId, listId, storyId) {
  sprint.deleteStory(sprintId, listId, storyId, function(err, doc) {
    if(err){
      return(err);
    }
    else {
      console.log("----------------------Story Deleted From Sprint");
      return(doc);
    }
  });
}
