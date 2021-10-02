const multer = require('multer')
const sharp = require('sharp')
const path = require('path')
const storageProject = multer.memoryStorage()

module.exports.uploadProject = multer({ storage: storageProject }).single("uploadImg")

module.exports.sharpHelper = (buffer, mimetype, destination, fileName) => {
  const type = mimetype.split('/')[1]
  return sharp(buffer)[type]({ quality: 20 }).resize({fit: sharp.fit.outside}).toFile(path.join(__dirname, '..', 'public', 'img', destination, fileName))
}