const Sequelize = require("sequelize");

const connectS = new Sequelize(process.env.DB_SEQUELIZE_URL);

connectS.authenticate().then(() => console.log("Connected to Sequelize"));

connectS.sync()

module.exports = connectS;