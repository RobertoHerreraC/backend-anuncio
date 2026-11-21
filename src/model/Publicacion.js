const { DataTypes } = require("sequelize");
const sequelize = require("./conexion");

const ESTADOS = ["activa", "pausada", "vendida"];

const Publicacion = sequelize.define(
  "Publicacion",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    descripcion: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    precio: {
      type: DataTypes.FLOAT,
      allowNull: false,
      validate: {
        min: 0,
      },
    },
    categoriaId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      field: "categoria_id",
      references: {
        model: "categorias",
        key: "id",
      },
      onUpdate: "CASCADE",
      onDelete: "RESTRICT",
    },
    estado: {
      type: DataTypes.ENUM(...ESTADOS),
      allowNull: false,
      defaultValue: "activa",
    },
  },
  {
    tableName: "publicaciones",
    timestamps: true,
  },
);

Publicacion.ESTADOS = ESTADOS;

module.exports = Publicacion;
