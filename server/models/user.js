var mongoose = require('./db.js')

var userSchema = new mongoose.Schema({
  userName: String,
  userPwd: String,
  telephone:String,
  mailbox:String,
  address:String,
  headPortrait:String
})

module.exports = mongoose.model('User', userSchema, 'users')
