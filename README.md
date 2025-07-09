# 📦 SMS - Sistema de Gestión de Productos

> **Proyecto Personal** - API REST para gestión de productos, categorías y etiquetas

## 📋 Descripción

SMS es una API REST construida con **Fastify**, **Bun** y **TypeScript** que permite gestionar un catálogo de productos con sistema de categorías jerárquicas y etiquetas. El proyecto implementa una arquitectura en capas con patrón Repository y servicios para una separación clara de responsabilidades.

## 🚀 Características

- ✅ **API REST** con endpoints para productos, categorías y etiquetas
- ✅ **Categorías jerárquicas** con soporte para subcategorías
- ✅ **Sistema de etiquetas** para clasificación flexible
- ✅ **Validación de datos** con Zod schemas
- ✅ **Arquitectura en capas** (Controller → Service → Repository)
- ✅ **Inyección de dependencias** con Container pattern
- ✅ **Base de datos PostgreSQL** con pool de conexiones
- ✅ **Logging estructurado** con Pino
- ✅ **TypeScript** para type safety
- ✅ **Hot reload** en desarrollo

## 🛠️ Tecnologías

- **Runtime**: [Bun](https://bun.sh) - JavaScript runtime rápido
- **Framework**: [Fastify](https://fastify.dev) - Framework web de alto rendimiento
- **Lenguaje**: [TypeScript](https://www.typescriptlang.org) - JavaScript con tipos
- **Base de datos**: [PostgreSQL](https://www.postgresql.org) - Base de datos relacional
- **Validación**: [Zod](https://zod.dev) - Schema validation
- **Logging**: [Pino](https://getpino.io) - Logger de alto rendimiento
- **IDs**: [ULID](https://github.com/ulid/spec) - Identificadores únicos

## 📁 Estructura del Proyecto

```
SMS/
├── src/
│   ├── config/          # Configuración de la aplicación
│   ├── controllers/     # Controladores de las rutas
│   ├── repositories/    # Acceso a datos
│   ├── routers/         # Definición de rutas
│   ├── schemas/         # Esquemas de validación Zod
│   ├── services/        # Lógica de negocio
│   ├── types/           # Definiciones de tipos
│   └── server.ts        # Servidor principal
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Instalación

### Prerrequisitos

- [Bun](https://bun.sh) v1.2.16 o superior
- [PostgreSQL](https://www.postgresql.org) 12 o superior
- [Node.js](https://nodejs.org) 18 o superior (opcional, para compatibilidad)

### Pasos

1. **Clonar el repositorio**
```bash
git clone <url-del-repositorio>
cd SMS
```

2. **Instalar dependencias**
```bash
bun install
```

3. **Configurar base de datos**
```bash
# Crear base de datos PostgreSQL
# Ejecutar migraciones (si aplica)
```

4. **Configurar variables de entorno**
```bash
# Crear archivo .env con la configuración de tu base de datos
# DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/sms_db
```

## 🚀 Uso

### Desarrollo

```bash
# Iniciar servidor en modo desarrollo (hot reload)
bun run dev
```

### Producción

```bash
# Construir la aplicación
bun run build

# Iniciar servidor en producción
bun run start
```

### Servidor directo

```bash
# Ejecutar el archivo principal
bun run index.ts
```

## 📡 API Endpoints

### Productos

- `GET /api/v1/products` - Obtener todos los productos
- `GET /api/v1/products/:id` - Obtener producto por ID
- `POST /api/v1/products` - Crear nuevo producto
- `PUT /api/v1/products/:id` - Actualizar producto
- `DELETE /api/v1/products/:id` - Eliminar producto

### Categorías

- `GET /api/v1/categories` - Obtener todas las categorías
- `GET /api/v1/categories/:id` - Obtener categoría por ID
- `POST /api/v1/categories` - Crear nueva categoría
- `PUT /api/v1/categories/:id` - Actualizar categoría
- `DELETE /api/v1/categories/:id` - Eliminar categoría

### Etiquetas

- `GET /api/v1/tags` - Obtener todas las etiquetas
- `GET /api/v1/tags/:id` - Obtener etiqueta por ID
- `POST /api/v1/tags` - Crear nueva etiqueta
- `PUT /api/v1/tags/:id` - Actualizar etiqueta
- `DELETE /api/v1/tags/:id` - Eliminar etiqueta

## 🏗️ Arquitectura

El proyecto sigue una arquitectura en capas:

- **Controllers**: Manejan las peticiones HTTP y respuestas
- **Services**: Contienen la lógica de negocio
- **Repositories**: Acceso a datos y consultas a la base de datos
- **Schemas**: Validación y transformación de datos con Zod
- **Container**: Inyección de dependencias tipo Singleton

## 🔍 Características Técnicas

- **Validación automática** de payloads con Zod
- **Manejo de BigInt** para precios y valores monetarios
- **IDs únicos** usando ULID para mejor rendimiento
- **Logging estructurado** con Pino Pretty para desarrollo
- **Pool de conexiones** a PostgreSQL para escalabilidad
- **Hot reload** automático en desarrollo

---

**Nota**: Este proyecto fue creado como parte de mi aprendizaje en desarrollo de APIs REST con tecnologías modernas de JavaScript/TypeScript.
