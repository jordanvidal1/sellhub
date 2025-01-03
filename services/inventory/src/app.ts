import express from 'express';
import inventoryRoutes from './routes/inventory';
import dotenv from 'dotenv';

dotenv.config();

const app = express();

// Middleware
app.use(express.json());

// Routes
app.use('/inventory', inventoryRoutes);

export default app;
