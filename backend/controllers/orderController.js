import Order from '../models/Order.js';
import Product from '../models/Product.js';

export const addOrderItems = async (req, res) => {
  try {
    const { orderItems, totalPrice } = req.body;
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
        totalPrice
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
    const orders = await Order.find({ user: req.user._id });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only
export const getOrders = async (req, res) => {
  try {
    const orders = await Order.find({}).populate('user', 'id name');
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only Analytics
export const getAnalytics = async (req, res) => {
  try {
    const orders = await Order.find({});
    const totalRevenue = orders.reduce((sum, order) => sum + order.totalPrice, 0);
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
