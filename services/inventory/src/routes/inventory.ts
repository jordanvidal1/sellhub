import { Router, Request, Response } from 'express';
import { db } from '@sellhub/db/src';
import { products } from '@sellhub/db/src/schema';
import { eq } from 'drizzle-orm';

const router = Router();

// POST /inventory/update
router.post('/update', async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId, quantity } = req.body;

    if (!productId || typeof quantity !== 'number') {
      return res.status(400).json({ error: 'Invalid input' });
    }

    const existingProduct = await db
      .select()
      .from(products)
      .where(eq(products.id, productId));

    if (existingProduct.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentInventory = existingProduct[0].inventoryCount;

    if (currentInventory < quantity) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    await db
      .update(products)
      .set({ inventoryCount: currentInventory - quantity })
      .where(eq(products.id, productId));

    res.status(200).json({ message: 'Inventory updated successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET /inventory/:id
router.get('/:id', async (req: Request, res: Response): Promise<any> => {
  try {
    const { id } = req.params;

    const product = await db.select().from(products).where(eq(products.id, id));

    if (product.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }

    res.status(200).json(product[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
