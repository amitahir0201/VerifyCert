/**
 * Admin Seeder Script
 * Run once to create the default admin user:
 *   node seed.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
import Admin from './models/Admin.js';

dotenv.config();

const seed = async () => {
    await mongoose.connect(process.env.DB_URL);

    const existing = await Admin.findOne({ email: 'admin@certicreate.com' });
    if (existing) {
        console.log('Admin already exists:', existing.email);
        process.exit(0);
    }

    const hashedPassword = await bcrypt.hash('Admin@1234', 12);
    const admin = await Admin.create({
        name: 'Super Admin',
        email: 'admin@certicreate.com',
        password: hashedPassword,
        role: 'Admin',
    });

    console.log('✅ Admin created successfully!');
    console.log('   Email   :', admin.email);
    console.log('   Password: Admin@1234');
    console.log('\n⚠️  Change the password after first login in production!');
    process.exit(0);
};

seed().catch((err) => {
    console.error('Seeder error:', err);
    process.exit(1);
});
