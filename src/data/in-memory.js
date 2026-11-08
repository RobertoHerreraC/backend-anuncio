// Almacenamiento en memoria (temporal, sin base de datos)
// Los datos se pierden cada vez que se reinicia el servidor.

const ahora = new Date().toISOString();

const categorias = [
  {
    id: 1,
    nombre: "Tecnología",
    descripcion: "Equipos, accesorios y servicios tecnológicos",
    createdAt: ahora,
    updatedAt: ahora,
  },
  {
    id: 2,
    nombre: "Hogar",
    descripcion: "Artículos y muebles para el hogar",
    createdAt: ahora,
    updatedAt: ahora,
  },
];

const publicaciones = [
  {
    id: 1,
    titulo: "Laptop HP 15",
    descripcion: "Laptop en buen estado, 8GB de RAM y 256GB SSD",
    precio: 4500,
    categoriaId: 1,
    estado: "activa",
    createdAt: ahora,
    updatedAt: ahora,
  },
  {
    id: 2,
    titulo: "Silla de escritorio",
    descripcion: "Silla ergonómica con soporte lumbar",
    precio: 350,
    categoriaId: 2,
    estado: "activa",
    createdAt: ahora,
    updatedAt: ahora,
  },
];

let ultimaCategoriaId = categorias.length;
let ultimaPublicacionId = publicaciones.length;

function nextCategoriaId() {
  ultimaCategoriaId += 1;
  return ultimaCategoriaId;
}

function nextPublicacionId() {
  ultimaPublicacionId += 1;
  return ultimaPublicacionId;
}

module.exports = {
  categorias,
  publicaciones,
  nextCategoriaId,
  nextPublicacionId,
};
