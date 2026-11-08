# Backend Anuncios

API REST desarrollada con Node.js y Express (sin base de datos, los datos se almacenan en memoria y se pierden al reiniciar el servidor).

## Requisitos

- Node.js 18 o superior

## Instalación y ejecución

```bash
npm install
npm start
```

Servidor: `http://127.0.0.1:3000`

Para desarrollo con reinicio automático:

```bash
npm run dev
```

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
├── data/
│   └── in-memory.js
├── router/
│   └── index.js
└── index.js
```
