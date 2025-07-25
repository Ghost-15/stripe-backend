const { Model, DataTypes, Sequelize } = require("sequelize");
const connection = require("../config/dbSequelize");

module.exports = (sequelize, DataTypes) => {
class Transaction extends Model {
  static associate(models) {
    Transaction.belongsTo(models.User, { foreignKey: "userId" });
    Transaction.hasMany(models.Operation, { foreignKey: "transactionId" });
  }
}

  Transaction.init(
      {
          userId: {
              type: DataTypes.INTEGER,
              allowNull: false,
              references: {
                  model: 'Users',
                  key: 'id'
              }
          },
          email: {
              type: Sequelize.STRING,
              allowNull: false
          },
          description:{
              type: DataTypes.STRING,
              allowNull: false,
              required: true
          },
          amount:{
              type: DataTypes.FLOAT,
              allowNull: false,
              required: true,
          },
          currency: { 
              type: DataTypes.STRING, allowNull: false 
          },
          status:{
              type: DataTypes.STRING,
              allowNull: false,
              defaultValue: 'waiting'
          },
          code:{
              type: DataTypes.STRING,
              allowNull: false,
              required: true,
              unique: true
          },
          stripeSessionId: {
              type: DataTypes.STRING,
              allowNull: true,
          },
          stripePaymentIntentId: {
              type: DataTypes.STRING,
              allowNull: true,
          },
      },
      {
          sequelize: connection,
      }
  );
  
  return Transaction;
}