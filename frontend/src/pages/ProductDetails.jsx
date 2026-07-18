import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import { CartContext } from '../context/CartContext';
import { products } from '../data/products';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);

  useEffect(() => {
    // In a real app, this would be an API call to /api/products/:id
    const foundProduct = products.find(p => p._id === id);
    setProduct(foundProduct);
  }, [id]);

  if (!product) {
    return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading...</div>;
  }

  const handleBuyNow = () => {
    navigate('/payment', { state: { product } });
  };

  return (
    <motion.div 
      className="container product-details-page"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="product-details-container">
        <div className="product-image-container">
          <img src={product.image} alt={product.name} />
        </div>
        
        <div className="product-info-container">
          <span className="product-category">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>
          <p className="product-price-large">₹{product.price.toFixed(2)}</p>
          
          <div className="product-description-block">
            <h3>Description</h3>
            <p>{product.description}</p>
          </div>
          
          <div className="product-actions">
            <button className="btn-add-to-cart" onClick={() => addToCart(product)}>
              <ShoppingCart size={20} />
              Add to Cart
            </button>
            <button className="btn-buy-now" onClick={handleBuyNow}>
              <CreditCard size={20} />
              Buy Now
            </button>
          </div>
          
          <div className="shipping-info">
            <p><strong>Free Delivery</strong> on orders over ₹1000.</p>
            <p><strong>Returns:</strong> 30-day hassle-free return policy.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
