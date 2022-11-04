'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Lost_Page extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Lost_Page.init({
    species: DataTypes.STRING,
    color: DataTypes.STRING,
    breed: DataTypes.STRING,
    gender: DataTypes.STRING,
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    age: DataTypes.INTEGER,
    zip_code: DataTypes.STRING,
    description: DataTypes.TEXT,
    pet_pic: DataTypes.STRING,
    date_lost: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'Lost_Page',
  });
  return Lost_Page;
};