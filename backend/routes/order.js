import express from 'express';
import { addOrderItems, getMyOrders, getOrders } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/mine').get(protect, getMyOrders);

export default router;
