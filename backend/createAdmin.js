import mongoose from 'mongoose';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import User from './models/User.js';

dotenv.config();

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB');

    const adminExists = await User.findOne({ email: 'admin@moonlight.com' });
    if (adminExists) {
      console.log('Admin already exists.');
      process.exit();
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash('admin123', salt);

    await User.create({
      name: 'Admin User',
      email: 'admin@moonlight.com',
      password: hashedPassword,
      isAdmin: true,
    });

    console.log('Admin user created successfully!');
    process.exit();
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
