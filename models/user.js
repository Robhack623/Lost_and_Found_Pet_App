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
      models.users.hasMany(models.found_comments, {foreignKey:'user_fk'})
      models.users.hasMany(models.lost_comments, {foreignKey:'user_fk'})
      models.users.hasMany(models.found_posts, {foreignKey:'user_fk'})
      models.users.hasMany(models.lost_posts, {foreignKey:'user_fk'})
    }
  }
  user.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: DataTypes.STRING,
    email: DataTypes.STRING,
    phone_number: DataTypes.STRING,
    zip_code: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};