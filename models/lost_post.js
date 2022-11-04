'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lost_post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      models.lost_post.belongsTo(models.user, {as: 'users', foreignKey:'user_fk'})
      models.lost_post.hasMany(models.lost_comment, {as: 'lost_comments',foreignKey: 'lost_fk'})
    }
  }
  lost_post.init({
    species: DataTypes.STRING,
    color: DataTypes.STRING,
    breed: DataTypes.STRING,
    gender: DataTypes.STRING,
    name: DataTypes.STRING,
    size: DataTypes.STRING,
    age: DataTypes.STRING,
    zip_code: DataTypes.STRING,
    description: DataTypes.TEXT,
    pet_pic: DataTypes.STRING,
    date_lost: DataTypes.STRING,
    user_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'lost_post',
  });
  return lost_post;
};