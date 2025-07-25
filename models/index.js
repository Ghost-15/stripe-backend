const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const config = require(__dirname + '/../config/config.json')['development'];

const db = {};

const sequelize = new Sequelize(config.database, config.username, config.password, config);

fs.readdirSync(__dirname)
  .filter(file => file !== basename && file.endsWith('.js'))
  .forEach(file => {
    const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.Transaction.beforeCreate(async (transaction, options) => {
  const user = await db.User.findByPk(transaction.userId);
  if (!user || !user.roles.includes("MARCHAND")) {
    throw new Error("Transaction must be associated with a user of role 'marchand'");
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
