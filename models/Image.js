const mongoose = require('./DB')

// Images Schema
const imagesSchema = new mongoose.Schema({
  href: {
    type: String,
    required: true,
    unique: true
  },
  name: String,
  description: String,
  _addedAt: {
    type: Date,
    default: Date.now
  }
})

//// Prepopulate

// const Images = mongoose.model('images', imagesSchema)
// let arr = []
// for (let index = 1; index < 10; index++) {
//   const setName = {
//     href: `diamond${index}.jpeg`,
//     name: `pic-${index}`,
//     description: `description-${index}`
//   }
//   arr.push(setName)
// }
// arr.forEach(el => {
//   const image = new Images(el)
//   image.save().then(() => console.log("Inserted"))
// })

// Images Model
module.exports = mongoose.model('images', imagesSchema)