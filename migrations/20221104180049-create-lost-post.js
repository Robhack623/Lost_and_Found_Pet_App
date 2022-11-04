'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('lost_posts', {
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
        type: Sequelize.STRING
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
        type: Sequelize.STRING
      },
      user_fk: {
        type: Sequelize.INTEGER,
        references:{model:'users', key:'id'}
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
    await queryInterface.dropTable('lost_posts');
  }
};