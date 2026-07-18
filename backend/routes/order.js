import express from 'express';
import { addOrderItems, getMyOrders, getOrders, getAnalytics, cancelOrder, updateOrderStatus } from '../controllers/orderController.js';
import { protect, admin } from '../middleware/authMiddleware.js';
const router = express.Router();

router.route('/').post(protect, addOrderItems).get(protect, admin, getOrders);
router.route('/myorders').get(protect, getMyOrders);
router.route('/analytics').get(protect, admin, getAnalytics);
router.route('/:id/cancel').put(protect, cancelOrder);
router.route('/:id/status').put(protect, admin, updateOrderStatus);

export default router;
