'use strict';
const {Model} = require('sequelize');
const { OutOfStockError } = require ("../ErrorClasses/OutOfStockError.js");
module.exports = (sequelize, DataTypes) => {
  const {Food} = require('./food.js')
  class Reminder extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
    static async registerTransaction (t,foodId, turn, oper, orderId=null){
      
      let reminder = await this.findOne({where:{FoodId:foodId}})
      if(turn<0){
        const foodName = await reminder.getFood()
        if(reminder.reminder < Math.abs(turn)){
          throw new OutOfStockError(foodName.name)
        }else if(reminder.reminder + turn == 0){
          let expiredFood = await reminder.getFood()
          expiredFood.active = 0
          await expiredFood.save({ transaction: t })
        }
      }
      const addTransaction = await reminder.createTransaction({
        turn, oper,
        OrderId:orderId,
        ReminderId:reminder.id
      }, { transaction: t })
      reminder.reminder += turn
      await reminder.save({ transaction: t })
    }
 
  }
  Reminder.init({
    reminder:{
      type:DataTypes.INTEGER,
    },
  }, {
    sequelize,
    modelName: 'Reminder',
  });
  
  
  return Reminder;
};