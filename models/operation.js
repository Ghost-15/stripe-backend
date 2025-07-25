const { Model, DataTypes } = require("sequelize");
const connection = require("../config/dbSequelize");

module.exports = (sequelize, DataTypes) => {
  class Operation extends Model {
    static associate(models) {
      Operation.belongsTo(models.Transaction, { foreignKey: "transactionId" });
    }
  }

  Operation.init(
    {
      transactionId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
          model: "Transactions",
          key: "id",
        },
      },
      type: {
        type: DataTypes.ENUM("capture", "refund"),
        allowNull: false,
      },
      amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
      },
      status: {
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: "pending",
      },
    },
    {
      sequelize: connection,
      modelName: "Operation",
    }
  );
  return Operation;
}