
import express from 'express';
import User from '../models/User.js';
import { generateToken } from '../utils/generateToken.js';

import {
  verifyJWT,
  verifyCookieJWT,
  verifySession
} from '../middleware/authMiddleware.js';

const router = express.Router();

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role
});

const cookieOptions = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  maxAge: 60 * 60 * 1000,
  path: '/'
};


// REGISTER CUSTOMER
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required.'
      });
    }

    if (password.length < 8) {
      return res.status(400).json({
        success: false,
        message: 'Password must contain at least 8 characters.'
      });
    }

    const existingUser = await User.findOne({
      email: email.toLowerCase().trim()
    });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Email is already registered.'
      });
    }

    // Public registration always creates a customer
    const user = await User.create({
      name,
      email,
      password,
      role: 'customer'
    });

    res.status(201).json({
      success: true,
      message: 'Registration successful.',
      user: publicUser(user)
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Registration failed.'
    });
  }
});


// LOGIN - THREE SESSION METHODS
router.post('/login', async (req, res) => {
  try {
    const { email, password, mode } = req.body;

    if (!email || !password || !mode) {
      return res.status(400).json({
        success: false,
        message: 'Email, password and authentication mode are required.'
      });
    }

    if (!['jwt', 'cookie', 'session'].includes(mode)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid authentication mode.'
      });
    }

    const user = await User.findOne({
      email: email.toLowerCase().trim()
    }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password.'
      });
    }

    const safeUser = publicUser(user);

    // METHOD 1: JWT
    if (mode === 'jwt') {
      const token = generateToken(user);

      return res.json({
        success: true,
        message: 'JWT login successful.',
        mode,
        user: safeUser,
        token
      });
    }

    // METHOD 2: HTTP-ONLY COOKIE CONTAINING JWT
    if (mode === 'cookie') {
      const token = generateToken(user);

      res.cookie('cc_auth', token, cookieOptions);

      return res.json({
        success: true,
        message: 'HTTP-Only Cookie login successful.',
        mode,
        user: safeUser
      });
    }

    // METHOD 3: SERVER-SIDE SESSION
    if (mode === 'session') {
      return req.session.regenerate((error) => {
        if (error) {
          return res.status(500).json({
            success: false,
            message: 'Could not create session.'
          });
        }

        req.session.userId = user._id.toString();

        req.session.save((saveError) => {
          if (saveError) {
            return res.status(500).json({
              success: false,
              message: 'Could not save session.'
            });
          }

          return res.json({
            success: true,
            message: 'Server-side session login successful.',
            mode,
            user: safeUser
          });
        });
      });
    }

  } catch (error) {
    console.error('[AUTH LOGIN]', error.message);

    res.status(500).json({
      success: false,
      message: 'Login failed.'
    });
  }
});


// CHECK JWT AUTHENTICATION
router.get('/me/jwt', verifyJWT, (req, res) => {
  res.json({
    success: true,
    mode: 'jwt',
    user: publicUser(req.user)
  });
});


// CHECK COOKIE AUTHENTICATION
router.get('/me/cookie', verifyCookieJWT, (req, res) => {
  res.json({
    success: true,
    mode: 'cookie',
    user: publicUser(req.user)
  });
});


// CHECK SERVER-SIDE SESSION
router.get('/me/session', verifySession, (req, res) => {
  res.json({
    success: true,
    mode: 'session',
    user: publicUser(req.user)
  });
});


// LOGOUT - JWT
router.post('/logout/jwt', (req, res) => {
  res.json({
    success: true,
    message: 'JWT logout. Client must discard its token.'
  });
});


// LOGOUT - COOKIE
router.post('/logout/cookie', (req, res) => {
  res.clearCookie('cc_auth', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  });

  res.json({
    success: true,
    message: 'Cookie authentication ended.'
  });
});


// LOGOUT - SERVER-SIDE SESSION
router.post('/logout/session', (req, res) => {
  if (!req.session) {
    return res.json({
      success: true,
      message: 'No active session.'
    });
  }

  req.session.destroy((error) => {
    if (error) {
      return res.status(500).json({
        success: false,
        message: 'Could not destroy session.'
      });
    }

    res.clearCookie('crumb.sid', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/'
    });

    res.json({
      success: true,
      message: 'Server-side session destroyed.'
    });
  });
});

export default router;
