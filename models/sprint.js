var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var sprintSchema = new Schema({
      name: String,
      endDate: Date,
      startDate: Date,
      description: String,
      labelTemplate: [{
        text:String,
        colorCode:String
      }],
      list: [
        {
          group: String,
          listName: String,
          stories: [{type : Schema.Types.ObjectId, ref : 'Story'}],
        }
      ]
});

sprintSchema.statics.findRelease = function(releaseId, callback) {
  this.findOne({"_id" : releaseId})
    //.populate("story", "storyStatus heading descriptionStatus checklistGroupCount attachmentsCount commentCount")
    .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       callback(null, doc);
     }
   });
}

sprintSchema.statics.addStory = function(sprintId, listId, storyId, callback) {
  this.update(
      { "_id" : sprintId, "list._id" : listId},
      { $push: { "list.$.stories" : storyId
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

sprintSchema.statics.deleteStory = function(sprintId, listId, storyId, callback) {
  this.update(
      { "_id" : sprintId, "list._id" : listId},
      { $pull: { "list.$.stories" : storyId
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

var release = mongoose.model('Sprint', sprintSchema, "Sprints");
module.exports = release;
