import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice, paymentMethod, isPaid, paidAt, paymentResult } = req.body;
    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({ message: 'No order items' });
    } else {
      // Decrease stock
      for (const item of orderItems) {
        const product = await Product.findById(item.product);
        if (product) {
          product.countInStock = Math.max(0, product.countInStock - item.qty);
          await product.save();
        }
      }

      const order = new Order({
        orderItems,
        user: req.user._id,
        totalPrice,
        paymentMethod,
        isPaid: isPaid || false,
        paidAt,
        paymentResult
      });
      const createdOrder = await order.save();
      res.status(201).json(createdOrder);
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });
    
    // Check if user owns the order
    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    if (order.deliveryStatus === 'Shipped' || order.deliveryStatus === 'Delivered') {
      return res.status(400).json({ message: 'Cannot cancel shipped orders' });
    }

    order.deliveryStatus = 'Cancelled';
    await order.save();

    // Restore stock
    for (const item of order.orderItems) {
      const product = await Product.findById(item.product);
      if (product) {
        product.countInStock += item.qty;
        await product.save();
      }
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name email').sort({ createdAt: -1 });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ message: 'Order not found' });

    order.deliveryStatus = req.body.status;
    if (req.body.status === 'Delivered') {
      order.deliveredAt = Date.now();
    }
    await order.save();
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only Analytics
export const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => {
      // Don't count cancelled orders in revenue
      return order.deliveryStatus !== 'Cancelled' ? sum + order.totalPrice : sum;
    }, 0);
    const totalOrders = orders.length;
    
    const totalProducts = await Product.countDocuments({});
    
    res.json({
      totalRevenue,
      totalOrders,
      totalProducts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
