import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
    }
  }, [user, navigate]);

  if (!user || !user.isAdmin) return null;

  return (
    <div className="container admin-page">
      <h2>Admin Dashboard</h2>
      
      <div className="admin-grid">
        <div className="admin-card">
          <h3>Manage Products</h3>
          <p>Add, edit, or remove products from the catalog.</p>
          <button className="btn-primary">View Products</button>
        </div>
        
        <div className="admin-card">
          <h3>Manage Orders</h3>
          <p>View user orders and update shipping status.</p>
          <button className="btn-primary">View Orders</button>
        </div>
        
        <div className="admin-card">
          <h3>Manage Categories</h3>
          <p>Add new categories to the side scroller.</p>
          <button className="btn-primary">View Categories</button>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
