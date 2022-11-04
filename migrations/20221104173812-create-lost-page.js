'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Lost_Pages', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      species: {
        type: Sequelize.STRING
      },
      color: {
        type: Sequelize.STRING
      },
      breed: {
        type: Sequelize.STRING
      },
      gender: {
        type: Sequelize.STRING
      },
      name: {
        type: Sequelize.STRING
      },
      size: {
        type: Sequelize.STRING
      },
      age: {
        type: Sequelize.INTEGER
      },
      zip_code: {
        type: Sequelize.STRING
      },
      description: {
        type: Sequelize.TEXT
      },
      pet_pic: {
        type: Sequelize.STRING
      },
      date_lost: {
        type: Sequelize.DATE
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Lost_Pages');
  }
};