import express from 'express';

import {
  validatePreOrderPayload
} from '../middleware/pipeline.js';

import {
  placePreOrder,
  getUserOrders,
  updateOrderStatus
} from '../controllers/orderController.js';

const router = express.Router();


// PLACE PRE-ORDER
router.post(
  '/pre-order',
  validatePreOrderPayload,
  placePreOrder
);


// GET ALL ORDERS FOR USER
router.get(
  '/user/:userId',
  getUserOrders
);


// UPDATE ORDER STATUS
router.patch(
  '/:id/status',
  updateOrderStatus
);


export default router;