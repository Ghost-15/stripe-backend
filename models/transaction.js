const { Model, DataTypes } = require("sequelize");
const connection = require("../config/dbSequelize");

class transaction extends Model {}

transaction.init({

            userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
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
        }
    },
    {
        sequelize: connection,
    }
);

module.exports = transaction;
