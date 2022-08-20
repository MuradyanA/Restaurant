'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Foods extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Foods.init({
    name: DataTypes.STRING,
    img: DataTypes.STRING,
    price: DataTypes.DECIMAL
  }, {
    sequelize,
    modelName: 'Foods',
  });
  return Foods;
};