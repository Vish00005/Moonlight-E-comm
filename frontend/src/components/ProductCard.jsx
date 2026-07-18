import React, { useContext } from 'react';
import { ShoppingCart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import './ProductCard.css';

const ProductCard = ({ product }) => {
  const { addToCart } = useContext(CartContext);

  return (
    <motion.div 
      className="product-card"
      whileHover={{ y: -8 }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
    >
      <Link to={`/product/${product._id}`}>
        <div className="product-img">
          <img src={product.image} alt={product.name} />
        </div>
      </Link>
      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <h3>{product.name}</h3>
        </Link>
        <p className="product-price">₹{product.price.toFixed(2)}</p>
        <button className="btn-add-cart" onClick={() => addToCart(product)}>
          <ShoppingCart size={18} />
          Add to Cart
        </button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
