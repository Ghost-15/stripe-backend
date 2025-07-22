const { Model, DataTypes } = require("sequelize");
const connection = require("../config/dbSequelize");

class Marchand extends Model {}

Marchand.init(
    {
        userId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Users',
                key: 'id'
            }
        },
        nomDeSociete:{
            type: DataTypes.STRING,
            allowNull: false,
            required: true
        },
        adresse:{
            type: DataTypes.STRING,
            allowNull: false,
            required: true,
        },
        numeroSiren:{
            type: DataTypes.INTEGER,
            allowNull: false,
            required: true
        },
        code:{
            type: DataTypes.INTEGER,
            allowNull: false,
            required: true
        },
        kbis:{
            type: DataTypes.BLOB,
            allowNull: false,
            required: true
        },
        active:{
            type: DataTypes.BOOLEAN,
            defaultValue: false
        }
    },
          {
        sequelize: connection,
    }
);

module.exports = Marchand;