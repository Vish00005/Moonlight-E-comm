import express from 'express';
import { createOrder, verifyPayment } from '../controllers/paymentController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/config', (req, res) => res.json({ clientId: process.env.RAZORPAY_KEY_ID }));
router.post('/create', protect, createOrder);
router.post('/verify', protect, verifyPayment);

export default router;
