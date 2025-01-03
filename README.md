# Inventory Microservice

This microservice helps manage product inventory for an e-commerce platform. It provides RESTful endpoints for updating and checking product stock levels, making inventory management easy and reliable.

## Features

- **Track Product Inventory:** Keep stock levels up to date for all products.
- **Update Inventory:** Update inventory when an order is placed or refunded.
- **Fetch Inventory:** View current stock levels for a specific product.
- **Error Handling:** Prevents negative stock levels and returns clear error messages.
- **Scalable Design:** Integrates seamlessly into a monorepo structure.

## Technology Stack

- **Language:** TypeScript
- **Framework:** Express.js
- **Database:** PostgreSQL
- **ORM:** Drizzle ORM
- **Package Manager:** Yarn

## Prerequisites

- Node.js (v16 or higher)
- PostgreSQL database
- Yarn (package manager)
- Turbo (for managing the monorepo)

## Project Structure

```
monorepo/
├── apps/
│   ├── dashboard/       # Admin-facing app (Next.js)
│   ├── store/           # Customer-facing app (Next.js)
├── packages/
│   ├── db/              # Shared database configuration
├── services/
│   ├── inventory-api/   # Inventory microservice
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone git@github.com:jordanvidal1/sellhub.git
```

### 2. Install Dependencies

```bash
yarn install
```

### 3. Configure the Database

Create a `.env` file in the `packages/db/` directory with the following content:

```
DATABASE_URL=postgres://<user>:<password>@<host>:<port>/<database>
```

### 4. Run Migrations

```bash
yarn db:migrate
```

### 5. Build

```bash
yarn build
```

### 6. Run Services

```bash
yarn dev
```

The API will run on `http://localhost:3001` by default.

The dashboard will run on `http://localhost:3000`, and the store will run on ports `http://localhost:3002`.

## API Endpoints

### **GET /api/inventory/**

Fetches the current inventory for all products.

- **Responses:**
  - `200 OK`: Returns total inventory details.

### **GET /api/inventory/:id**

Fetches the current inventory for a product by id.

- **URL Parameter:**

  - `id`: The unique identifier of the product.

- **Responses:**
  - `200 OK`: Returns product details.
  - `404 Not Found`: Product not found.

### **POST /api/inventory/update**

Updates the inventory for a product when an order is placed or refunded.

- **Request Body:**

  ```json
  {
    "productId": "892fc9f3-1b80-424a-89bf-9ee5e85bf969",
    "quantity": 5
  }
  ```

- **Responses:**
  - `200 OK`: Inventory updated successfully.
  - `400 Bad Request`: Invalid input or insufficient inventory.
  - `404 Not Found`: Product not found.

## Testing

Run unit tests to confirm the microservice works as expected:

```bash
yarn workspace inventory-api test
```
