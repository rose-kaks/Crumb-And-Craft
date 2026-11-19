
import express from 'express';
import { CakeProduct } from '../models/BakeryModels.js';

const router = express.Router();

// GET all products
router.get('/', async (req, res) => {
  try {
    const { flavor } = req.query;

    const filter = flavor
      ? { flavor: new RegExp(flavor, 'i') }
      : {};

    const products = await CakeProduct.find(filter);

    res.json({
      success: true,
      count: products.length,
      products
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await CakeProduct.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: 'Cake not found'
      });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD new product
router.post('/', async (req, res) => {
  try {
    const product = await CakeProduct.create(req.body);

    res.status(201).json({
      message: 'Cake added successfully',
      product
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
