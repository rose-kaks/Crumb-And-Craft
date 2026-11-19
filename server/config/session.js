import 'dotenv/config';
import session from 'express-session';
import MongoStore from 'connect-mongo';

const sessionMiddleware = session({
  name: 'crumb.sid',

  secret: process.env.SESSION_SECRET,

  resave: false,

  saveUninitialized: false,

  store: MongoStore.create({
    mongoUrl: process.env.MONGO_URI,
    dbName: 'crumb_and_craft_db',
    collectionName: 'sessions',
    ttl: 60 * 60
  }),

  cookie: {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 60 * 1000
  }
});

export default sessionMiddleware;
