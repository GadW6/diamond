const fs = require('fs')
const path = require('path')
const { InfoModalMaker } = require('../utils/ModalMaker')
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

module.exports = async (req, res, next) => {
  if (!req.session.sid && req.session.sid !== req.cookies['connect.sid']) return res.status(301).redirect('/admin')
  const {
    name
  } = req.session
  const newInfoModal = new InfoModalMaker
  req.session.global = {
    table: req.session.access,
    date: new Date,
    user: capitalize(name),
    isAssetExists: (asset, ext, rootFolder = null) => fs.existsSync(path.join(__dirname, '..', 'public', ext, 'admin', rootFolder || asset, `${asset}.${ext}`)),
    logoutModal: newInfoModal.setTag('logoutModal').setBtn('Logout').sendGet('/admin/logout', false)
  }
  next()
}