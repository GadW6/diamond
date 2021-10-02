const mongoose = require('./DB')

// Users Schema
const usersSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    lowercase: true,
    unique: true
  },
  password: {
    type: String,
    required: true,
    trim: true
  },
  type: {
    type: String,
    required: true,
    trim: true,
    lowercase: true
  },
  permissions: {
    type: Array,
    required: true,
    trim: true,
    lowercase: true,
    validate: {
      validator: permArr => {
        permArr.length <= 4
      },
      message: 'The array length cannot be greater than 4'
    }
  }
})

///// Prepopulate
// const hash = bcrypt.hashSync('password', 8)
// const Users = mongoose.model('users', usersSchema)
// const users = new Users({
// 	name: 'admin',
// 	password: hash,
// 	type: 'admin',
// 	permissions: ['site', 'gallery', 'mail', 'users']
// })
// users.save().then(() => console.log('user inserted'))

// Users Model
module.exports = mongoose.model('users', usersSchema)