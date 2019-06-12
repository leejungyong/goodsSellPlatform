var mongoose = require('./db.js')

var adminSchema = new mongoose.Schema({
  name: String,
  pwd: String,
  isDel:Boolean
})

module.exports = mongoose.model('Adminisrtator', adminSchema, 'administrators')
