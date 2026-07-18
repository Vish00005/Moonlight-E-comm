import Product from '../models/Product.js';

export const getProducts = async (req, res) => {
  try {
    const products = await Product.find({}).populate('category', 'name');
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name');
    if (product) {
      res.json(product);
    } else {
      res.status(404).json({ message: 'Product not found' });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Admin only
export const createProduct = async (req, res) => {
  try {
    const { name, price, description, image, category, countInStock } = req.body;
    const product = new Product({
      name, price, description, image, category, countInStock
    });
    const createdProduct = await product.save();
    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
