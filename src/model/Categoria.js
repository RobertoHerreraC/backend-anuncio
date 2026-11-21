const { DataTypes } = require("sequelize");
const sequelize = require("./conexion");

const Categoria = sequelize.define(
  "Categoria",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "categorias",
    timestamps: true,
  },
);

module.exports = Categoria;
