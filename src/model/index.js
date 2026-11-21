const sequelize = require("./conexion");
const Categoria = require("./Categoria");
const Publicacion = require("./Publicacion");

// Relaciones
Categoria.hasMany(Publicacion, {
  foreignKey: "categoriaId",
  as: "publicaciones",
  onDelete: "RESTRICT",
});

Publicacion.belongsTo(Categoria, {
  foreignKey: "categoriaId",
  as: "categoria",
});

async function initDb() {
  await sequelize.authenticate();
  console.log("CONEXION CORRECTA.");

  await sequelize.sync();
  console.log("TABLAS SINCRONIZADAS.");
}

module.exports = {
  sequelize,
  Categoria,
  Publicacion,
  initDb,
};
