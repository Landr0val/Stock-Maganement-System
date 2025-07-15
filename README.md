# 📦 SMS - Product Management System

> **Personal Project** - REST API for managing products, categories, and tags

## 📋 Description

SMS is a REST API built with **Fastify**, **Bun**, and **TypeScript** that allows managing a product catalog with a system of hierarchical categories and tags. The project implements a layered architecture with the Repository pattern and services for a clear separation of responsibilities.

## 🚀 Features

- ✅ **REST API** with endpoints for products, categories, and tags
- ✅ **Hierarchical categories** with support for subcategories
- ✅ **Tag system** for flexible classification
- ✅ **Data validation** with Zod schemas
- ✅ **Layered architecture** (Controller → Service → Repository)
- ✅ **Dependency injection** with Container pattern
- ✅ **PostgreSQL database** with connection pool
- ✅ **Structured logging** with Pino
- ✅ **TypeScript** for type safety
- ✅ **Hot reload** in development

## 🛠️ Technologies

- **Runtime**: [Bun](https://bun.sh) - Fast JavaScript runtime
- **Framework**: [Fastify](https://fastify.dev) - High-performance web framework
- **Language**: [TypeScript](https://www.typescriptlang.org) - JavaScript with types
- **Database**: [PostgreSQL](https://www.postgresql.org) - Relational database
- **Validation**: [Zod](httpss://zod.dev) - Schema validation
- **Logging**: [Pino](https://getpino.io) - High-performance logger
- **IDs**: [ULID](https://github.com/ulid/spec) - Unique identifiers

## 📁 Project Structure

```
SMS/
├── src/
│   ├── config/          # Application configuration
│   ├── controllers/     # Route controllers
│   ├── repositories/    # Data access
│   ├── routers/         # Route definitions
│   ├── schemas/         # Zod validation schemas
│   ├── services/        # Business logic
│   ├── types/           # Type definitions
│   └── server.ts        # Main server
├── package.json
├── tsconfig.json
└── README.md
```

## 🔧 Installation

### Prerequisites

- [Bun](https://bun.sh) v1.2.16 or higher
- [PostgreSQL](https://www.postgresql.org) 12 or higher
- [Node.js](https://nodejs.org) 18 or higher (optional, for compatibility)

### Steps

1. **Clone the repository**
```bash
git clone <repository-url>
cd SMS
```

2. **Install dependencies**
```bash
bun install
```

3. **Configure database**
```bash
# Create PostgreSQL database
# Run migrations (if applicable)
```

4. **Configure environment variables**
```bash
# Create .env file with your database configuration
# DATABASE_URL=postgresql://user:password@localhost:5432/sms_db
```

## 🚀 Usage

### Development

```bash
# Start server in development mode (hot reload)
bun run dev
```

### Production

```bash
# Build the application
bun run build

# Start server in production
bun run start
```

### Direct server

```bash
# Execute the main file
bun run index.ts
```

## 📡 API Endpoints

### Products

- `GET /api/v1/products` - Get all products
- `GET /api/v1/products/:id` - Get product by ID
- `POST /api/v1/products` - Create new product
- `PUT /api/v1/products/:id` - Update product
- `DELETE /api/v1/products/:id` - Delete product

### Categories

- `GET /api/v1/categories` - Get all categories
- `GET /api/v1/categories/:id` - Get category by ID
- `POST /api/v1/categories` - Create new category
- `PUT /api/v1/categories/:id` - Update category
- `DELETE /api/v1/categories/:id` - Delete category

### Tags

- `GET /api/v1/tags` - Get all tags
- `GET /api/v1/tags/:id` - Get tag by ID
- `POST /api/v1/tags` - Create new tag
- `PUT /api/v1/tags/:id` - Update tag
- `DELETE /api/v1/tags/:id` - Delete tag

## Authentication

The authentication system uses JSON Web Tokens (JWT) to secure endpoints.

### Login

To authenticate and receive a token, send a `POST` request to the `/auth/login` endpoint.

-   **Endpoint:** `POST /auth/login`
-   **Body:**
    ```json
    {
      "email": "user@example.com",
      "password": "your_password"
    }
    ```
-   **Success Response:**
    On successful authentication, the API returns a JWT and user information.
    ```json
    {
      "message": "Login successful",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
      "user": {
        "id": "01H8X...",
        "name": "Test User",
        "email": "user@example.com",
        "role": "ADMIN"
      }
    }
    ```

### Accessing Protected Routes

To access protected routes, include the JWT in the `Authorization` header with the `Bearer` scheme.

-   **Header:** `Authorization: Bearer <your_jwt_token>`

If the token is missing or invalid, the API will respond with a `401 Unauthorized` status.

### User Management

-   **User Creation:** `POST /users` - This endpoint is protected and can only be accessed by authenticated users. It is used for creating new users within the system, not for public registration.
-   **Get Current User:** `GET /auth/me` - Returns the profile of the currently authenticated user.

## 🏗️ Architecture

The project follows a layered architecture:

- **Controllers**: Handle HTTP requests and responses
- **Services**: Contain business logic
- **Repositories**: Data access and database queries
- **Schemas**: Data validation and transformation with Zod
- **Container**: Singleton-like dependency injection

## 🔍 Technical Features

- **Automatic payload validation** with Zod
- **BigInt handling** for prices and monetary values
- **Unique IDs** using ULID for better performance
- **Structured logging** with Pino Pretty for development
- **Connection pool** to PostgreSQL for scalability
- **Automatic hot reload** in development

---

**Note**: This project was created as part of my learning in REST API development with modern JavaScript/TypeScript technologies.
