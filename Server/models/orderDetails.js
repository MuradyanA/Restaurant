'use strict';
const Order = require('./order')
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Orderdetails extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
  }
  Orderdetails.init({
    foodName:{ 
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: true,
      }
    },
    quantity:{ 
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: true,
      }
    },
    price:{ 
        type:DataTypes.DECIMAL(10, 2),
        allowNull:false,
        validate:{
          notNull: true,
        }
    },
  }, {
    sequelize,
    modelName: 'Orderdetails',
  });
 
  //Orderdetails.sync({ force: true })
  return Orderdetails;
};