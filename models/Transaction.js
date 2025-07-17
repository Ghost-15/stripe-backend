const { Model, DataTypes } = require("sequelize");
const connection = require("../config/dbSequelize");

class transaction extends Model {}

transaction.init(
    {

        date: {
            type: DataTypes.DATE,
            allowNull: false,
            required: true
        },
        description:{
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
        Amount:{
            type: DataTypes.INTEGER,
            allowNull: false,
            required: true,
        },
        Status:{
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        }
    },
    {
        sequelize: connection,
    }
);

module.exports = transaction;