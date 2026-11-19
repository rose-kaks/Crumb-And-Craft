
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from './models/User.js';

dotenv.config();

const demoUsers = [
  {
    name: 'Demo Baker',
    email: process.env.DEMO_VENDOR_EMAIL,
    password: process.env.DEMO_VENDOR_PASSWORD,
    role: 'vendor'
  },
  {
    name: 'Demo Administrator',
    email: process.env.DEMO_ADMIN_EMAIL,
    password: process.env.DEMO_ADMIN_PASSWORD,
    role: 'admin'
  }
];

async function seedUsers() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: 'crumb_and_craft_db'
    });

    for (const data of demoUsers) {
      if (!data.email || !data.password) {
        console.log(`Skipping ${data.role}: credentials not configured.`);
        continue;
      }

      let user = await User.findOne({
        email: data.email.toLowerCase()
      });

      if (!user) {
        user = new User(data);
      } else {
        user.name = data.name;
        user.password = data.password;
        user.role = data.role;
      }

      await user.save();

      console.log(`${data.role} account ready: ${data.email}`);
    }

    console.log('Demo accounts initialized.');

  } catch (error) {
    console.error('User seeding failed:', error.message);
  } finally {
    await mongoose.disconnect();
  }
}

seedUsers();
