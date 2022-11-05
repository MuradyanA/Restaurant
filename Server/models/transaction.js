'use strict';
const {
  Model
} = require('sequelize');
const {OutOfStockError} = require('../ErrorClasses/OutOfStockError.js')
module.exports = (sequelize, DataTypes) => {
  
  class Transaction extends Model {
    static Reminder = require ('./reminder.js')
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
    static async destroy (params){
      const transaction =await this.findOne(params)
      const reminder = await transaction.getReminder()
      reminder.reminder -= transaction.turn
      reminder.save()
      super.destroy(params)
    }
    
  }
  Transaction.init({
    turn:{
      type:DataTypes.INTEGER,
    },
    oper:{ 
        type:DataTypes.STRING,
    }
  }, {
    sequelize,
    modelName: 'Transaction',
  });


  return Transaction;
};