'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development';
// const config = require(__dirname + '/../config/config.json')[env];
const db = {};
const sequelize = new Sequelize({
  dialect: 'sqlite',
  storage: 'database.sqlite'
});


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});
db.Orderdetails.belongsTo(db.Order);
db.Order.hasMany(db.Orderdetails);
db.Order.belongsTo(db.User);
//db.Order.belongsTo(db.User)
//db.Order.sync({ force: true })
//db.Orderdetails.sync({ force: true })
 db.sequelize = sequelize;
 db.Sequelize = Sequelize;
 //db.sequelize.sync();
module.exports = db;
