'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class lost_comment extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  lost_comment.init({
    body: DataTypes.TEXT,
    lost_fk: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'lost_comment',
  });
  return lost_comment;
};