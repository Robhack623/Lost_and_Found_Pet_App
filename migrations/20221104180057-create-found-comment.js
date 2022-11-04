'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('found_comments', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      body: {
        type: Sequelize.TEXT
      },
      found_fk: {
        type: Sequelize.INTEGER,
        references:{model:'found_posts', key:'id'}
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
    await queryInterface.dropTable('found_comments');
  }
};