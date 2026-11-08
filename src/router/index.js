const express = require("express");

const {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
} = require("../controllers/categoria.controller");

const {
  listarPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
} = require("../controllers/publicacion.controller");

const Route = express.Router();

// CRUD categoria sin BD
Route.get("/categorias", listarCategorias);
Route.get("/categorias/:id", obtenerCategoria);
Route.post("/categorias", crearCategoria);
Route.put("/categorias/:id", actualizarCategoria);
Route.delete("/categorias/:id", eliminarCategoria);

// CRUD publicacion sin BD
Route.get("/publicaciones", listarPublicaciones);
Route.get("/publicaciones/:id", obtenerPublicacion);
Route.post("/publicaciones", crearPublicacion);
Route.put("/publicaciones/:id", actualizarPublicacion);
Route.delete("/publicaciones/:id", eliminarPublicacion);

module.exports = Route;
