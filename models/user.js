const { Model, DataTypes } = require("sequelize");
const connection = require("../config/dbSequelize");

module.exports = (sequelize, DataTypes) => {
  class User extends Model {}

  User.init(
      {
          first_name: {
              type: DataTypes.STRING,
              allowNull: false,
              required: true
          },
          last_name: {
              type: DataTypes.STRING,
              allowNull: false,
              required: true
          },
          username: {
              type: DataTypes.STRING,
              allowNull: false,
              unique: true,
              required: true,
              validate: {
                  isEmail: true,
              },
          },
          password: {
              type: DataTypes.STRING,
              allowNull: false,
              required: true,
          },
          roles: {
              type: DataTypes.JSON,
              allowNull: false,
              required: true,
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
  return User;
}