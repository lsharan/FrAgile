var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var projectSchema =new Schema({
  name : String,
  description : String,
  date : Date,
  ScrumMaster : [{type : Schema.ObjectId, ref : 'User'}],//TODO : hardcoded to be fixed
  memberList : [{type : Schema.ObjectId, ref : 'User'}],
  release : [
    {
      name : String,
      description : String,
      creationDate : Date,
      releaseDate : Date,
      sprints : [{type : Schema.ObjectId, ref : 'sprint'}]
    }
  ]
});


projectSchema.statics.addRelease = function(projectId, release, callback) {
  console.log("-------------------------------projectId: " + projectId);
  this.update(
      { "_id" : projectId },
      { $push: { release : {
            name : release["name"],
            description : release["description"],
            creationDate : release["creationDate"],
            releaseDate : release["releaseDate"]
          }
        }
      },
      {
         upsert: true
      }
   )
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

projectSchema.statics.addSprint = function(projectId, releaseId, sprint, callback) {
  console.log("-------------------------------projectId: " + projectId);
  this.update(
      { "_id" : projectId, "release._id" : releaseId },
      { $push: { "release.$.sprints" : sprint._id
        }
      },
      {
         upsert: true
      }
   )
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       console.log("------------------------ Added Sprint in project");
       callback(null, doc);
     }
   });
}
projectSchema.statics.findProj = function(projectList, callback) {
  console.log("???????????????????????????????????????????????????????");
  projectList = projectList.split(',');
  console.log(projectList);
  console.log(projectList[0]);
  this.find({ '_id' : {$in : projectList} })
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}
  var Project = mongoose.model('Project', projectSchema, "Projects");

module.exports = Project;
