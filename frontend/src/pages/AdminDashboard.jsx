import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, Plus, BarChart2, Package } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', image: '', category: '', countInStock: 0
  });

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchAnalytics();
  }, [user, navigate]);

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchAnalytics = async () => {
    try {
      const { data } = await axios.get('/api/orders/analytics', config);
      setAnalytics(data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const openForm = (product = null) => {
    if (product) {
      setEditingId(product._id);
      setFormData(product);
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', description: '', image: '', category: '', countInStock: 0 });
    }
    setIsFormOpen(true);
  };

  const closeForm = () => {
    setIsFormOpen(false);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`/api/products/${editingId}`, formData, config);
      } else {
        await axios.post('/api/products', formData, config);
      }
      fetchProducts();
      closeForm();
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving product');
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      try {
        await axios.delete(`/api/products/${id}`, config);
        fetchProducts();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting product');
      }
    }
  };

  if (!user || !user.isAdmin) return null;

  return (
    <div className="container admin-page">
      <div className="admin-header">
        <h2>Admin Dashboard</h2>
        <div className="admin-tabs">
          <button 
            className={`tab-btn ${activeTab === 'products' ? 'active' : ''}`}
            onClick={() => setActiveTab('products')}
          >
            <Package size={18} /> Products
          </button>
          <button 
            className={`tab-btn ${activeTab === 'analytics' ? 'active' : ''}`}
            onClick={() => setActiveTab('analytics')}
          >
            <BarChart2 size={18} /> Analytics
          </button>
        </div>
      </div>

      <div className="admin-content">
        {activeTab === 'products' && (
          <div className="products-section">
            <div className="section-header">
              <h3>Manage Products</h3>
              <button className="btn-primary" onClick={() => openForm()}>
                <Plus size={18} /> Add Product
              </button>
            </div>

            {isFormOpen && (
              <form onSubmit={handleSubmit} className="admin-form">
                <h4>{editingId ? 'Edit Product' : 'Add New Product'}</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={formData.name} onChange={handleInputChange} required className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Price (₹)</label>
                    <input type="number" name="price" value={formData.price} onChange={handleInputChange} required className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Category</label>
                    <input type="text" name="category" value={formData.category} onChange={handleInputChange} required className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Stock Count</label>
                    <input type="number" name="countInStock" value={formData.countInStock} onChange={handleInputChange} required className="input-field" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image URL (Cloudinary)</label>
                  <input type="text" name="image" value={formData.image} onChange={handleInputChange} required className="input-field" placeholder="https://res.cloudinary.com/..." />
                </div>
                <div className="form-group">
                  <label>Description</label>
                  <textarea name="description" value={formData.description} onChange={handleInputChange} required className="input-field" rows="4" />
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary">Save Product</button>
                  <button type="button" className="btn-secondary" onClick={closeForm}>Cancel</button>
                </div>
              </form>
            )}

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Price</th>
                    <th>Category</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map(product => (
                    <tr key={product._id}>
                      <td><img src={product.image} alt={product.name} className="table-img" /></td>
                      <td>{product.name}</td>
                      <td>₹{product.price.toFixed(2)}</td>
                      <td>{product.category}</td>
                      <td className="table-actions">
                        <button className="btn-icon edit" onClick={() => openForm(product)}><Edit size={18} /></button>
                        <button className="btn-icon delete" onClick={() => handleDelete(product._id)}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {products.length === 0 && (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '20px' }}>No products found in database.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="analytics-section">
            <h3>Store Analytics</h3>
            <div className="stats-grid">
              <div className="stat-card">
                <h4>Total Revenue</h4>
                <p className="stat-value">₹{analytics?.totalRevenue?.toFixed(2) || '0.00'}</p>
              </div>
              <div className="stat-card">
                <h4>Total Orders</h4>
                <p className="stat-value">{analytics?.totalOrders || 0}</p>
              </div>
              <div className="stat-card">
                <h4>Active Products</h4>
                <p className="stat-value">{analytics?.totalProducts || 0}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
