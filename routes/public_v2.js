const express = require('express')
const route = express.Router()
const { Site, Image, Mail } = require('../models/indexDB')

// Logger Setup
const { logger } = require('../middlewares/wrapper')
const { Router, Message } = require('../utils/Logger')
const RouterLogger = Router.setLabel('public-route').init()
const MessageRouter = Message.setLabel('public-route').init()


route.get('/', logger(Router, 'public_v2'), async (req, res) => {
	const site = await Site.findOne({})
	const images = await Image.find({})
	res.status(200).render('v2/master', {
		title: 'Home',
		site,
		images
	})
	
	RouterLogger.info('main page')
})

route.post('/', logger(Message, 'public_v2'), async (req, res) => {
	const {
		name,
		email,
		body
	} = req.body
	
	if (name && email && body) {
		const mails = new Mail({
			name,
			email,
			body
		})
		await mails.save();
		res.send({
			status: 'success'
		})
	}
	
	MessageRouter.info('Message Sent', { credentials: req.body })
})


///////////////
//// SET DB
//////////////
// const Image = require('../models/DB').Image
// route.get('/gallery', (req, res) => {
// 	Image.find({})
// 		.then((response) => {
// 			const pictures = response.map(row => row.href)
// 			res.render('gallery', {
// 				title: 'Gallery',
// 				pictures
// 			})
// 		})
// 		.catch(err => console.log(err))

// })

// route.get('/gallery/*', (req, res) => {
// 	res.render('404')
// })

route.get('/terms', logger(Router, 'public_v2'), (req, res) => {
	Site.findOne({}).then(site => {
		res.render('v2/master', {
			title: 'Terms',
			site
		})
	})
	RouterLogger.info('terms page')
})

route.get('/privacy', logger(Router, 'public_v2'), (req, res) => {
	Site.findOne({}).then(site => {
		res.render('v2/master', {
			title: 'Privacy',
			site
		})
	})
	RouterLogger.info('privacy page')
})


module.exports = route