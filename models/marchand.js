const { Model, DataTypes } = require("sequelize");
const connection = require("../config/dbSequelize");

module.exports = (sequelize, DataTypes) => {
  class Marchand extends Model {
    static associate(models) {
      Marchand.belongsTo(models.User, { foreignKey: "userId" });
      models.User.hasOne(Marchand, { Marchand });
    }
  }

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
  return Marchand;
}