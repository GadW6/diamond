const Blacklister = require('../utils/Blacklister')

const CHILDREN_OPTIONS_DEFAULT = {
  check: false,
  name: ''
}
const isRouteAccessible = (table, route, checkOnChildren = CHILDREN_OPTIONS_DEFAULT) => {
  switch (checkOnChildren.check) {
    case false:
      return table.find(row => row.href === route).perm
    case true:
      const filteredResults = table.filter(row => row.href === route)
      return filteredResults.children.find(child => child.href === checkOnChildren.name).perm
  }
}

module.exports.contentProtect = (req, res, next) => {
  if (!isRouteAccessible(req.session.global.table, 'content')) return res.redirect('portal')
  next()
}

module.exports.galleryProtect = (req, res, next) => {
  if (!isRouteAccessible(req.session.global.table, 'gallery')) return res.redirect('portal')
  next()
}

module.exports.mailProtect = (req, res, next) => {
  if (!isRouteAccessible(req.session.global.table, 'messages')) return res.redirect('portal')
  next()
}

module.exports.usersProtect = (req, res, next) => {
  if (!isRouteAccessible(req.session.global.table, 'users')) return res.redirect('portal')
  next()
}

module.exports.blacklist = (req, res, next) => {
  const newBlacklist = new Blacklister(req)
  if( newBlacklist.isIpBlocked() || newBlacklist.isUriBlocked() ) return void 0;
  next()
}