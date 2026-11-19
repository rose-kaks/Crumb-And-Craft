
import express from 'express';
import { Offer } from '../models/BakeryModels.js';

const router = express.Router();

// GET available offers
router.get('/', async (req, res) => {
  try {
    const offers = await Offer.find({
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    res.json(offers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// VALIDATE COUPON
router.post('/validate', async (req, res) => {
  try {
    const { code, orderValue } = req.body;

    if (!code || !Number.isFinite(Number(orderValue)) ||
        Number(orderValue) < 0) {
      return res.status(400).json({
        success: false,
        message: 'Valid coupon code and order value are required'
      });
    }

    const offer = await Offer.findOne({
      code: code.trim().toUpperCase(),
      isActive: true,
      expiresAt: { $gt: new Date() }
    });

    if (!offer) {
      return res.status(404).json({
        success: false,
        message: 'Invalid or expired coupon'
      });
    }

    if (Number(orderValue) < offer.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `Minimum order value is ₹${offer.minOrderValue}`
      });
    }

    const discountAmount = Math.round(
      Number(orderValue) * offer.discountPercent / 100
    );

    res.json({
      success: true,
      message: 'Coupon applied successfully!',
      code: offer.code,
      discountPercent: offer.discountPercent,
      discountAmount,
      totalPayable: Number(orderValue) - discountAmount
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD offer
router.post('/', async (req, res) => {
  try {
    const offer = await Offer.create(req.body);

    res.status(201).json({
      message: 'Offer created successfully',
      offer
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
