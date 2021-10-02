const mongoose = require('./DB')

// Navigation Schema
const NavigationSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    unique: true,
  },
  href: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  icon: {
    type: String,
    required: false,
    unique: false,
  },
  perm: {
    type: Boolean,
    required: true,
    default: false,
  },
  subTitle: {
    type: String,
    trim: true,
    required: () => (this.children && this.children.length > 0)
  },
  children: {
    type: [{
      title: {
        type: String,
        required: true,
        unique: true,
        sparse: true
      },
      href: {
        type: String,
        required: true,
        unique: true,
        sparse: true
      },
      icon: {
        type: String,
        required: false,
        unique: false,
      },
      perm: {
        type: Boolean,
        required: false,
        default: false,
      },
    }],
    required: false,
  },
})

//// Prepopulate

// const Navigation = mongoose.model('navigations', NavigationSchema)

// const newNav = new Navigation({
//   href: 'users',
//   title: 'Users',
//   icon: 'fas fa-user-cog',
// })

// newNav.save().then(() => console.log('inserted'))

// Navigation Model
module.exports = mongoose.model('navigations', NavigationSchema)