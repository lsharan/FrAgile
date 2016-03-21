
var mongoose = require('mongoose'),
 userSchema = new mongoose.Schema({
   firstName  : String,
   lastName: String,
   creationDate: Date,
   updatedDate:Date,
   password:String,
   email:String,
   initials:String,
   imageUrl:String,
   projects:[{
     type:mongoose.Schema.Types.ObjectId,
     ref:'Project'
   }]
 }),
 User = mongoose.model('User', userSchema, "users_collection");

module.exports = User;
