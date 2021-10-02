const express = require('express')
const app = express()
const adminRoute = require('./routes/admin')
const session = require('express-session')
const bodyParser = require('body-parser')
const cookieParser = require('cookie-parser')
const publicV1 = require('./routes/public_v1')
const publicV2 = require('./routes/public_v2')
require('dotenv').config()

// Blacklist Middleware
app.use(require('./middlewares/guard').blacklist)

// Setup
app.use(cookieParser())
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())
app.use(express.static(__dirname + '/public'))
app.set('view engine', 'ejs')
app.set('views', './views')
app.use(
	session({
		secret: 'somerandomsecret',
		resave: false,
		saveUninitialized: true,
		cookie: {
			secure: false,
			expires: 24 * 60 * 60 * 1000
		}
	})
)

// Version 2
app.use('/admin', adminRoute)

app.use('/v1', publicV1)

app.use('/', publicV2)

// Logger Setup
const { logger } = require('./middlewares/wrapper')
const { Router } = require('./utils/Logger')

app.get('*', logger(Router, 'app'), (req, res) => {
	if (req.url.includes('/admin')) {
		const RouterLogger = Router.setLabel('admin-route').init()
		res.render('admin/main', {
			...req.session.global,
			title: 'admin | Not Found',
			page: '404',
			admin: true,
		})
		RouterLogger.info('Not Found Admin Page')
	} else {
		const RouterLogger = Router.setLabel('public-route').init()
		res.render('admin/views/404', {
			title: 'Not Found',
			admin: false
		})
		RouterLogger.info('Not Found Page')
	}
})

app.listen(3000)