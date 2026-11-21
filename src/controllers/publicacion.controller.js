const { Categoria, Publicacion } = require("../model");
const { ESTADOS } = Publicacion;

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

const incluirCategoria = {
  model: Categoria,
  as: "categoria",
  attributes: ["id", "nombre", "descripcion"],
};

// GET /api/publicaciones?categoriaId=1&estado=activa
async function listarPublicaciones(req, res) {
  const { categoriaId, estado } = req.query;
  const where = {};

  if (categoriaId !== undefined) {
    const idCategoria = parseId(categoriaId);
    if (idCategoria === null) {
      return res.status(400).json({
        mensaje: "El filtro categoriaId debe ser un número entero positivo",
      });
    }
    where.categoriaId = idCategoria;
  }

  if (estado !== undefined) {
    if (!ESTADOS.includes(estado)) {
      return res.status(400).json({
        mensaje: `El estado debe ser uno de: ${ESTADOS.join(", ")}`,
      });
    }
    where.estado = estado;
  }

  try {
    const publicaciones = await Publicacion.findAll({
      where,
      include: incluirCategoria,
      order: [["id", "ASC"]],
    });

    return res
      .status(200)
      .json({ total: publicaciones.length, data: publicaciones });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// GET /api/publicaciones/:id
async function obtenerPublicacion(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  try {
    const publicacion = await Publicacion.findByPk(id, {
      include: incluirCategoria,
    });
    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    return res.status(200).json({ data: publicacion });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// POST /api/publicaciones
async function crearPublicacion(req, res) {
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

  if (estado !== undefined && !ESTADOS.includes(estado)) {
    return res
      .status(400)
      .json({ mensaje: `El estado debe ser uno de: ${ESTADOS.join(", ")}` });
  }

  try {
    const categoriaExiste = await Categoria.findByPk(idCategoria);
    if (!categoriaExiste) {
      return res
        .status(400)
        .json({ mensaje: "La categoría indicada no existe" });
    }

    const publicacion = await Publicacion.create({
      titulo: titulo.trim(),
      descripcion: esTexto(descripcion) ? descripcion.trim() : null,
      precio,
      categoriaId: idCategoria,
      estado: estado || "activa",
    });

    return res.status(201).json({
      mensaje: "Publicación creada correctamente",
      data: await publicacion.reload({ include: incluirCategoria }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// PUT /api/publicaciones/:id
async function actualizarPublicacion(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  try {
    const publicacion = await Publicacion.findByPk(id);
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

      const categoriaExiste = await Categoria.findByPk(idCategoria);
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

    await publicacion.update(datos);

    return res.status(200).json({
      mensaje: "Publicación actualizada correctamente",
      data: await publicacion.reload({ include: incluirCategoria }),
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// DELETE /api/publicaciones/:id
async function eliminarPublicacion(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  try {
    const publicacion = await Publicacion.findByPk(id);
    if (!publicacion) {
      return res.status(404).json({ mensaje: "Publicación no encontrada" });
    }

    await publicacion.destroy();

    return res.status(200).json({
      mensaje: "Publicación eliminada correctamente",
      data: publicacion,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

module.exports = {
  listarPublicaciones,
  obtenerPublicacion,
  crearPublicacion,
  actualizarPublicacion,
  eliminarPublicacion,
};
