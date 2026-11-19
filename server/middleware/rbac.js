
const ROLES = {
  CUSTOMER: 'customer',
  VENDOR: 'vendor',
  ADMIN: 'admin'
};

export { ROLES };

export const authorizeRoles = (...allowedRoles) => {
  return (req, res, next) => {
    // Temporary role simulation for Experiment 6
    const userRole = req.headers['x-user-role'];

    // Check whether a role was provided
    if (!userRole) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. User role not provided.'
      });
    }

    // Validate the role
    if (!Object.values(ROLES).includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. Invalid user role.'
      });
    }

    // Check permissions
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({
        success: false,
        message: `Access denied. ${userRole} cannot perform this action.`
      });
    }

    req.user = { role: userRole };

    next();
  };
};
