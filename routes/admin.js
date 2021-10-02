const express = require('express')
const router = express.Router()
const path = require('path')
const { uploadProject } = require('../utils/upload')

const { logger } = require('../middlewares/wrapper')
const { Router, Content, Login, Gallery, Message, User } = require('../utils/Logger')

const {
  contentProtect,
  galleryProtect,
  mailProtect,
  usersProtect
} = require('../middlewares/guard')
const checkerMiddleware = require('../middlewares/checker')
const {
  portalController,
  contentController,
  galleryController,
  messageController,
  userController,
  globalController,
} = require('../controllers/indexControllers').adminControllers

/////////////////////////////////////LOGIN ROUTES

router.get('/', logger(Router, 'globalController'), globalController.getLogin)

router.post('/', logger(Login, 'globalController'), globalController.postLogin)

// Middleware checking protected routes
router.all('*', checkerMiddleware)

/////////////////////////////////////PORTAL

router.get('/portal', logger(Router, 'portalController'), portalController.getPortal)

// router.get('/portal/logger/:file', logger(Router, 'portalController'), portalController.getLogs)

/////////////////////////////////////SITE

router.get('/content/:sub', logger(Router, 'contentController'), contentProtect, contentController.getSubContent)

router.patch('/content', logger(Content, 'contentController'), contentProtect, contentController.patchContent)

router.put('/content', logger(Content, 'contentController'), contentProtect, contentController.putContent)

router.delete('/content', logger(Content, 'contentController'), contentProtect, contentController.deleteContent)

/////////////////////////////////////GALLERY

router.get('/gallery', logger(Router, 'galleryController'), galleryProtect, galleryController.getGallery)

router.patch('/gallery', logger(Gallery, 'galleryController'), galleryProtect, galleryController.patchGallery)

router.post('/gallery', logger(Gallery, 'galleryController'), uploadProject, galleryProtect, galleryController.postGallery)

router.delete('/gallery/:id', logger(Gallery, 'galleryController'), galleryProtect, galleryController.deleteGallery)

/////////////////////////////////////MESSAGES

router.get('/messages', logger(Router, 'messageController'), mailProtect, messageController.getMessages)

router.get('/messages/:id', logger(Router, 'messageController'), mailProtect, messageController.getSingleMessage)

router.delete('/messages/:id', logger(Message, 'messageController'), mailProtect, messageController.deleteSingleMessage)

/////////////////////////////////////USERS

router.get('/users', logger(Router, 'userController'), usersProtect, userController.getUsers)

router.post('/users', logger(User, 'userController'), usersProtect, userController.postUser)

/////////////////////////////////////LOGOUT ROUTES

router.get('/logout', globalController.getLogout)

module.exports = router