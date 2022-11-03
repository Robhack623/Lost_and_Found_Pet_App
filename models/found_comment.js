'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class found_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  found_comment.init({
    body: DataTypes.TEXT,
    found_fk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'found_comment',
  });
  return found_comment;
};