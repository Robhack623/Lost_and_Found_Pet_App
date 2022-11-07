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
      models.user.hasMany(models.found_comment, {as: 'found_comments', foreignKey:'user_fk'})
      models.user.hasMany(models.lost_comment, {as: 'lost_comments', foreignKey:'user_fk'})
      models.user.hasMany(models.found_post, {as: 'found_posts', foreignKey:'user_fk'})
      models.user.hasMany(models.lost_post, {as: 'lost_posts', foreignKey:'user_fk'})
    }
  }
  user.init({
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true
    },
    phone_number: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'user',
  });
  return user;
};