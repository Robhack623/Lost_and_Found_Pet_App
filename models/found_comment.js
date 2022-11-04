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
      models.found_comment.belongsTo(models.user, {as: 'users', foreignKey:'user_fk'})
      models.found_comment.belongsTo(models.found_post, {as: 'found_posts', foreignKey:'found_fk'})
    }
  }
  found_comment.init({
    body: DataTypes.TEXT,
    found_fk: DataTypes.INTEGER,
    user_fk: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'found_comment',
  });
  return found_comment;
};