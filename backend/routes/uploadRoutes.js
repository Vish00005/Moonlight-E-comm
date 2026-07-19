import express from 'express';
import multer from 'multer';
import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';
import { protect, admin } from '../middleware/authMiddleware.js';

dotenv.config();

const router = express.Router();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post('/', protect, admin, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image provided' });
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      { folder: "kiki-tech-solutions" },
      (error, result) => {
        if (error) {
          console.error('Cloudinary Upload Error:', error);
          return res.status(500).json({ message: 'Error uploading image to Cloudinary' });
        }
        res.json({ url: result.secure_url });
      }
    );

    // Pipe the buffer to the Cloudinary upload stream
    uploadStream.end(req.file.buffer);

  } catch (error) {
    console.error('Upload Error:', error);
    res.status(500).json({ message: 'Error uploading image' });
  }
});

export default router;
