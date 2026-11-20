import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';

import productRoutes from './routes/productRoutes.js';
import offerRoutes from './routes/offerRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import rbacRoutes from './routes/rbacRoutes.js';
import authRoutes from './routes/authRoutes.js';

import sessionMiddleware from './config/session.js';

import {
  requestLogger,
  globalErrorHandler
} from './middleware/pipeline.js';

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173',
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// MIDDLEWARE
// app.use(cors({
//   origin:
//     process.env.CLIENT_URL ||
//     'http://localhost:5173'
// }));

app.use(express.json());
app.use(cookieParser());
app.use(sessionMiddleware);


// REQUEST LOGGER
app.use(requestLogger);

// DATABASE CONNECTION
mongoose.connect(
  process.env.MONGO_URI,
  {
    dbName:
      'crumb_and_craft_db'
  }
)
.then(() => {
  console.log(
    '[DB] Connected to Crumb & Craft MongoDB'
  );
})
.catch((error) => {
  console.error(
    '[DB] Connection failed:',
    error.message
  );
});


// HEALTH CHECK
app.get(
  '/api/health',
  (req, res) => {

    res.json({
      status: 'OK',
      service:
        'Crumb & Craft Bakery API'
    });

  }
);

// AUTHENTICATION
app.use('/api/auth', authRoutes);

// EXISTING API ROUTES
app.use('/api/products', productRoutes);
app.use('/api/offers', offerRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/rbac', rbacRoutes);


// GLOBAL ERROR HANDLER
app.use(
  globalErrorHandler
);


const PORT =
  process.env.PORT || 5000;

app.listen(
  PORT,
  () => {
    console.log(
      `[SERVER] Listening on http://localhost:${PORT}`
    );
  }
);
