import express from 'express';
import { registerUser, authUser, updateUserProfile, googleLogin } from '../controllers/authController.js';
const router = express.Router();

import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/google', googleLogin);
router.put('/profile', protect, updateUserProfile);

export default router;
