import express from 'express';
import { addOrderItems, getMyOrders, getOrders, getAnalytics } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/analytics').get(protect, admin, getAnalytics);

export default router;
