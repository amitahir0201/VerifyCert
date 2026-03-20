import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import connectDB from './config/db.js';
import adminRoutes from './routes/adminRoutes.js';
import certificateRoutes from './routes/certificateRoutes.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Ensure uploads directory exists on startup
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Created uploads directory');
}

const app = express();

// Middleware
const frontendURL = (process.env.FRONTEND_URL || 'http://localhost:5173').replace(/\/$/, '');
app.use(cors({
    origin: [frontendURL, `${frontendURL}/`],
    credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded PDFs statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Database connection
connectDB();

// Routes
app.use('/api/admin', adminRoutes);
app.use('/api/certificates', certificateRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
