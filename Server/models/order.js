'use strict';
const Orderdetails = require('./orderDetails');
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Order extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
  }
  Order.init({
    firstName:{ 
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notEmpty: {
          msg: 'Please enter the field'
        },
        notNull: {
          msg: 'Please enter the field'
        },
      }
    },
    
    secondName:{ 
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    city:{ 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    street:{ 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    building: { 
      type:DataTypes.STRING,
      allowNull:false,
      validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    appartments: { 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    phoneNumber: { 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    cardHolder:{ 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    cardNumber: { 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
        isCreditCard: {
          msg: 'Please enter the field'
        },
    },
    cvv: { 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
        isNumeric: true, 
    },
    status:{ 
        type:DataTypes.STRING,
        allowNull:false,
        validate:{
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
      },
    },
    deliveryTime:{ 
      type:DataTypes.DATE,
      allowNull:false,
      validate: {
        notNull: {
          msg: 'Please enter the field'
        },
        notEmpty: {
          msg: 'Please enter the field'
        },
        checkTime(value) {
          if (Date.parse(value)-Date.now()<3600*1000  ) {
            throw new Error("Possible delivery within a month, after one hour from the moment of order ");
          }
          if(Date.parse(value) > Date.now() + 30*(24*3600*1000)){
            throw new Error("Possible delivery within a month, after one hour from the moment of order ");
          }

        }
      }
    },
  }, {
    sequelize,
    modelName: 'Order',
  });
 //Order.sync({ force: true })
  return Order;
};