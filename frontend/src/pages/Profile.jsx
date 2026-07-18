import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './Profile.css';

const Profile = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
    // Simulate fetching orders
    setOrders([
      { _id: 'ORD1029', date: '2026-07-15', total: 149.99, status: 'Delivered' },
      { _id: 'ORD1030', date: '2026-07-16', total: 299.99, status: 'Processing' }
    ]);
  }, [user, navigate]);

  if (!user) return null;

  return (
    <div className="container profile-page">
      <div className="profile-sidebar">
        <div className="user-info">
          <div className="avatar">{user.name.charAt(0).toUpperCase()}</div>
          <h3>{user.name}</h3>
          <p>{user.email}</p>
        </div>
        <button onClick={logout} className="btn-logout">Logout</button>
        {user.isAdmin && (
          <button onClick={() => navigate('/admin-moonlight-secret')} className="btn-primary mt-20">
            Admin Dashboard
          </button>
        )}
      </div>
      <div className="profile-content">
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders.</p>
        ) : (
          <div className="orders-list">
            {orders.map(order => (
              <div key={order._id} className="order-card">
                <div className="order-header">
                  <h4>Order #{order._id}</h4>
                  <span className={`status ${order.status.toLowerCase()}`}>{order.status}</span>
                </div>
                <p>Date: {order.date}</p>
                <p className="order-total">Total: ₹{order.total.toFixed(2)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
