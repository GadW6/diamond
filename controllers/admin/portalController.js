const path = require('path')
const fs = require('fs')
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const RouterLogger = require('../../utils/Logger').Router.setLabel('admin-route').init()

module.exports.getPortal = (req, res) => {
  try {
    const ASSET = 'portal'
  
    res.status(200).render('admin/main', {
      ...req.session.global,
      title: `Admin | ${capitalize(ASSET)}`,
      page: ASSET,
    })
  } catch (error) {
    res.status(400).render('admin/views/400')
    RouterLogger.error('Admin Portal', { error })
  }
}

// module.exports.getLogs = (req, res) => {
//   return void 0;
//   const fileToDownload = req.params.file
//   let fileTarget = path.join(__dirname, '..', '..', 'log', fileToDownload)
//   if (fs.existsSync(fileTarget)) return res.status(200).download(fileTarget)
// }