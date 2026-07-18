import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout, updateProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [city, setCity] = useState('');
  const [postalCode, setPostalCode] = useState('');
  const [country, setCountry] = useState('');
  
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (!user) {
      navigate('/login');
    } else {
      setName(user.name || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
      setAddress(user.address || '');
      setCity(user.city || '');
      setPostalCode(user.postalCode || '');
      setCountry(user.country || '');
      
      const fetchOrders = async () => {
        try {
          const config = { headers: { Authorization: `Bearer ${user.token}` } };
          const { data } = await axios.get('/api/orders/myorders', config);
          setOrders(data);
        } catch (error) {
          console.error('Error fetching orders:', error);
        }
      };
      fetchOrders();
    }
  }, [user, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    const res = await updateProfile({ name, email, phone, address, city, postalCode, country });
    if (res.success) {
      setMessage('Profile Updated Successfully');
      setTimeout(() => setMessage(''), 3000);
    } else {
      setMessage(res.message);
    }
  };

  const handleCancelOrder = async (orderId) => {
    if (window.confirm('Are you sure you want to cancel this order?')) {
      try {
        const config = { headers: { Authorization: `Bearer ${user.token}` } };
        await axios.put(`/api/orders/${orderId}/cancel`, {}, config);
        // Refresh orders
        const { data } = await axios.get('/api/orders/myorders', config);
        setOrders(data);
      } catch (err) {
        alert(err.response?.data?.message || 'Error cancelling order');
      }
    }
  };

  if (!user) return null;

  return (
    <div className="container profile-page">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        
        <form className="profile-form" onSubmit={submitHandler}>
          <h4>Update Delivery Details</h4>
          {message && <div className={message.includes('Success') ? 'message success' : 'message error'}>{message}</div>}
          <div className="form-group">
            <label>Name</label>
            <input type="text" className="input-field" value={name} onChange={(e) => setName(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Phone Number</label>
            <input type="text" className="input-field" value={phone} onChange={(e) => setPhone(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Address</label>
            <input type="text" className="input-field" value={address} onChange={(e) => setAddress(e.target.value)} />
          </div>
          <div className="form-row">
            <div className="form-group">
              <label>City</label>
              <input type="text" className="input-field" value={city} onChange={(e) => setCity(e.target.value)} />
            </div>
            <div className="form-group">
              <label>Postal Code</label>
              <input type="text" className="input-field" value={postalCode} onChange={(e) => setPostalCode(e.target.value)} />
            </div>
          </div>
          <div className="form-group">
            <label>Country</label>
            <input type="text" className="input-field" value={country} onChange={(e) => setCountry(e.target.value)} />
          </div>
          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>Update Profile</button>
        </form>
        
        <button onClick={logout} className="btn-logout mt-20">Logout</button>
        {user.isAdmin && (
          <button onClick={() => navigate('/admin-moonlight-secret')} className="btn-primary mt-20">
            Admin Dashboard
          </button>
        )}
      </div>
      <div className="profile-content">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders. Start shopping!</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h4>Order #{order._id.substring(0, 8)}</h4>
                  <span className={`status ${order.deliveryStatus?.toLowerCase()}`}>
                    {order.deliveryStatus || (order.isDelivered ? 'Delivered' : 'Ordered')}
                  </span>
                </div>
                <p>Date: {new Date(order.createdAt).toLocaleDateString()}</p>
                <p className="order-total">Total: ₹{order.totalPrice.toFixed(2)}</p>
                
                <div className="order-items-preview">
                  {order.orderItems.map((item, index) => (
                    <div key={index} className="preview-item">
                      <img src={item.image} alt={item.name} />
                      <div className="preview-info">
                        <span className="preview-name">{item.name}</span>
                        <span className="preview-qty">Qty: {item.qty}</span>
                      </div>
                    </div>
                  ))}
                </div>

                {(order.deliveryStatus === 'Ordered' || order.deliveryStatus === 'Packed' || (!order.deliveryStatus && !order.isDelivered)) && (
                  <div className="order-actions" style={{ marginTop: '15px', borderTop: '1px solid var(--border-color)', paddingTop: '15px' }}>
                    <button 
                      onClick={() => handleCancelOrder(order._id)}
                      className="btn-secondary"
                      style={{ color: '#ef4444', borderColor: '#ef4444' }}
                    >
                      Cancel Order
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
