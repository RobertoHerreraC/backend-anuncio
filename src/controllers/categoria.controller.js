const {
  categorias,
  publicaciones,
  nextCategoriaId,
} = require("../data/in-memory");

function parseId(valor) {
  if (typeof valor === "number") {
    return Number.isInteger(valor) && valor > 0 ? valor : null;
  }

  if (typeof valor === "string" && /^\d+$/.test(valor)) {
    const id = Number(valor);
    return id > 0 ? id : null;
  }

  return null;
}

function esTexto(valor) {
  return typeof valor === "string" && valor.trim() !== "";
}

function buscarCategoria(id) {
  return categorias.find((categoria) => categoria.id === id);
}

// GET /api/categorias
function listarCategorias(req, res) {
  return res.status(200).json({ total: categorias.length, data: categorias });
}

// GET /api/categorias/:id
function obtenerCategoria(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  const categoria = buscarCategoria(id);
  if (!categoria) {
    return res.status(404).json({ mensaje: "Categoría no encontrada" });
  }

  return res.status(200).json({ data: categoria });
}

// POST /api/categorias
function crearCategoria(req, res) {
  const { nombre, descripcion } = req.body || {};

  if (!esTexto(nombre)) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  const nombreNormalizado = nombre.trim();
  const existe = categorias.some(
    (categoria) =>
      categoria.nombre.toLowerCase() === nombreNormalizado.toLowerCase(),
  );
  if (existe) {
    return res
      .status(409)
      .json({ mensaje: "Ya existe una categoría con ese nombre" });
  }

  const fecha = new Date().toISOString();
  const categoria = {
    id: nextCategoriaId(),
    nombre: nombreNormalizado,
    descripcion: esTexto(descripcion) ? descripcion.trim() : "",
    createdAt: fecha,
    updatedAt: fecha,
  };

  categorias.push(categoria);

  return res
    .status(201)
    .json({ mensaje: "Categoría creada correctamente", data: categoria });
}

// PUT /api/categorias/:id
function actualizarCategoria(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  const categoria = buscarCategoria(id);
  if (!categoria) {
    return res.status(404).json({ mensaje: "Categoría no encontrada" });
  }

  const { nombre, descripcion } = req.body || {};
  const datos = {};

  if (nombre !== undefined) {
    if (!esTexto(nombre)) {
      return res
        .status(400)
        .json({ mensaje: "El nombre debe ser un texto no vacío" });
    }

    const nombreNormalizado = nombre.trim();
    const existe = categorias.some(
      (otra) =>
        otra.id !== id &&
        otra.nombre.toLowerCase() === nombreNormalizado.toLowerCase(),
    );
    if (existe) {
      return res
        .status(409)
        .json({ mensaje: "Ya existe una categoría con ese nombre" });
    }

    datos.nombre = nombreNormalizado;
  }

  if (descripcion !== undefined) {
    if (typeof descripcion !== "string") {
      return res
        .status(400)
        .json({ mensaje: "La descripción debe ser un texto" });
    }
    datos.descripcion = descripcion.trim();
  }

  if (Object.keys(datos).length === 0) {
    return res.status(400).json({
      mensaje: "Debe enviar al menos un campo para actualizar (nombre, descripcion)",
    });
  }

  Object.assign(categoria, datos, { updatedAt: new Date().toISOString() });

  return res
    .status(200)
    .json({ mensaje: "Categoría actualizada correctamente", data: categoria });
}

// DELETE /api/categorias/:id
function eliminarCategoria(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  const indice = categorias.findIndex((categoria) => categoria.id === id);
  if (indice === -1) {
    return res.status(404).json({ mensaje: "Categoría no encontrada" });
  }

  const tienePublicaciones = publicaciones.some(
    (publicacion) => publicacion.categoriaId === id,
  );
  if (tienePublicaciones) {
    return res.status(409).json({
      mensaje:
        "No se puede eliminar la categoría porque tiene publicaciones asociadas",
    });
  }

  const [categoriaEliminada] = categorias.splice(indice, 1);

  return res.status(200).json({
    mensaje: "Categoría eliminada correctamente",
    data: categoriaEliminada,
  });
}

module.exports = {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
