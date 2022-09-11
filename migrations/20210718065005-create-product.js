'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Products', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      name: {
        allowNull: false,
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.STRING
      },
      price: {
        allowNull: false,
        type: Sequelize.DOUBLE
      },
      image: {
        type: Sequelize.STRING
      },
      order: {
        type: Sequelize.INTEGER
      },
      availability: {
        type: Sequelize.BOOLEAN
      },
      fats: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      proteins: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      carbohydrates: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      calories: {
        allowNull: true,
        type: Sequelize.DOUBLE
      },
      enPromocion: {
        type: Sequelize.BOOLEAN,
        defaultValue: false
      },
      restaurantId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'Restaurants'
          },
          key: 'id'
        }
      },
      productCategoryId: {
        type: Sequelize.INTEGER,
        references: {
          model: {
            tableName: 'ProductCategories'
          },
          key: 'id'
        }
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: new Date()
      }
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Products')
  }
}
