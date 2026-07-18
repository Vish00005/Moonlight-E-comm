import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import fs from 'fs';
import { protect, admin } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "kiki-tech-solutions"
    }); 
    
    // Clean up local file after upload
    try {
      fs.unlinkSync(req.file.path);
    } catch (err) {
      console.error('Failed to clean up file:', err);
    }
    
    res.json({ url: result.secure_url });
  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

export default router;
