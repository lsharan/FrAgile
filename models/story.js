
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var StorySchema = new Schema({
 listId:String,
 storyCreatorId: {type:Schema.Types.ObjectId,ref:'User'},
 storyStatus:String,
 heading: String,
 description: String,
 descriptionStatus: Boolean,
 createdTimeStamp: Date,
 lastUpdated: Date,
 checklistGroupCount: Number,
 attachmentsCount: Number,
 commentCount: Number,
 attachmentList: [{
   fileName: String,
   timeStamp: Date,
   path : String
 }],
 checklist: [
   {
     checklistHeading:String,
     checkedCount: Number,
     items: [{
       text: String,
       checked: Boolean
     }]
   }
 ],
 memberList: [{type:Schema.Types.ObjectId,ref:'User'}],
 labelList:[{type:Schema.Types.ObjectId,ref:'Label'}]
});


StorySchema.statics.deleteStory = function(storyId, callback) {
  console.log("-------------------------------deleting Story: " + storyId);
  this.remove({ "_id" : storyId })
   .exec(function(err , doc) {
     if (err) {
       callback(err, null);
     }
     else {
       console.log("-------------------------Deleted Story");
       callback(null, doc);
     }
   });
}

var Story = mongoose.model('Story', StorySchema);
module.exports=Story;
