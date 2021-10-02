const mongoose = require('./DB')

// Users Schema
const mailsSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  body: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  _receivedAt: {
    type: Date,
    default: Date.now
  }
})
// Users Model
module.exports = mongoose.model('mails', mailsSchema)