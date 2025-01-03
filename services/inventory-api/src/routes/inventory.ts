import { db } from '@sellhub/db';
import { products } from '@sellhub/db/src/schema';
import { Router, Request, Response } from 'express';
import { eq } from 'drizzle-orm';
import { isUUID } from 'validator';
import { Product } from 'packages/shared/types';

const router = Router();

const selectProductById = async (
  productId: string
): Promise<Product | null> => {
  const dbProducts = await db
    .select()
    .from(products)
    .where(eq(products.id, productId));

  return dbProducts.length > 0 ? dbProducts[0] : null;
};

// GET /inventory
router.get('/', async (req: Request, res: Response): Promise<any> => {
  try {
    const allProducts = await db.select().from(products);

    res.status(200).json(allProducts);
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

// POST /inventory/update
router.post('/update', async (req: Request, res: Response): Promise<any> => {
  try {
    const { productId, quantity } = req.body;

    // Validate the request body
    if (!productId || !isUUID(productId)) {
      return res.status(400).json({ error: 'Invalid productId' });
    }

    if (typeof quantity !== 'number' || !Number.isInteger(quantity)) {
      return res.status(400).json({ error: 'Invalid input' });
    }

    // Fetch the product from the database
    const existingProduct: Product | null = await selectProductById(productId);

    if (!existingProduct) {
      return res.status(404).json({ error: 'Product not found' });
    }

    const currentInventory = existingProduct.inventoryCount;

    // Calculate the new inventory count
    let newInventoryCount = currentInventory + quantity;
    console.log('new count', newInventoryCount);
    console.log('new count', currentInventory);
    console.log('new count', quantity);

    // Ensure inventory doesn't go below zero when subtracting
    if (newInventoryCount < 0) {
      return res.status(400).json({ error: 'Insufficient inventory' });
    }

    // Update the inventory in the database
    await db
      .update(products)
      .set({ inventoryCount: newInventoryCount })
      .where(eq(products.id, productId));

    // Get updated product for response
    const updatedProduct: Product | null = await selectProductById(productId);

    if (!updatedProduct) {
      return res.status(404).json({ error: 'Update error product not found' });
    }

    res.status(200).json({
      message: 'Inventory updated successfully',
      product: updatedProduct,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
