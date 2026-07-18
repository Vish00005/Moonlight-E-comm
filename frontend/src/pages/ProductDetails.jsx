import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ShoppingCart, CreditCard } from 'lucide-react';
import { motion } from 'framer-motion';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import './ProductDetails.css';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useContext(CartContext);
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading) {
    return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Loading product details...</div>;
  }

  if (error) {
    return <div className="container" style={{ paddingTop: '120px', textAlign: 'center', color: 'red' }}>{error}</div>;
  }

  if (!product) {
    return <div className="container" style={{ paddingTop: '120px', textAlign: 'center' }}>Product not found</div>;
  }

  const handleBuyNow = () => {
    const orderItems = [{
      name: product.name,
      qty: 1,
      image: product.image,
      price: product.price,
      product: product._id
    }];
    navigate('/payment', { state: { orderItems, total: product.price } });
  };

  const getEstDeliveryDate = (days) => {
    return new Date(Date.now() + days * 24 * 60 * 60 * 1000).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
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
            {product.countInStock > 0 ? (
              <>
                <button className="btn-add-to-cart" onClick={() => addToCart(product)}>
                  <ShoppingCart size={20} />
                  Add to Cart
                </button>
                <button className="btn-buy-now" onClick={handleBuyNow}>
                  <CreditCard size={20} />
                  Buy Now
                </button>
              </>
            ) : (
              <p style={{ color: '#ef4444', fontWeight: '600', fontSize: '18px' }}>Out of Stock</p>
            )}
          </div>
          
          <div className="shipping-info">
            <p><strong>Estimated Delivery:</strong> {getEstDeliveryDate(3)} - {getEstDeliveryDate(5)}</p>
            <p><strong>Free Delivery</strong> on orders over ₹1000.</p>
            <p><strong>Returns:</strong> 30-day hassle-free return policy.</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductDetails;
