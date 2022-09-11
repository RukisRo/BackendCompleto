const { check } = require('express-validator')
const models = require('../../models')
const FileValidationHelper = require('./FileValidationHelper')

const Product = models.Product

const maxFileSize = 10000000 // around 10Mb

const chekSum100 = (fats, proteins, carbohydrates) => {
  fats = parseFloat(fats)
  proteins = parseFloat(proteins)
  carbohydrates = parseFloat(carbohydrates)

  if ((fats < 0 || proteins < 0 || carbohydrates < 0) || (fats + proteins + carbohydrates) !== 100) {
    return false
  }
  return true
}

const checkCalories = (fats, proteins, carbohydrates) => {
  fats = parseFloat(fats)
  proteins = parseFloat(proteins)
  carbohydrates = parseFloat(carbohydrates)

  const calories = fats * 9 + proteins * 4 + carbohydrates * 4

  return calories <= 1000
}

const checkPromocion = async (restaurantId, promotedValue) => {
  let isBusinessRuleToBeBroken = false
  if (promotedValue === 'true') {
    try {
      const promotedProduct = await Product.findAll({ where: { restaurantId: restaurantId, enPromocion: true } })
      if (promotedProduct.length !== 0) {
        isBusinessRuleToBeBroken = true
      }
    } catch (error) {
      isBusinessRuleToBeBroken = true
    }
  }
  return isBusinessRuleToBeBroken ? Promise.reject(new Error('Solo puedes promocionar un producto')) : Promise.resolve()
}

module.exports = {
  create: () => {
    return [
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.file)
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.file, maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('fats').custom((values, { req }) => {
        const { fats, proteins, carbohydrates } = req.body
        return chekSum100(fats, proteins, carbohydrates)
      }).withMessage('The values of fat, protein and carbohydrates must be in the range [0, 100] and the sum must be 100.'),
      check('fats').custom((values, { req }) => {
        const { fats, proteins, carbohydrates } = req.body
        return checkCalories(fats, proteins, carbohydrates)
      }).withMessage('The number of calories must not be greater than 1000.'),

      check('enPromocion').custom((value, { req }) => {
        return checkPromocion(req.body.restaurantId, value)
      })
        .withMessage('Solo se puede promocionar un producto por restaurante')
    ]
  },

  update: () => {
    return [
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileIsImage(req.file)
        })
        .withMessage('Please only submit image files (jpeg, png).'),
      check('image')
        .custom((value, { req }) => {
          return FileValidationHelper.checkFileMaxSize(req.file, maxFileSize)
        })
        .withMessage('Maximum file size of ' + maxFileSize / 1000000 + 'MB'),
      check('restaurantId')
        .custom(async (value, { req }) => {
          try {
            const product = await Product.findByPk(req.params.productId,
              {
                attributes: ['restaurantId']
              })
            // eslint-disable-next-line eqeqeq
            if (product.restaurantId != value) {
              return Promise.reject(new Error('The restaurantId cannot be modified'))
            } else { return Promise.resolve() }
          } catch (err) {
            return Promise.reject(new Error(err))
          }
        }),
      check('fats').custom((values, { req }) => {
        const { fats, proteins, carbohydrates } = req.body
        return chekSum100(fats, proteins, carbohydrates)
      }).withMessage('The values of fat, protein and carbohydrates must be in the range [0, 100] and the sum must be 100.'),
      check('fats').custom((values, { req }) => {
        const { fats, proteins, carbohydrates } = req.body
        return checkCalories(fats, proteins, carbohydrates)
      }).withMessage('The number of calories must not be greater than 1000.'),
      check('enPromocion').custom((values, { req }) => {
        const { enPromocion } = req.body
        return checkPromocion(enPromocion)
      }).withMessage('Solo se puede promocionar un producto por restaurante')
    ]
  }
}
