const { check } = require('express-validator')
const FileValidationHelper = require('./FileValidationHelper')
const models = require('../../models')
const Restaurant = models.Restaurant

const maxFileSize = 10000000 // around 10Mb

const checkPromocion = async (ownerId, promotedValue) => {
  let isBusinessRuleToBeBroken = false
  if (promotedValue === 'true') {
    try {
      const promotedRestaurants = await Restaurant.findAll({ where: { userId: ownerId, enPromocion: true } })
      if (promotedRestaurants.length !== 0) {
        isBusinessRuleToBeBroken = true
      }
    } catch (error) {
      isBusinessRuleToBeBroken = true
    }
  }
  return isBusinessRuleToBeBroken ? Promise.reject(new Error('Only one promoted per owner')) : Promise.resolve()
}

module.exports = {
  create: () => {
    return [
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.heroImage[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.heroImage[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.logo[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.logo[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('email').isEmail(),
      check('enPromocion')
        .custom((value, { req }) => {
          return checkPromocion(req.user.id, value)
        })
        .withMessage('solo se puede tener un restaurante en promoción')
    ]
  },

  update: () => {
    return [
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.heroImage[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('heroImage')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.heroImage[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.files.logo[0])
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('logo')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.files.logo[0], maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('email').isEmail(),
      check('reglaDeNegocio')
        .custom((value, { req }) => {
          return checkPromocion(req.user.id, value)
        })
        .withMessage('solo se puede tener un restaurante en promoción')
    ]
  }
}
