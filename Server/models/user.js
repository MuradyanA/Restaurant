'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
    * Helper method for defining associations.
    * This method is not a part of Sequelize lifecycle.
    * The `models/index` file will call this method automatically.
    */
    static associate(models) {
      // define association here
    }
  }
  User.init({
    email: {
      type:DataTypes.STRING,
      allowNull:false,
      validate: {
        isEmail: {msg:"Enter a valid email address"},
        notNull: {msg:"Email is required"},
        notEmpty : {msg:"Email is required"}
      }
    },
    firstName:{ 
      type:DataTypes.STRING,
      allowNull:true,
    },
    role: DataTypes.STRING,
    secondName:{ 
      type:DataTypes.STRING,
      allowNull:true,
    },
    pass: { 
      type:DataTypes.STRING,
      allowNull:true,
    },
    phoneNum: { 
      type:DataTypes.STRING,
      allowNull:true,
    },
  }, {
    sequelize,
    modelName: 'User',
  });
  return User;
};