const fs = require('fs')
const { Image, Group } = require('../../models/indexDB')
const { AlertModalMaker } = require('../../utils/ModalMaker')
const capitalize = (s) => s.charAt(0).toUpperCase() + s.slice(1)
const { sharpHelper } = require('../../utils/upload')
const RouterLogger = require('../../utils/Logger').Router.setLabel('admin-route').init()
const GalleryLogger = require('../../utils/Logger').Gallery.setLabel('admin-route').init()

module.exports.getGallery = async (req, res) => {
  // const filterGroupValueUnique = (array) => {
  //   return array.filter((value, index, arr) => {
  //     if (value.group) arr.indexOf(value.group.name) === index
  //   })
  // }
  const images = await Image.find({})
  let pictures = images.map(async image => {
    const group = await Group.findOne({
      image_id: image._id
    })
    return {
      id: image._id,
      href: image.href,
      name: image.name,
      description: image.description,
      addedAt: image._addedAt,
      group,
    }
  })
  pictures = await Promise.all(pictures);
  const ASSET = 'gallery'
  const newAlertModal = new AlertModalMaker
  res.status(200).render('admin/main', {
    ...req.session.global,
    title: `Admin | ${capitalize(ASSET)}`,
    pageTitle: `Site ${capitalize(ASSET)}`,
    page: ASSET,
    pictures: pictures.reverse(),
    modals: {
      removePicture: newAlertModal
                      .setTag('removePicture')
                      .setBtn('Remove')
                      .setMsg('You are about to remove the image and all it\'s metadata. No recovery possible passed this point !')
    }
  })
  RouterLogger.info('Gallery Page')
}

module.exports.postGallery = async (req, res) => {
  const isTypeValid = mimetype => ['image/png', 'image/jpeg'].includes(mimetype)
  const setUniqName = originalname => Date.now() + '*_*' + originalname
  const isSizeValid = size => size < 1024 * 1024 * 7

  const {
    ['input-title']: title, ['input-description']: desc
  } = req.body
  const {
    originalname,
    mimetype,
    buffer,
    size
  } = req.file
  const imageName = setUniqName(originalname)

  if (
    isTypeValid(mimetype) &&
    isSizeValid(size) &&
    title &&
    desc
  ) {
    sharpHelper(buffer, mimetype, 'img-gallery', imageName)
    const image = new Image({
      href: imageName,
      name: title,
      description: desc
    })
    const {
      _id
    } = await image.save()
    const defaultGroup = await Group.find({
      name: "default"
    })
    const group = new Group({
      image_id: _id,
      name: "default",
      order: defaultGroup.length + 1,
    })
    await group.save()

    res.status(201).redirect('gallery')
    GalleryLogger.info('New Image Added', { image: {
      name: imageName,
      size,
      mimetype
    } })
  }
}

module.exports.patchGallery = async (req, res) => {
  const {
    id,
    title,
    description
  } = req.body
  const image = await Image.findOne({
    _id: id
  })
  image.name = title
  image.description = description
  image.save()

  res.status(201).send({
    status: 'Success'
  })
  GalleryLogger.info('Image Edited', { image: { name: image.name } })
}

module.exports.deleteGallery = async (req, res) => {
  try {
    const deletedRow = await Image.findOneAndDelete({
      _id: req.params.id
    })
    const {
      order: orderFromGroupDeleted
    } = await Group.findOneAndDelete({
      image_id: req.params.id
    })
    const allGroups = await Group.find({})
    const filterGroupsWithHigherOrder = allGroups.filter(group => group.order > orderFromGroupDeleted)
    if (filterGroupsWithHigherOrder.length) {
      const updateGroupsArray = filterGroupsWithHigherOrder.map(group => {
        group.order--;
        return group
      })
      updateGroupsArray.forEach(async group => await Group.updateOne({
        _id: group._id
      }, {
        order: group.order
      }))
    }

    fs.unlink(`public/img/img-gallery/${deletedRow.href}`, error => {
      if (error) {
        res.status(400).json({
          status: 'failed',
          dbStatus: deletedRow.deletedCount,
          action: 'removed img from db',
          image: {
            id: req.params.id,
            href: deletedRow.href
          }
        })
        GalleryLogger.error('Failed Removing Image From Storage', { image: { name: deletedRow.href }, error })
      } else {
        res.status(201).json({
          status: 'success',
          dbStatus: deletedRow.deletedCount,
          action: 'removed img from db',
          image: {
            id: req.params.id,
            href: deletedRow.href
          }
        })
        GalleryLogger.info('Image Removed From System', { image: { name: deletedRow.href } })
      }
    })
  } catch (error) {
    GalleryLogger.error('Failed Removing Image From DB', { image: { id: req.params.id }, error })
  }
}