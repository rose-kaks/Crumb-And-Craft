// server/middleware/pipeline.js

export const requestLogger = (req, res, next) => {
  const timestamp = new Date().toISOString();

  console.log(
    `[${timestamp}] ${req.method} ${req.originalUrl}`
  );

  next();
};


export const validatePreOrderPayload = (req, res, next) => {
  const {
    items,
    userId
  } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: 'userId is required'
    });
  }

  if (!Array.isArray(items) || items.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Your cart is empty'
    });
  }

  next();
};


export const globalErrorHandler = (
  err,
  req,
  res,
  next
) => {
  console.error('[ERROR]', err.message);

  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal Server Error'
  });
};