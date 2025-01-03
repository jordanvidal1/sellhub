import { v4 as uuidv4 } from 'uuid';
import { db } from '.';
import { products } from './schema';

async function seedDatabase() {
  const productData = [
    {
      id: uuidv4(),
      name: 'Product 1',
      inventoryCount: 5,
    },
    {
      id: uuidv4(),
      name: 'Product 2',
      inventoryCount: 10,
    },
    {
      id: uuidv4(),
      name: 'Product 3',
      inventoryCount: 2,
    },
  ];

  for (const product of productData) {
    await db.insert(products).values(product);
  }

  console.log('Seeding completed!');
  process.exit(0);
}

seedDatabase().catch((err) => {
  console.error('Seeding failed:', err);
  process.exit(1);
});
