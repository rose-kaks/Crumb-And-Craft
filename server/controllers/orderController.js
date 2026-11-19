import mongoose from 'mongoose';

import {
  CakeProduct,
  Offer,
  Order
} from '../models/BakeryModels.js';


// PLACE PRE-ORDER
export const placePreOrder = async (req, res, next) => {
  try {

    const {
      items,
      fulfillmentType,
      couponCode,
      shippingAddress,
      userId
    } = req.body;


    if (!mongoose.isValidObjectId(userId)) {
      return res.status(400).json({
        message: 'Valid userId is required'
      });
    }


    if (!['Delivery', 'Store Pickup'].includes(
      fulfillmentType || 'Delivery'
    )) {
      return res.status(400).json({
        message: 'Invalid fulfillment type'
      });
    }


    let subtotal = 0;

    const validatedItems = [];

    const now = new Date();


    for (const item of items) {

      const {
        productId,
        quantity,
        cakeMessage = '',
        isEggless = false,
        deliveryDate
      } = item;


      if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).json({
          message: 'Invalid product ID'
        });
      }


      const product =
        await CakeProduct.findById(productId);


      if (!product) {
        return res.status(404).json({
          message: 'Cake product not found'
        });
      }


      if (
        !Number.isInteger(quantity) ||
        quantity < 1 ||
        quantity > 20
      ) {
        return res.status(400).json({
          message: 'Invalid quantity'
        });
      }


      if (
        isEggless &&
        !product.supportsEggless
      ) {
        return res.status(400).json({
          message:
            `${product.title} is not available eggless`
        });
      }


      const date = new Date(deliveryDate);


      if (
        !deliveryDate ||
        Number.isNaN(date.getTime()) ||
        date <= now ||
        date.getTime() - now.getTime() <
          product.prepLeadHours *
          60 *
          60 *
          1000
      ) {
        return res.status(400).json({
          message:
            `Please select a delivery date at least ${product.prepLeadHours} hours ahead for ${product.title}`
        });
      }


      if (cakeMessage.length > 60) {
        return res.status(400).json({
          message:
            'Cake message cannot exceed 60 characters'
        });
      }


      subtotal +=
        product.price * quantity;


      validatedItems.push({
        productId: product._id,
        title: product.title,
        unitPrice: product.price,
        quantity,
        cakeMessage,
        isEggless,
        deliveryDate: date
      });
    }


    // Validate coupon on server
    let discountAmount = 0;
    let couponApplied = null;


    if (couponCode?.trim()) {

      const offer =
        await Offer.findOne({
          code:
            couponCode.trim().toUpperCase(),

          isActive: true,

          expiresAt: {
            $gt: new Date()
          }
        });


      if (!offer) {
        return res.status(400).json({
          message:
            'Invalid or expired coupon'
        });
      }


      if (
        subtotal < offer.minOrderValue
      ) {
        return res.status(400).json({
          message:
            `Minimum order value is ₹${offer.minOrderValue}`
        });
      }


      discountAmount =
        Math.round(
          subtotal *
          offer.discountPercent /
          100
        );


      couponApplied =
        offer.code;
    }


    const totalPayable =
      subtotal - discountAmount;


    const order =
      await Order.create({
        userId,
        items: validatedItems,
        fulfillmentType:
          fulfillmentType || 'Delivery',

        couponApplied,
        discountAmount,
        totalPayable,

        shippingAddress,

        orderStatus:
          'Pre-Order Placed'
      });


    res.status(201).json({
      success: true,
      message:
        'Pre-order placed successfully!',

      subtotal,
      discountAmount,
      totalPayable,

      order
    });

  } catch (error) {
    next(error);
  }
};


// GET ALL ORDERS FOR USER
export const getUserOrders = async (
  req,
  res,
  next
) => {

  try {

    if (
      !mongoose.isValidObjectId(
        req.params.userId
      )
    ) {
      return res.status(400).json({
        message: 'Invalid user ID'
      });
    }


    const orders =
      await Order.find({
        userId:
          req.params.userId
      })
      .sort({
        createdAt: -1
      });


    res.json(orders);

  } catch (error) {
    next(error);
  }
};


// UPDATE ORDER STATUS
export const updateOrderStatus = async (
  req,
  res,
  next
) => {

  try {

    const allowedStatuses = [
      'Pre-Order Placed',
      'Baking in Progress',
      'Out for Delivery',
      'Completed',
      'Cancelled'
    ];


    const {
      orderStatus
    } = req.body;


    if (
      !allowedStatuses.includes(
        orderStatus
      )
    ) {
      return res.status(400).json({
        message:
          'Invalid order status'
      });
    }


    const order =
      await Order.findByIdAndUpdate(
        req.params.id,

        {
          orderStatus
        },

        {
          returnDocument: 'after',
          runValidators: true
        }
      );


    if (!order) {
      return res.status(404).json({
        message:
          'Order not found'
      });
    }


    res.json({
      message:
        'Order status updated',

      order
    });

  } catch (error) {
    next(error);
  }
};