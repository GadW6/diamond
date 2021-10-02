const bcryptjs = require('bcryptjs')
const { User, Navigation } = require('../../models/indexDB')
const RouterLogger = require('../../utils/Logger').Router.setLabel('admin-route').init()
const LoginLogger = require('../../utils/Logger').Login.setLabel('admin-route').init()

module.exports.getLogin = (req, res) => {
  try {
    if (req.session.sid) return res.status(301).redirect('/admin/portal')
    
    const {
      user
    } = {
      ...req.session.global
    }
    res.status(200).render('admin/views/login', {
      title: 'Admin | Login',
      headerTitle: (!req.query.left || !user) ? 'Welcome Back!' : `See you soon, ${user}`,
      msg: req.session.error ? 'Incorrect username or password' : ''
    })
  } catch (error) {
    res.status(400).render('admin/views/400', {
			...req.session.global,
			title: 'admin | Bad Request',
			admin: false,
		})
    RouterLogger.error('Admin Login Page', {error})
  }
}

module.exports.postLogin = async (req, res) => {
  const {
    user,
    pass
  } = req.body

  try {
    const userMatch = await User.findOne({
      name: user
    })
    if (userMatch && bcryptjs.compareSync(pass, userMatch.password)) {
      req.session.sid = req.cookies['connect.sid']
      req.session.name = user
      req.session.role = userMatch.type
      req.session.access = await Navigation.find({})
      req.session.access = req.session.access.map(route => {
        if (userMatch.permissions.includes(route.href)) route.perm = true
        return route
      })
      LoginLogger.info('User Logged In', { credentials: req.body })
    } else {
      req.session.error = true
      LoginLogger.warn('Admin Logging In Attempt', { credentials: req.body })
    }
  } catch (error) {
    RouterLogger.Error('Admin Login Page', { credentials: req.body, error })
  } finally {
    if (req.session.error) return res.status(301).redirect('/admin')
    res.status(301).redirect('/admin/portal')
  }
}

module.exports.getLogout = (req, res) => {
  try {
    req.session.sid = ''
    res.status(301).redirect('/admin?left=true')
  } catch (error) {
    res.status(400).render('admin/views/400')
    RouterLogger.Error('Admin Logout Page', { error })
  }
}