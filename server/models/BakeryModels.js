
import mongoose from 'mongoose';

// 1. CAKE PRODUCT SCHEMA
const cakeProductSchema = new mongoose.Schema({
  sku: {
    type: String,
    required: true,
    unique: true
  },
  title: {
    type: String,
    required: true,
    trim: true
  },
  flavor: {
    type: String,
    required: true,
    index: true
  },
  weightKg: {
    type: Number,
    required: true,
    default: 0.5,
    enum: [0.5, 1, 2]
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  supportsEggless: {
    type: Boolean,
    default: true
  },
  prepLeadHours: {
    type: Number,
    default: 24
  },
  imageUrl: {
    type: String,
    required: true
  }
}, { timestamps: true });


// 2. OFFER SCHEMA
const offerSchema = new mongoose.Schema({
  code: {
    type: String,
    required: true,
    unique: true,
    uppercase: true,
    trim: true
  },
  discountPercent: {
    type: Number,
    required: true,
    min: 1,
    max: 90
  },
  minOrderValue: {
    type: Number,
    default: 0
  },
  expiresAt: {
    type: Date,
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, { timestamps: true });


// 3. ORDER SCHEMA
const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },

  items: [{
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CakeProduct',
      required: true
    },
    title: {
      type: String,
      required: true
    },
    unitPrice: {
      type: Number,
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 1
    },
    cakeMessage: {
      type: String,
      trim: true,
      maxlength: 60,
      default: ''
    },
    isEggless: {
      type: Boolean,
      required: true,
      default: false
    },
    deliveryDate: {
      type: Date,
      required: true
    }
  }],

  fulfillmentType: {
    type: String,
    enum: ['Delivery', 'Store Pickup'],
    default: 'Delivery'
  },

  couponApplied: {
    type: String,
    default: null
  },

  discountAmount: {
    type: Number,
    default: 0
  },

  totalPayable: {
    type: Number,
    required: true
  },

  shippingAddress: {
    street: String,
    city: String,
    postalCode: String,
    phone: String
  },

  orderStatus: {
    type: String,
    enum: [
      'Pre-Order Placed',
      'Baking in Progress',
      'Out for Delivery',
      'Completed',
      'Cancelled'
    ],
    default: 'Pre-Order Placed'
  }

}, { timestamps: true });


// Avoid OverwriteModelError during development
const CakeProduct =
  mongoose.models.CakeProduct ||
  mongoose.model('CakeProduct', cakeProductSchema);

const Offer =
  mongoose.models.Offer ||
  mongoose.model('Offer', offerSchema);

const Order =
  mongoose.models.Order ||
  mongoose.model('Order', orderSchema);

export { CakeProduct, Offer, Order };
