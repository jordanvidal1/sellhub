# Inventory Microservice

This microservice helps manage product inventory for an e-commerce platform. It provides RESTful endpoints for updating and checking product stock levels, making inventory management easy and reliable.

## Features

- **Track Product Inventory:** Keep stock levels up to date for all products.
- **Update Inventory:** Reduce inventory when an order is placed.
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
│   ├── inventory-api/   # Inventory microservice
│   ├── db/              # Shared database configuration
```

## Setup Instructions

### 1. Clone the Repository

```bash
git clone <repository-url>
cd monorepo
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
yarn workspace db migrate
```

### 5. Start the Inventory Microservice

```bash
yarn workspace inventory-api start
```

The API will run on `http://localhost:3001` by default.

## API Endpoints

### **POST /api/inventory/update**

Updates the inventory for a product when an order is placed.

- **Request Body:**

  ```json
  {
    "productId": "1234-abcd",
    "quantity": 5
  }
  ```

- **Responses:**
  - `200 OK`: Inventory updated successfully.
  - `400 Bad Request`: Invalid input or insufficient inventory.
  - `404 Not Found`: Product not found.

### **GET /api/inventory/:id**

Fetches the current inventory for a product.

- **URL Parameter:**

  - `id`: The unique identifier of the product.

- **Responses:**
  - `200 OK`: Returns product details, including `inventoryCount`.
  - `404 Not Found`: Product not found.

## Testing

Run unit tests to confirm the microservice works as expected:

```bash
yarn workspace inventory-api test
```

## Future Enhancements

- Add functionality to restock inventory.
- Support batch updates for multiple products.
- Implement authentication and access control.
- Add notifications for low stock levels.

## Contributing

We welcome contributions! Fork the repository, make your changes, and submit a pull request.

## License

This project is licensed under the MIT License.
