
import express from 'express';
import { authorizeRoles, ROLES } from '../middleware/rbac.js';

const router = express.Router();

// Accessible to all three roles
router.get(
  '/products',
  authorizeRoles(
    ROLES.CUSTOMER,
    ROLES.VENDOR,
    ROLES.ADMIN
  ),
  (req, res) => {
    res.json({
      success: true,
      message: 'You can view bakery products.',
      role: req.user.role
    });
  }
);

// Only vendors and admins can add cakes
router.post(
  '/products',
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Cake creation permission granted.',
      role: req.user.role
    });
  }
);

// Only vendors and admins can manage orders
router.patch(
  '/orders/:id/status',
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Order management permission granted.',
      role: req.user.role
    });
  }
);

// Only admins can access administrative operations
router.get(
  '/admin',
  authorizeRoles(ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Welcome to the admin panel.',
      role: req.user.role
    });
  }
);

export default router;
