const { Sequelize, DataTypes } = require('sequelize');
const sequelize = require("./conexion");
const Categoria = sequelize.define(
  'Categoria',
  {
    // Model attributes are defined here
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    descripcion: {
      type: DataTypes.TEXT,
      // allowNull defaults to true
    },
  },
  {
    // Other model options go here
  },
);

Categoria.sync();

module.exports = Categoria