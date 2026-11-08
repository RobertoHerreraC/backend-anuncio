const {
  categorias,
  publicaciones,
  nextPublicacionId,
} = require("../data/in-memory");

const ESTADOS = ["activa", "pausada", "vendida"];

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

function esPrecio(valor) {
  return typeof valor === "number" && Number.isFinite(valor) && valor >= 0;
}

function buscarPublicacion(id) {
  return publicaciones.find((publicacion) => publicacion.id === id);
}

// GET /api/publicaciones?categoriaId=1&estado=activa
function listarPublicaciones(req, res) {
  const { categoriaId, estado } = req.query;
  let resultado = [...publicaciones];

  if (categoriaId !== undefined) {
    const idCategoria = parseId(categoriaId);
    if (idCategoria === null) {
      return res.status(400).json({
        mensaje: "El filtro categoriaId debe ser un número entero positivo",
      });
    }
    resultado = resultado.filter(
      (publicacion) => publicacion.categoriaId === idCategoria,
    );
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({
        mensaje: `El estado debe ser uno de: ${ESTADOS.join(", ")}`,
      });
    }
    resultado = resultado.filter(
      (publicacion) => publicacion.estado === estado,
    );
  }

  return res.status(200).json({ total: resultado.length, data: resultado });
}

// GET /api/publicaciones/:id
function obtenerPublicacion(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  const publicacion = buscarPublicacion(id);
  if (!publicacion) {
    return res.status(404).json({ mensaje: "Publicación no encontrada" });
  }

  return res.status(200).json({ data: publicacion });
}

// POST /api/publicaciones
function crearPublicacion(req, res) {
  const { titulo, descripcion, precio, categoriaId, estado } = req.body || {};

  if (!esTexto(titulo)) {
    return res.status(400).json({ mensaje: "El título es obligatorio" });
  }

  if (!esPrecio(precio)) {
    return res.status(400).json({
      mensaje: "El precio es obligatorio y debe ser un número mayor o igual a 0",
    });
  }

  const idCategoria = parseId(categoriaId);
  if (idCategoria === null) {
    return res
      .status(400)
      .json({ mensaje: "La categoría es obligatoria y debe ser un id válido" });
  }

  const categoriaExiste = categorias.some(
    (categoria) => categoria.id === idCategoria,
  );
  if (!categoriaExiste) {
    return res
      .status(400)
      .json({ mensaje: "La categoría indicada no existe" });
  }

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res
      .status(400)
      .json({ mensaje: `El estado debe ser uno de: ${ESTADOS.join(", ")}` });
  }

  const fecha = new Date().toISOString();
  const publicacion = {
    id: nextPublicacionId(),
    titulo: titulo.trim(),
    descripcion: esTexto(descripcion) ? descripcion.trim() : "",
    precio,
    categoriaId: idCategoria,
    estado: estado || "activa",
    createdAt: fecha,
    updatedAt: fecha,
  };

  publicaciones.push(publicacion);

  return res
    .status(201)
    .json({ mensaje: "Publicación creada correctamente", data: publicacion });
}

// PUT /api/publicaciones/:id
function actualizarPublicacion(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  const publicacion = buscarPublicacion(id);
  if (!publicacion) {
    return res.status(404).json({ mensaje: "Publicación no encontrada" });
  }

  const { titulo, descripcion, precio, categoriaId, estado } = req.body || {};
  const datos = {};

  if (titulo !== undefined) {
    if (!esTexto(titulo)) {
      return res
        .status(400)
        .json({ mensaje: "El título debe ser un texto no vacío" });
    }
    datos.titulo = titulo.trim();
  }

  if (descripcion !== undefined) {
    if (typeof descripcion !== "string") {
      return res
        .status(400)
        .json({ mensaje: "La descripción debe ser un texto" });
    }
    datos.descripcion = descripcion.trim();
  }

  if (precio !== undefined) {
    if (!esPrecio(precio)) {
      return res.status(400).json({
        mensaje: "El precio debe ser un número mayor o igual a 0",
      });
    }
    datos.precio = precio;
  }

  if (categoriaId !== undefined) {
    const idCategoria = parseId(categoriaId);
    if (idCategoria === null) {
      return res.status(400).json({ mensaje: "El categoriaId no es válido" });
    }

    const categoriaExiste = categorias.some(
      (categoria) => categoria.id === idCategoria,
    );
    if (!categoriaExiste) {
      return res
        .status(400)
        .json({ mensaje: "La categoría indicada no existe" });
    }

    datos.categoriaId = idCategoria;
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res
        .status(400)
        .json({ mensaje: `El estado debe ser uno de: ${ESTADOS.join(", ")}` });
    }
    datos.estado = estado;
  }

  if (Object.keys(datos).length === 0) {
    return res.status(400).json({
      mensaje:
        "Debe enviar al menos un campo para actualizar (titulo, descripcion, precio, categoriaId, estado)",
    });
  }

  Object.assign(publicacion, datos, { updatedAt: new Date().toISOString() });

  return res.status(200).json({
    mensaje: "Publicación actualizada correctamente",
    data: publicacion,
  });
}

// DELETE /api/publicaciones/:id
function eliminarPublicacion(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  const indice = publicaciones.findIndex(
    (publicacion) => publicacion.id === id,
  );
  if (indice === -1) {
    return res.status(404).json({ mensaje: "Publicación no encontrada" });
  }

  const [publicacionEliminada] = publicaciones.splice(indice, 1);

  return res.status(200).json({
    mensaje: "Publicación eliminada correctamente",
    data: publicacionEliminada,
  });
}

module.exports = {
  listarPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
};
