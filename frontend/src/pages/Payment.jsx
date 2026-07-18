import React, { useState } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle } from 'lucide-react';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const product = location.state?.product;
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  // If no product is passed, redirect back to home
  if (!product) {
    return <Navigate to="/" replace />;
  }

  const handlePaymentSubmit = (e) => {
    e.preventDefault();
    setIsProcessing(true);
    
    // Simulate API call to payment gateway
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      
      // Redirect to profile after showing success message
      setTimeout(() => {
        navigate('/profile');
      }, 2500);
    }, 2000);
  };

  return (
    <div className="container payment-page">
      {isSuccess ? (
        <motion.div 
          className="payment-success-card"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
        >
          <CheckCircle size={64} color="#10b981" className="success-icon" />
          <h2>Payment Successful!</h2>
          <p>Thank you for purchasing the <strong>{product.name}</strong>.</p>
          <p>Redirecting you to your profile...</p>
        </motion.div>
      ) : (
        <motion.div 
          className="payment-container"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="payment-summary">
            <h3>Order Summary</h3>
            <div className="summary-item">
              <img src={product.image} alt={product.name} />
              <div className="summary-info">
                <h4>{product.name}</h4>
                <span>₹{product.price.toFixed(2)}</span>
              </div>
            </div>
            <hr />
            <div className="summary-total">
              <span>Total to Pay</span>
              <strong>₹{product.price.toFixed(2)}</strong>
            </div>
          </div>
          
          <div className="payment-form-container">
            <h3>Payment Details</h3>
            <form onSubmit={handlePaymentSubmit} className="payment-form">
              <div className="form-group">
                <label>Cardholder Name</label>
                <input type="text" className="input-field" placeholder="John Doe" required />
              </div>
              <div className="form-group">
                <label>Card Number</label>
                <input type="text" className="input-field" placeholder="0000 0000 0000 0000" required />
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiry Date</label>
                  <input type="text" className="input-field" placeholder="MM/YY" required />
                </div>
                <div className="form-group">
                  <label>CVV</label>
                  <input type="password" className="input-field" placeholder="123" required maxLength="4" />
                </div>
              </div>
              <button type="submit" className="btn-primary btn-pay" disabled={isProcessing}>
                {isProcessing ? 'Processing...' : `Pay ₹${product.price.toFixed(2)}`}
              </button>
            </form>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Payment;
