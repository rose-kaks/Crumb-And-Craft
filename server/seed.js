
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { CakeProduct, Offer } from './models/BakeryModels.js';

dotenv.config();

await mongoose.connect(process.env.MONGO_URI, {
  dbName: 'crumb_and_craft_db'
});

const products = [
  {
    sku: 'CC001',
    title: 'Belgian Dark Chocolate Truffle',
    flavor: 'Chocolate',
    weightKg: 1,
    price: 1450,
    supportsEggless: true,
    prepLeadHours: 24,
    imageUrl: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800'
  },
  {
    sku: 'CC002',
    title: 'Classic Red Velvet',
    flavor: 'Red Velvet',
    weightKg: 1,
    price: 1250,
    supportsEggless: true,
    prepLeadHours: 24,
    imageUrl: 'https://images.unsplash.com/photo-1586788680434-30d324b2d46f?w=800'
  },
  {
    sku: 'CC003',
    title: 'Strawberry Fresh Cream',
    flavor: 'Strawberry',
    weightKg: 0.5,
    price: 750,
    supportsEggless: true,
    prepLeadHours: 24,
    imageUrl: 'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=800'
  },
  {
    sku: 'CC004',
    title: 'Vanilla Celebration Cake',
    flavor: 'Vanilla',
    weightKg: 2,
    price: 2200,
    supportsEggless: true,
    prepLeadHours: 48,
    imageUrl: 'https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?w=800'
  }
];

const offers = [
  {
    code: 'BDAY10',
    discountPercent: 10,
    minOrderValue: 500,
    expiresAt: new Date('2027-12-31T23:59:59'),
    isActive: true
  },
  {
    code: 'SWEET15',
    discountPercent: 15,
    minOrderValue: 1500,
    expiresAt: new Date('2027-12-31T23:59:59'),
    isActive: true
  }
];

try {
  for (const product of products) {
    await CakeProduct.findOneAndUpdate(
      { sku: product.sku },
      product,
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
  }

  for (const offer of offers) {
    await Offer.findOneAndUpdate(
      { code: offer.code },
      offer,
      { upsert: true, returnDocument: 'after', runValidators: true }
    );
  }

  console.log('Bakery products and offers seeded successfully!');
} catch (error) {
  console.error(error);
} finally {
  await mongoose.disconnect();
}
