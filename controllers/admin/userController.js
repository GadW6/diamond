const { User } = require('../../models/indexDB')
const bcryptjs = require('bcryptjs')
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const RouterLogger = require('../../utils/Logger').Router.setLabel('admin-route').init()
const UserLogger = require('../../utils/Logger').User.setLabel('admin-route').init()

module.exports.getUsers = async (req, res) => {
  try {
    const users = await User.find({})
    const ASSET = 'users'
  
    res.status(200).render('admin/main', {
      ...req.session.global,
      title: `Admin | ${capitalize(ASSET)}`,
      pageTitle: `Site ${capitalize(ASSET)}`,
      page: ASSET,
      users,
    })
  } catch (error) {
    res.status(400).json({
      status: 'failed'
    })
    RouterLogger.error('User Page', { error })
  }
}

module.exports.postUser = async (req, res) => {
  try {
    const {
      uName,
      uPass,
      uType,
      uPerms
    } = req.body
    const hash = bcryptjs.hashSync(uPass, 8)
    const users = new User({
      name: uName,
      password: hash,
      type: uType,
      permissions: uPerms
    })
    const newUser = await users.save()
    res.status(201).json({
      message: 'success'
    })
    UserLogger.info('Created New User', {user: newUser})
  } catch (error) {
    res.status(400).json({
      message: 'failed'
    })
    UserLogger.info('Failed Creating New User', {error})
  }
}