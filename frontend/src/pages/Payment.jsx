import React, { useState, useContext, useEffect } from 'react';
import { useLocation, useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CheckCircle, Truck, CreditCard, ArrowRight, ArrowLeft } from 'lucide-react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Payment.css';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const orderItems = location.state?.orderItems;
  const total = location.state?.total;
  
  const { user, updateProfile } = useContext(AuthContext);
  const { clearCart } = useContext(CartContext);
  
  const [step, setStep] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const [paymentMethod, setPaymentMethod] = useState('Razorpay');
  const [deliveryInfo, setDeliveryInfo] = useState({
    address: '', city: '', postalCode: '', country: '', phone: ''
  });

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setDeliveryInfo({
        address: user.address || '',
        city: user.city || '',
        postalCode: user.postalCode || '',
        country: user.country || '',
        phone: user.phone || ''
      });
    }
  }, [user, navigate]);

  if (!orderItems || !user) {
    return <Navigate to="/" replace />;
  }

  const handleAddressSubmit = async (e) => {
    e.preventDefault();
    if (deliveryInfo.address !== user.address || deliveryInfo.city !== user.city) {
      await updateProfile({ ...user, ...deliveryInfo });
    }
    setStep(2);
  };

  const handleOrderSubmit = async () => {
    setIsProcessing(true);
    const config = { headers: { Authorization: `Bearer ${user.token}` } };

    try {
      if (paymentMethod === 'COD') {
        await axios.post('/api/orders', { orderItems, totalPrice: total, paymentMethod: 'COD' }, config);
        showSuccess();
      } else {
        const { data: configData } = await axios.get('/api/payment/config');
        const { data: orderData } = await axios.post('/api/payment/create', { amount: total }, config);

        const options = {
          key: configData.clientId,
          amount: orderData.amount,
          currency: orderData.currency,
          name: "MoonLight Jewels",
          description: "Purchase Transaction",
          order_id: orderData.id,
          handler: async function (response) {
            try {
              const verifyRes = await axios.post('/api/payment/verify', response, config);
              if (verifyRes.status === 200) {
                await axios.post('/api/orders', { 
                  orderItems, 
                  totalPrice: total, 
                  paymentMethod: 'Razorpay',
                  isPaid: true,
                  paidAt: new Date(),
                  paymentResult: {
                    id: response.razorpay_payment_id,
                    status: 'paid',
                    update_time: new Date().toISOString()
                  }
                }, config);
                showSuccess();
              }
            } catch (err) {
              alert('Payment Verification Failed!');
              setIsProcessing(false);
            }
          },
          prefill: { name: user.name, email: user.email, contact: deliveryInfo.phone },
          theme: { color: "#1a1a1a" }
        };

        const rzp = new window.Razorpay(options);
        rzp.on('payment.failed', function (response) {
          alert("Payment Failed: " + response.error.description);
          setIsProcessing(false);
        });
        rzp.open();
      }
    } catch (error) {
      alert(error.response?.data?.message || 'Error processing order');
      setIsProcessing(false);
    }
  };

  const showSuccess = () => {
    setIsProcessing(false);
    setIsSuccess(true);
    clearCart();
    setTimeout(() => navigate('/profile'), 3000);
  };

  return (
    <div className="container payment-page">
      {isSuccess ? (
        <motion.div className="payment-success-card" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle size={64} color="#10b981" className="success-icon" />
          <h2>Order Placed Successfully!</h2>
          <p>Thank you for shopping at MoonLight Jewels.</p>
          <p>Redirecting you to your profile...</p>
        </motion.div>
      ) : (
        <motion.div className="payment-container" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <div className="payment-summary">
            <h3>Order Summary</h3>
            <div className="summary-items-list" style={{ maxHeight: '300px', overflowY: 'auto', paddingRight: '10px' }}>
              {orderItems.map((item, index) => (
                <div key={index} className="summary-item" style={{ marginBottom: '15px' }}>
                  <img src={item.image} alt={item.name} />
                  <div className="summary-info">
                    <h4>{item.name}</h4>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qty: {item.qty}</span>
                    <span>₹{(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              ))}
            </div>
            <hr />
            <div className="summary-total">
              <span>Total to Pay</span>
              <strong>₹{total?.toFixed(2)}</strong>
            </div>
          </div>
          
          <div className="payment-form-container">
            <div className="checkout-steps">
              <div className={`step ${step >= 1 ? 'active' : ''}`}>1. Address</div>
              <div className={`step ${step >= 2 ? 'active' : ''}`}>2. Payment</div>
            </div>

            {step === 1 && (
              <form onSubmit={handleAddressSubmit} className="payment-form">
                <h3>Delivery Details</h3>
                <div className="form-group">
                  <label>Phone Number</label>
                  <input type="text" className="input-field" value={deliveryInfo.phone} onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Address</label>
                  <input type="text" className="input-field" value={deliveryInfo.address} onChange={e => setDeliveryInfo({...deliveryInfo, address: e.target.value})} required />
                </div>
                <div className="form-row">
                  <div className="form-group">
                    <label>City</label>
                    <input type="text" className="input-field" value={deliveryInfo.city} onChange={e => setDeliveryInfo({...deliveryInfo, city: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Postal Code</label>
                    <input type="text" className="input-field" value={deliveryInfo.postalCode} onChange={e => setDeliveryInfo({...deliveryInfo, postalCode: e.target.value})} required />
                  </div>
                </div>
                <div className="form-group">
                  <label>Country</label>
                  <input type="text" className="input-field" value={deliveryInfo.country} onChange={e => setDeliveryInfo({...deliveryInfo, country: e.target.value})} required />
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
                  Continue to Payment <ArrowRight size={18} style={{ marginLeft: '8px' }} />
                </button>
              </form>
            )}

            {step === 2 && (
              <div className="payment-form">
                <h3>Select Payment Method</h3>
                <div className="payment-methods">
                  <label className={`method-card ${paymentMethod === 'Razorpay' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="Razorpay" checked={paymentMethod === 'Razorpay'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <CreditCard size={24} />
                    <span>Online Payment (Razorpay)</span>
                  </label>
                  <label className={`method-card ${paymentMethod === 'COD' ? 'selected' : ''}`}>
                    <input type="radio" name="paymentMethod" value="COD" checked={paymentMethod === 'COD'} onChange={(e) => setPaymentMethod(e.target.value)} />
                    <Truck size={24} />
                    <span>Cash on Delivery</span>
                  </label>
                </div>

                <div className="form-actions" style={{ display: 'flex', gap: '15px', marginTop: '30px' }}>
                  <button type="button" className="btn-secondary" onClick={() => setStep(1)} disabled={isProcessing} style={{ flex: 1 }}>
                    <ArrowLeft size={18} style={{ marginRight: '8px' }} /> Back
                  </button>
                  <button type="button" className="btn-primary btn-pay" onClick={handleOrderSubmit} disabled={isProcessing} style={{ flex: 2 }}>
                    {isProcessing ? 'Processing...' : `Place Order (₹${total?.toFixed(2)})`}
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Payment;
