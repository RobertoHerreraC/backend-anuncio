# Backend Anuncios

API REST desarrollada con Node.js, Express, Sequelize y PostgreSQL. Las categorías y publicaciones persisten en la base de datos `bd_anuncios`.

## Requisitos

- Node.js 18 o superior
- PostgreSQL 15 (o Docker / Docker Compose)

## Instalación y ejecución

Con Docker Compose (levanta la API, PostgreSQL y el frontend Angular):

```bash
docker compose up --build
```

Servicios expuestos:

- Frontend: `http://localhost:4200` (nginx, con proxy `/api` al backend)
- API: `http://localhost:89`
- PostgreSQL: `localhost:5789`

En local:

```bash
npm install
npm start
```

Servidor: `http://127.0.0.1:3000`

Para desarrollo con reinicio automático:

```bash
npm run dev
```

## Frontend Angular

La aplicación web está en el proyecto hermano [`../frontend_anuncio`](../frontend_anuncio) y consume esta API.

Dentro de Docker Compose se compila y sirve con nginx en `http://localhost:4200`,
redirigiendo `/api` al contenedor `backend_node_app` (sin necesidad de CORS ni
configurar la URL del backend en el frontend).

En local:

```bash
cd ../frontend_anuncio
npm install
npm start
```

Frontend: `http://localhost:4200` (usa `proxy.conf.json` hacia `http://127.0.0.1:89`).
Más detalles en [`../frontend_anuncio/README.md`](../frontend_anuncio/README.md).

## Endpoints

Base URL: `/api`

### Categorías

| Método | Ruta                | Descripción                  |
| ------ | ------------------- | ---------------------------- |
| GET    | `/categorias`       | Lista todas las categorías   |
| GET    | `/categorias/:id`   | Obtiene una categoría por id |
| POST   | `/categorias`       | Crea una categoría           |
| PUT    | `/categorias/:id`   | Actualiza una categoría      |
| DELETE | `/categorias/:id`   | Elimina una categoría        |

Campos:

- `nombre` (obligatorio, texto único)
- `descripcion` (opcional, texto)

### Publicaciones

| Método | Ruta                  | Descripción                     |
| ------ | --------------------- | ------------------------------- |
| GET    | `/publicaciones`      | Lista todas las publicaciones   |
| GET    | `/publicaciones/:id`  | Obtiene una publicación por id  |
| POST   | `/publicaciones`      | Crea una publicación            |
| PUT    | `/publicaciones/:id`  | Actualiza una publicación       |
| DELETE | `/publicaciones/:id`  | Elimina una publicación         |

Filtros disponibles en `GET /publicaciones`:

- `categoriaId`: id de categoría
- `estado`: `activa`, `pausada` o `vendida`

Campos:

- `titulo` (obligatorio, texto)
- `descripcion` (opcional, texto)
- `precio` (obligatorio, número mayor o igual a 0)
- `categoriaId` (obligatorio, debe existir)
- `estado` (opcional, por defecto `activa`)

## Ejemplos

Crear una categoría:

```bash
curl -X POST http://127.0.0.1:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Deportes","descripcion":"Artículos deportivos"}'
```

Crear una publicación:

```bash
curl -X POST http://127.0.0.1:3000/api/publicaciones \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Bicicleta MTB","descripcion":"Rodado 29","precio":1200,"categoriaId":1}'
```

Más ejemplos y respuestas de ejemplo en [`docs/ejemplos.md`](docs/ejemplos.md).
Archivos para probar en VS Code / JetBrains HTTP Client:

- [`docs/categoria.rest`](docs/categoria.rest)
- [`docs/publicacion.rest`](docs/publicacion.rest)

## Códigos de respuesta

- `200`: operación exitosa
- `201`: recurso creado
- `400`: datos inválidos
- `404`: recurso o ruta no encontrada
- `409`: conflicto (nombre duplicado o categoría con publicaciones asociadas)
- `500`: error interno del servidor

## Estructura del proyecto

```
src/
├── controllers/
│   ├── categoria.controller.js
│   └── publicacion.controller.js
├── model/
│   ├── conexion.js
│   ├── Categoria.js
│   ├── Publicacion.js
│   └── index.js
├── router/
│   └── index.js
└── index.js

docs/
├── categoria.rest
├── publicacion.rest
└── ejemplos.md
```
