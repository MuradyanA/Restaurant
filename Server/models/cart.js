'use strict';
const Food = require('./food.js')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Cart extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
  }
  Cart.init({
    userId: {
      type:DataTypes.INTEGER,
      allowNull:false,
      validate: {
        notNull: {msg:"UserId is required"},
        notEmpty : {msg:"UserId is required"},
        isInt: {msg: "Must be an integer number"},
      }
    },
    name:{
      type:DataTypes.STRING,
      allowNull:false,
    },
    price:{
      type: DataTypes.DECIMAL(10,2),
      allowNull:false,
    },
    quantity:{
      type: DataTypes.INTEGER,
      allowNull:false,
    }
  }, {
    sequelize,
    modelName: 'Cart',
  });


  return Cart;
};