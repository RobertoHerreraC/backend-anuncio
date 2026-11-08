const express = require("express");
const cors = require("cors");
const Route = require("./router");

const app = express();

app.use(cors());

const PORT = process.env.PORT || 3000;

app.use(express.json());

app.get("/", function (req, res) {
  return res.json({ mensaje: "Bienvenido a mi proyecto backend API" });
});

app.use("/api", Route);

// Ruta no encontrada
app.use(function (req, res) {
  return res.status(404).json({ mensaje: "Ruta no encontrada" });
});

// Manejador de errores
app.use(function (err, req, res, next) {
  console.error(err);

  if (err.type === "entity.parse.failed") {
    return res
      .status(400)
      .json({ mensaje: "El cuerpo de la petición no es un JSON válido" });
  }

  return res.status(500).json({ mensaje: "Error interno del servidor" });
});

app.listen(PORT, function () {
  console.log("Servidor iniciado en: http://127.0.0.1:" + PORT);
});
