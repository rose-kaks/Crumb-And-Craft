
import express from 'express';

import {
  authorizeRoles,
  ROLES
} from '../middleware/rbac.js';

import {
  authenticateAny
} from '../middleware/authMiddleware.js';

const router = express.Router();

router.get(
  '/products',
  authenticateAny,
  authorizeRoles(
    ROLES.CUSTOMER,
    ROLES.VENDOR,
    ROLES.ADMIN
  ),
  (req, res) => {
    res.json({
      success: true,
      message: 'Product access granted.',
      role: req.user.role
    });
  }
);

router.post(
  '/products',
  authenticateAny,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Product creation permission granted.',
      role: req.user.role
    });
  }
);

router.patch(
  '/orders/:id/status',
  authenticateAny,
  authorizeRoles(ROLES.VENDOR, ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Order management permission granted.',
      role: req.user.role
    });
  }
);

router.get(
  '/admin',
  authenticateAny,
  authorizeRoles(ROLES.ADMIN),
  (req, res) => {
    res.json({
      success: true,
      message: 'Admin access granted.',
      role: req.user.role
    });
  }
);

export default router;
