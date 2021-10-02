const mongoose = require('mongoose')

const groupSchema = new mongoose.Schema({
  image_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    unique: true
  },
  name: {
    type: String,
    required: true,
    trim: true,
    default: "default"
  },
  order: {
    type: Number,
    required: true,
    unique: true
  }
})

//////// ADD
// const Group = mongoose.model('group', groupSchema)
// const group = new Group({
//   image_id: "5ee8c991dd58f5b4c729ba58",
//   name: "test",
//   order: 1
// })
// group.save().then(() => console.log("inserted to db"))

module.exports = mongoose.model('group', groupSchema)