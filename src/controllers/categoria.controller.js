const { Op } = require("sequelize");
const { Categoria, Publicacion } = require("../model");

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

async function buscarCategoria(id) {
  return Categoria.findByPk(id);
}

// GET /api/categorias
async function listarCategorias(req, res) {
  try {
    const categorias = await Categoria.findAll({ order: [["id", "ASC"]] });
    return res.status(200).json({ total: categorias.length, data: categorias });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// GET /api/categorias/:id
async function obtenerCategoria(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  try {
    const categoria = await buscarCategoria(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    return res.status(200).json({ data: categoria });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// POST /api/categorias
async function crearCategoria(req, res) {
  const { nombre, descripcion } = req.body || {};

  if (!esTexto(nombre)) {
    return res.status(400).json({ mensaje: "El nombre es obligatorio" });
  }

  const nombreNormalizado = nombre.trim();

  try {
    const existe = await Categoria.findOne({
      where: { nombre: { [Op.iLike]: nombreNormalizado } },
    });
    if (existe) {
      return res
        .status(409)
        .json({ mensaje: "Ya existe una categoría con ese nombre" });
    }

    const categoria = await Categoria.create({
      nombre: nombreNormalizado,
      descripcion: esTexto(descripcion) ? descripcion.trim() : null,
    });

    return res
      .status(201)
      .json({ mensaje: "Categoría creada correctamente", data: categoria });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ mensaje: "Ya existe una categoría con ese nombre" });
    }

    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// PUT /api/categorias/:id
async function actualizarCategoria(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  try {
    const categoria = await buscarCategoria(id);
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
      const existe = await Categoria.findOne({
        where: {
          id: { [Op.ne]: id },
          nombre: { [Op.iLike]: nombreNormalizado },
        },
      });
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
        mensaje:
          "Debe enviar al menos un campo para actualizar (nombre, descripcion)",
      });
    }

    await categoria.update(datos);

    return res
      .status(200)
      .json({ mensaje: "Categoría actualizada correctamente", data: categoria });
  } catch (error) {
    if (error.name === "SequelizeUniqueConstraintError") {
      return res
        .status(409)
        .json({ mensaje: "Ya existe una categoría con ese nombre" });
    }

    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

// DELETE /api/categorias/:id
async function eliminarCategoria(req, res) {
  const id = parseId(req.params.id);
  if (id === null) {
    return res
      .status(400)
      .json({ mensaje: "El id debe ser un número entero positivo" });
  }

  try {
    const categoria = await buscarCategoria(id);
    if (!categoria) {
      return res.status(404).json({ mensaje: "Categoría no encontrada" });
    }

    const totalPublicaciones = await Publicacion.count({
      where: { categoriaId: id },
    });
    if (totalPublicaciones > 0) {
      return res.status(409).json({
        mensaje:
          "No se puede eliminar la categoría porque tiene publicaciones asociadas",
      });
    }

    await categoria.destroy();

    return res.status(200).json({
      mensaje: "Categoría eliminada correctamente",
      data: categoria,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ mensaje: "Error interno del servidor" });
  }
}

module.exports = {
  listarCategorias,
  obtenerCategoria,
  crearCategoria,
  actualizarCategoria,
  eliminarCategoria,
};
