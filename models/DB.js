const mongoose = require('mongoose')
require('dotenv').config()

// Setting Constants
const MONGO_IP = `mongodb://${process.env.MONGO_HOST}/${process.env.MONGO_DB}`

// Setting Logger + Meta Data
const { Default } = require('../utils/Logger')
const DefaultLogger = Default.setLabel('DB').init()
Default.logOptions.component = "DB.js"
Default.logOptions.ip = MONGO_IP

try {
  // Mongo Connect
  mongoose.connect(
    MONGO_IP, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true
    }
  )
  // Checking Connection
  mongoose.connection.once('open', function () {
    DefaultLogger.info('DB is connected')
  })
} catch (error) {
  DefaultLogger.error(error)
}

module.exports = mongoose