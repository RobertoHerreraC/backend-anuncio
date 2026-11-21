# Ejemplos de uso de la API

Base URL local: `http://127.0.0.1:3000/api`

> Con Docker Compose la API queda expuesta en `http://127.0.0.1:89/api`
> (el contenedor escucha en el puerto 3000).

También puedes usar los archivos `.rest` de esta carpeta:

- `docs/categoria.rest`
- `docs/publicacion.rest`

---

## Categorías

### Listar categorías

```bash
curl http://127.0.0.1:3000/api/categorias
```

Respuesta `200`:

```json
{
  "total": 1,
  "data": [
    {
      "id": 1,
      "nombre": "Tecnología",
      "descripcion": "Equipos, accesorios y servicios tecnológicos",
      "createdAt": "2026-11-21T00:00:00.000Z",
      "updatedAt": "2026-11-21T00:00:00.000Z"
    }
  ]
}
```

### Obtener categoría por id

```bash
curl http://127.0.0.1:3000/api/categorias/1
```

Respuesta `200`:

```json
{
  "data": {
    "id": 1,
    "nombre": "Tecnología",
    "descripcion": "Equipos, accesorios y servicios tecnológicos",
    "createdAt": "2026-11-21T00:00:00.000Z",
    "updatedAt": "2026-11-21T00:00:00.000Z"
  }
}
```

### Crear categoría

```bash
curl -X POST http://127.0.0.1:3000/api/categorias \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Deportes","descripcion":"Artículos deportivos"}'
```

Respuesta `201`:

```json
{
  "mensaje": "Categoría creada correctamente",
  "data": {
    "id": 2,
    "nombre": "Deportes",
    "descripcion": "Artículos deportivos",
    "updatedAt": "2026-11-21T00:00:00.000Z",
    "createdAt": "2026-11-21T00:00:00.000Z"
  }
}
```

Errores posibles:

- `400` si `nombre` falta o está vacío.
- `409` si ya existe una categoría con ese nombre (sin distinguir mayúsculas).

### Actualizar categoría

```bash
curl -X PUT http://127.0.0.1:3000/api/categorias/2 \
  -H "Content-Type: application/json" \
  -d '{"descripcion":"Bicicletas, ropa y accesorios"}'
```

Respuesta `200`:

```json
{
  "mensaje": "Categoría actualizada correctamente",
  "data": {
    "id": 2,
    "nombre": "Deportes",
    "descripcion": "Bicicletas, ropa y accesorios",
    "createdAt": "2026-11-21T00:00:00.000Z",
    "updatedAt": "2026-11-21T00:00:00.000Z"
  }
}
```

Si no se envía ningún campo actualizable, responde `400`.

### Eliminar categoría

```bash
curl -X DELETE http://127.0.0.1:3000/api/categorias/2
```

Respuesta `200`:

```json
{
  "mensaje": "Categoría eliminada correctamente",
  "data": {
    "id": 2,
    "nombre": "Deportes",
    "descripcion": "Bicicletas, ropa y accesorios",
    "createdAt": "2026-11-21T00:00:00.000Z",
    "updatedAt": "2026-11-21T00:00:00.000Z"
  }
}
```

Respuesta `409` si la categoría tiene publicaciones asociadas:

```json
{
  "mensaje": "No se puede eliminar la categoría porque tiene publicaciones asociadas"
}
```

---

## Publicaciones

### Listar publicaciones

```bash
curl http://127.0.0.1:3000/api/publicaciones
```

### Filtrar publicaciones

```bash
curl "http://127.0.0.1:3000/api/publicaciones?categoriaId=1&estado=activa"
```

Filtros disponibles:

- `categoriaId`: número entero positivo.
- `estado`: `activa`, `pausada` o `vendida`.

Respuesta `200`:

```json
{
  "total": 1,
  "data": [
    {
      "id": 1,
      "titulo": "Laptop HP 15",
      "descripcion": "8GB de RAM y 256GB SSD",
      "precio": 4500,
      "categoriaId": 1,
      "estado": "activa",
      "createdAt": "2026-11-21T00:00:00.000Z",
      "updatedAt": "2026-11-21T00:00:00.000Z",
      "categoria": {
        "id": 1,
        "nombre": "Tecnología",
        "descripcion": "Equipos, accesorios y servicios tecnológicos"
      }
    }
  ]
}
```

### Obtener publicación por id

```bash
curl http://127.0.0.1:3000/api/publicaciones/1
```

### Crear publicación

```bash
curl -X POST http://127.0.0.1:3000/api/publicaciones \
  -H "Content-Type: application/json" \
  -d '{"titulo":"Bicicleta MTB","descripcion":"Rodado 29","precio":1200,"categoriaId":1}'
```

Respuesta `201`:

```json
{
  "mensaje": "Publicación creada correctamente",
  "data": {
    "id": 2,
    "titulo": "Bicicleta MTB",
    "descripcion": "Rodado 29",
    "precio": 1200,
    "categoriaId": 1,
    "estado": "activa",
    "updatedAt": "2026-11-21T00:00:00.000Z",
    "createdAt": "2026-11-21T00:00:00.000Z",
    "categoria": {
      "id": 1,
      "nombre": "Tecnología",
      "descripcion": "Equipos, accesorios y servicios tecnológicos"
    }
  }
}
```

Errores posibles:

- `400` si `titulo`, `precio` o `categoriaId` son inválidos.
- `400` si la categoría indicada no existe.
- `400` si `estado` no es uno de los permitidos.

### Actualizar publicación

```bash
curl -X PUT http://127.0.0.1:3000/api/publicaciones/2 \
  -H "Content-Type: application/json" \
  -d '{"precio":1000,"estado":"pausada"}'
```

Respuesta `200` con el mensaje `Publicación actualizada correctamente` y el registro actualizado.

### Eliminar publicación

```bash
curl -X DELETE http://127.0.0.1:3000/api/publicaciones/2
```

Respuesta `200`:

```json
{
  "mensaje": "Publicación eliminada correctamente",
  "data": {
    "id": 2,
    "titulo": "Bicicleta MTB",
    "descripcion": "Rodado 29",
    "precio": 1000,
    "categoriaId": 1,
    "estado": "pausada",
    "createdAt": "2026-11-21T00:00:00.000Z",
    "updatedAt": "2026-11-21T00:00:00.000Z"
  }
}
```

---

## Códigos de respuesta

| Código | Significado |
| ------ | ----------- |
| `200`  | Operación exitosa |
| `201`  | Recurso creado |
| `400`  | Datos inválidos o id inválido |
| `404`  | Recurso o ruta no encontrada |
| `409`  | Conflicto (nombre duplicado o categoría con publicaciones) |
| `500`  | Error interno del servidor |
