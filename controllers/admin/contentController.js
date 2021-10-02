const { Site } = require('../../models/indexDB')
const RouterLogger = require('../../utils/Logger').Router.setLabel('admin-route').init()
const ContentLogger = require('../../utils/Logger').Content.setLabel('admin-route').init()
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)

module.exports.patchContent = async (req, res) => {
  const {
    key,
    value
  } = req.body
  const site = await Site.findOne({})

  if (key.split('-').length === 1) site[key] = value
  else if (key.split('-').length > 1) {
    const [dest, index, tag] = key.split('-')
    site[dest][index][tag] = value
  }

  site.save()
  res.status(201).json({
    status: 'success'
  })
  ContentLogger.info('Content Edited')
}

module.exports.putContent = async (req, res) => {
  const [dest, ...rest] = req.body.key.split('-')
  const value = req.body.value

  const site = await Site.findOne({})
  site[dest].push(value)
  site.save()
  res.status(201).json({
    status: "success"
  })
  ContentLogger.info('Content Added')
}

module.exports.deleteContent = async (req, res) => {
  const {
    key,
    value
  } = req.body

  const site = await Site.findOne({})
  site[key].splice(value, 1)
  site.save()
  res.status(201).json({
    status: "success"
  })
  ContentLogger.info('Content Removed')
}

module.exports.getSubContent = async (req, res) => {
  try {
    const subNavigationsRoutes = ['home', 'terms', 'privacy']
    if(!subNavigationsRoutes.includes(req.params.sub)) return res.redirect('/admin/404')
    const site = await Site.findOne({})
    const termsBody = JSON.parse(JSON.stringify(site.termsBody))
    const privacyBody = JSON.parse(JSON.stringify(site.privacyBody))
    const ASSET = 'content'
  
    res.status(200).render('admin/main', {
      ...req.session.global,
      title: `Admin | ${capitalize(ASSET)}`,
      pageTitle: `Site ${capitalize(ASSET)}`,
      page: ASSET,
      site,
      termsBody,
      privacyBody,
      slots: [req.params.sub],
    })
  } catch (error) {
    res.status(400).render('admin/views/400', {
			...req.session.global,
			title: 'admin | Bad Request',
			page: '400',
			admin: true,
		})
    RouterLogger.error(`Admin Content ${capitalize(req.params.sub)} Page`, { error })
  }
}