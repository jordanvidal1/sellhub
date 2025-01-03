import { pgTable, uuid, varchar, integer } from 'drizzle-orm/pg-core';

// Define the `products` table within the schema
export const products = pgTable('products', {
  id: uuid('id').primaryKey().notNull(),
  name: varchar('name', { length: 255 }).notNull(),
  inventoryCount: integer('inventory_count').notNull(),
});
