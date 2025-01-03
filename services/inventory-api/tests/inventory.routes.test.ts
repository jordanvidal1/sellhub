import request from 'supertest';
import express from 'express';
import { v4 as uuidv4 } from 'uuid';
import inventoryRouter from '../src/routes/inventory';
import { db } from '@sellhub/db';

let validProductId: string;
let invalidProductId: string;

const mockProducts = [
  {
    id: 'aa322176-6c45-4b07-8df3-00359366d2b4',
    name: 'Product 1',
    inventoryCount: 5,
  },
  {
    id: 'ba322176-6c45-4b07-8df3-00359366d2b4',
    name: 'Product 2',
    inventoryCount: 10,
  },
  {
    id: 'ca322176-6c45-4b07-8df3-00359366d2b4',
    name: 'Product 3',
    inventoryCount: 2,
  },
];

jest.mock('@sellhub/db', () => ({
  db: {
    select: jest.fn(() => ({
      from: jest.fn(() => mockProducts),
    })),
    update: jest.fn(() => Promise.resolve(mockProducts[0])),
  },
}));

const app = express();
app.use(express.json());
app.use('/api/inventory', inventoryRouter);

describe('Inventory API', () => {
  beforeAll(() => {
    validProductId = uuidv4();
    invalidProductId = uuidv4();
  });

  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('GET /api/inventory', () => {
    it('should return all products', async () => {
      const response = await request(app).get('/api/inventory');

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts);
    });
  });

  describe('GET /api/inventory/:id', () => {
    beforeAll(() => {
      validProductId = mockProducts[0].id;
      invalidProductId = '123';
    });

    it('should return a product by id', async () => {
      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve(mockProducts)),
        })),
      }));

      const response = await request(app).get(
        `/api/inventory/${invalidProductId}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toEqual(mockProducts[0]);
    });

    it('should return a 404 if product not found', async () => {
      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([])),
        })),
      }));

      const response = await request(app).get(
        `/api/inventory/${invalidProductId}`
      );

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });
  });

  describe('POST /api/inventory/update', () => {
    beforeAll(() => {
      validProductId = mockProducts[0].id;
      invalidProductId = '123';
    });

    it('should increase inventory when quantity is positive', async () => {
      const inventoryCount = 5;
      const quantity = 5;

      const mockProduct = mockProducts[0];
      const updatedMockProduct = {
        ...mockProduct,
        inventoryCount: 10,
      };

      db.update.mockImplementation(() => ({
        set: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve(1)),
        })),
      }));

      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([updatedMockProduct])),
        })),
      }));

      const response = await request(app)
        .post('/api/inventory/update')
        .send({ productId: validProductId, quantity });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Inventory updated successfully',
        product: updatedMockProduct,
      });
      expect(response.body.product.inventoryCount).toEqual(
        inventoryCount + quantity
      );
    });

    it('should decrease inventory when quantity is negative', async () => {
      const inventoryCount = 10;
      const quantity = -5;

      const mockProduct = mockProducts[0];
      const updatedMockProduct = {
        ...mockProduct,
        inventoryCount: 5,
      };

      db.update.mockImplementation(() => ({
        set: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve(1)),
        })),
      }));

      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([updatedMockProduct])),
        })),
      }));

      const response = await request(app)
        .post('/api/inventory/update')
        .send({ productId: validProductId, quantity });

      expect(response.status).toBe(200);
      expect(response.body).toEqual({
        message: 'Inventory updated successfully',
        product: updatedMockProduct,
      });
      expect(response.body.product.inventoryCount).toEqual(
        inventoryCount + quantity
      );
    });

    it('should return an error if inventory goes below zero', async () => {
      const inventoryCount = 2;
      const quantity = -5;

      const mockProduct = mockProducts[2];
      const updatedMockProduct = {
        ...mockProduct,
        inventoryCount: -2,
      };

      db.update.mockImplementation(() => ({
        set: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve(1)),
        })),
      }));

      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([updatedMockProduct])),
        })),
      }));

      const response = await request(app)
        .post('/api/inventory/update')
        .send({ productId: validProductId, quantity });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Insufficient inventory',
      });
    });

    it('should return a 400 if input is invalid', async () => {
      const inventoryCount = 2;
      const quantity = -5;

      const mockProduct = mockProducts[2];
      const updatedMockProduct = {
        ...mockProduct,
        inventoryCount: -2,
      };

      db.update.mockImplementation(() => ({
        set: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve(1)),
        })),
      }));

      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([updatedMockProduct])),
        })),
      }));

      const response = await request(app)
        .post('/api/inventory/update')
        .send({ productId: validProductId, quantity: 'invalid' });

      expect(response.status).toBe(400);
      expect(response.body).toEqual({
        error: 'Invalid input',
      });
    });

    it('should return a 404 if product not found', async () => {
      db.select.mockImplementation(() => ({
        from: jest.fn(() => ({
          where: jest.fn(() => Promise.resolve([])),
        })),
      }));

      const response = await request(app)
        .post('/api/inventory/update')
        .send({ productId: uuidv4(), quantity: 5 });

      expect(response.status).toBe(404);
      expect(response.body).toEqual({ error: 'Product not found' });
    });
  });
});
