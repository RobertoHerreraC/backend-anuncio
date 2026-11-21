const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("bd_anuncios", "postgres", "admin54321", {
  host: "postgres_bd_app",
  dialect: "postgres",
  logging: false,
});

module.exports = sequelize;
