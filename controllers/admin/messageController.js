const { AlertModalMaker } = require('../../utils/ModalMaker')
const { Mail } = require('../../models/indexDB')
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const RouterLogger = require('../../utils/Logger').Router.setLabel('admin-route').init()
const MessageLogger = require('../../utils/Logger').Message.setLabel('admin-route').init()

module.exports.getMessages = async (req, res) => {
  const mails = await Mail.find({}).sort({
    _receivedAt: -1
  })
  // const unread = mails.filter(mail => mail.read === false)
  // const read = mails.filter(mail => mail.read === true)
  const ASSET = 'messages'

  res.status(200).render('admin/main', {
    ...req.session.global,
    title: `Admin | ${capitalize(ASSET)}`,
    pageTitle: `Site ${capitalize(ASSET)}`,
    page: ASSET,
    mails,
    // unread,
    // read,
    slots: ['table', 'sidebar'],
  })
  RouterLogger.info('Messages Page')
}

module.exports.getSingleMessage = async (req, res) => {
  try {
    const mails = await Mail.find({}).sort({
      _receivedAt: -1
    })
    const mail = await Mail.findOne({
      _id: req.params.id
    })
    const ASSET = 'read'
    if (!mail.read) {
      mail.read = !mail.read
      mail.save()
    }
    const newModal = new AlertModalMaker
    res.status(200).render('admin/main', {
      ...req.session.global,
      title: `Admin | ${capitalize(ASSET)}`,
      pageTitle: `Site ${capitalize(ASSET)}`,
      page: 'messages',
      mail,
      mails,
      slots: ['read', 'sidebar'],
      modals: {
        removeMail: newModal
                      .setTag('deleteConfirm')
                      .setMsg('You are about to remove your mail. No restore possible past this point !')
                      .sendDelete(`/admin/messages/${mail._id}`)
                      .goTo('/admin/messages'),
      }
    })
    RouterLogger.info('Message Page')
  } catch (error) {
    return res.status(404).redirect('/admin/404')
  }
}

module.exports.deleteSingleMessage = async (req, res) => {
  try {
    await Mail.deleteOne({
      _id: req.params.id
    })
    res.status(201).json({
      status: 'success'
    })
    MessageLogger.info('Removed Email')
  } catch (error) {
    res.status(400).json({
      status: 'Failed'
    })
    MessageLogger.error('Failed Removing Email', {error})
  }
}