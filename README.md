# AppDeployEB

Aplicación Node.js con Express y PostgreSQL.

## Requisitos
- Node.js >= 18
- PostgreSQL >= 13

## Instalación
```bash
npm install
```

## Configuración
Crea un archivo `.env` en la raíz con tus credenciales de Postgres:
```
DB_HOST=localhost
DB_USER=postgres
DB_PASSWORD=tu_password
DB_NAME=productsdb
DB_PORT=5432
PORT=80
```

## Ejecución
```bash
node server.js
```

El servidor quedará disponible en [http://localhost](http://localhost).
