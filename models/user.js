'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    password: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    found_post_fk: DataTypes.STRING,
    lost_post_fk: DataTypes.STRING,
    found_comment_fk: DataTypes.STRING,
    lost_comment_fk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};