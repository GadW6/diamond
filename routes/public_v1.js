const express = require('express')
const route = express.Router()
const Site = require('../models/DB').Site



//Routes
route.get('/', (req, res) => {
	Site.findOne({}).then(site => {
		res.render('v1/index', {
			title: 'Home',
			site
		})
	})
})

///////////////
//// SET DB
//////////////
const Mails = require('../models/DB').Mails
route.post('/', (req, res) => {
	const {
		name,
		email,
		body
	} = req.body

	if (name && email && body) {
		const mails = new Mails({
			name,
			email,
			body
		})
		mails.save().then(() => {});
		res.send({
			status: 'success'
		})
	}
})


///////////////
//// SET DB
//////////////
const Images = require('../models/DB').Images
route.get('/gallery', (req, res) => {
	Images.find({})
		.then((response) => {
			const pictures = response.map(row => row.href)
			res.render('v1/gallery', {
				title: 'Gallery',
				pictures
			})
		})
		.catch(err => console.log(err))

})

route.get('/gallery/*', (req, res) => {
	res.render('404')
})

route.get('/terms', (req, res) => {
	Site.findOne({}).then(site => {
		res.render('v1/terms', {
			title: 'Terms',
			siteTitle: site.termsTitle,
			site: site.termsBody
		})
	})
})

route.get('/privacy', (req, res) => {
	Site.findOne({}).then(site => {
		res.render('v1/privacy', {
			title: 'Privacy',
			siteTitle: site.privacyTitle,
			site: site.privacyBody
		})
	})
})


module.exports = route