
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// 1. JWT authentication using Authorization header
export const verifyJWT = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader?.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'JWT token required.'
      });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired JWT.'
    });
  }
};


// 2. JWT authentication using HTTP-Only cookie
export const verifyCookieJWT = async (req, res, next) => {
  try {
    const token = req.cookies?.cc_auth;

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Authentication cookie required.'
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.sub);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Invalid or expired authentication cookie.'
    });
  }
};


// 3. Server-side session authentication
export const verifySession = async (req, res, next) => {
  try {
    const userId = req.session?.userId;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'No active session found.'
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'User no longer exists.'
      });
    }

    req.user = user;
    next();

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Session verification failed.'
    });
  }
};


export const authenticateAny = (req, res, next) => {
  if (req.headers.authorization?.startsWith('Bearer ')) {
    return verifyJWT(req, res, next);
  }

  if (req.cookies?.cc_auth) {
    return verifyCookieJWT(req, res, next);
  }

  if (req.session?.userId) {
    return verifySession(req, res, next);
  }

  return res.status(401).json({
    success: false,
    message: 'Authentication required.'
  });
};
