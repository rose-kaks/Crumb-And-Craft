import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
dotenv.config();
const app = express();
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json());
mongoose.connect(process.env.MONGO_URI, { dbName: 'crumb_and_craft_db' })
.then(() => console.log('[DB] Connected to Crumb & Craft MongoDB Cluster'))
.catch((err) => console.error('[DB] Connection failed:', err.message));
app.get('/api/health', (req, res) => {
res.status(200).json({ status: 'OK', service: 'Crumb & Craft Bakery API' });
});
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`[SERVER] Listening on
http://localhost:${PORT}`));