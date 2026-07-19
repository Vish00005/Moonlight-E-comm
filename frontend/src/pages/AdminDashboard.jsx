import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Trash2, Edit, Plus, BarChart2, Package, ShoppingBag, List } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();
  
  const [activeTab, setActiveTab] = useState('products');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [categories, setCategories] = useState([]);
  
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '', price: '', description: '', image: '', category: [], countInStock: 0
  });

  const [categoryFormData, setCategoryFormData] = useState({ name: '', image: '' });
  const [isCategoryFormOpen, setIsCategoryFormOpen] = useState(false);

  const config = {
    headers: { Authorization: `Bearer ${user?.token}` }
  };

  useEffect(() => {
    if (!user || !user.isAdmin) {
      navigate('/');
      return;
    }
    fetchProducts();
    fetchOrders();
    fetchAnalytics();
    fetchCategories();
  }, [user, navigate]);

  const fetchCategories = async () => {
    try {
      const { data } = await axios.get('/api/categories');
      setCategories(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get('/api/products');
      setProducts(data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchOrders = async () => {
    try {
      const { data } = await axios.get('/api/orders', config);
      setOrders(data);
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

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await axios.put(`/api/orders/${orderId}/status`, { status: newStatus }, config);
      fetchOrders();
    } catch (err) {
      alert('Error updating order status');
    }
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCategoryCheckboxChange = (e) => {
    const { value, checked } = e.target;
    let newCategories = [...formData.category];
    if (checked) {
      newCategories.push(value);
    } else {
      newCategories = newCategories.filter(cat => cat !== value);
    }
    setFormData({ ...formData, category: newCategories });
  };

  const handleCategoryInputChange = (e) => {
    setCategoryFormData({ ...categoryFormData, [e.target.name]: e.target.value });
  };

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/categories', categoryFormData, config);
      fetchCategories();
      setIsCategoryFormOpen(false);
      setCategoryFormData({ name: '', image: '' });
    } catch (err) {
      alert(err.response?.data?.message || 'Error saving category');
    }
  };

  const handleDeleteCategory = async (id) => {
    if (window.confirm('Are you sure you want to delete this category?')) {
      try {
        await axios.delete(`/api/categories/${id}`, config);
        fetchCategories();
      } catch (err) {
        alert(err.response?.data?.message || 'Error deleting category');
      }
    }
  };

  const openForm = (product = null) => {
    if (product) {
      setEditingId(product._id);
      // Ensure category is an array even for older string-based products
      const categoryArray = Array.isArray(product.category) 
        ? product.category 
        : (product.category ? [product.category] : []);
      setFormData({ ...product, category: categoryArray });
    } else {
      setEditingId(null);
      setFormData({ name: '', price: '', description: '', image: '', category: [], countInStock: 0 });
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
            className={`tab-btn ${activeTab === 'categories' ? 'active' : ''}`}
            onClick={() => setActiveTab('categories')}
          >
            <List size={18} /> Categories
          </button>
          <button 
            className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <ShoppingBag size={18} /> Orders
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
                    <label>Categories</label>
                    <div className="category-checkboxes">
                      {categories.map(cat => (
                        <label key={cat._id} className="checkbox-label">
                          <input 
                            type="checkbox" 
                            value={cat.name} 
                            checked={formData.category.includes(cat.name)}
                            onChange={handleCategoryCheckboxChange}
                          />
                          {cat.name}
                        </label>
                      ))}
                      {categories.length === 0 && <span className="no-categories">No categories available. Please add categories first.</span>}
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Stock Count</label>
                    <input type="number" name="countInStock" value={formData.countInStock} onChange={handleInputChange} required className="input-field" />
                  </div>
                </div>
                <div className="form-group">
                  <label>Image Upload (Cloudinary)</label>
                  <input 
                    type="file" 
                    onChange={async (e) => {
                      const file = e.target.files[0];
                      if (!file) return;
                      const uploadData = new FormData();
                      uploadData.append('image', file);
                      try {
                        const { data } = await axios.post('/api/upload', uploadData, config);
                        setFormData({ ...formData, image: data.url });
                      } catch (err) {
                        alert('Image upload failed');
                      }
                    }} 
                    className="input-field" 
                    accept="image/*" 
                    style={{ padding: '6px' }}
                  />
                  {formData.image && (
                    <div style={{ marginTop: '10px' }}>
                      <img src={formData.image} alt="Uploaded preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                      <p style={{ fontSize: '12px', marginTop: '5px', color: 'var(--primary)' }}>CDN URL Attached: {formData.image.substring(0, 30)}...</p>
                    </div>
                  )}
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
                      <td>{Array.isArray(product.category) ? product.category.join(', ') : product.category}</td>
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

        {activeTab === 'categories' && (
          <div className="categories-section">
            <div className="section-header">
              <h3>Manage Categories</h3>
              <button className="btn-primary" onClick={() => setIsCategoryFormOpen(!isCategoryFormOpen)}>
                <Plus size={18} /> {isCategoryFormOpen ? 'Cancel' : 'Add Category'}
              </button>
            </div>

            {isCategoryFormOpen && (
              <form onSubmit={handleCategorySubmit} className="admin-form">
                <h4>Add New Category</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" value={categoryFormData.name} onChange={handleCategoryInputChange} required className="input-field" />
                  </div>
                  <div className="form-group">
                    <label>Image Upload (Cloudinary)</label>
                    <input 
                      type="file" 
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        const uploadData = new FormData();
                        uploadData.append('image', file);
                        try {
                          const { data } = await axios.post('/api/upload', uploadData, config);
                          setCategoryFormData({ ...categoryFormData, image: data.url });
                        } catch (err) {
                          alert('Image upload failed');
                        }
                      }} 
                      className="input-field" 
                      accept="image/*" 
                      style={{ padding: '6px' }}
                    />
                    {categoryFormData.image && (
                      <div style={{ marginTop: '10px' }}>
                        <img src={categoryFormData.image} alt="Preview" style={{ width: '100px', height: '100px', objectFit: 'cover', borderRadius: '8px', border: '1px solid var(--border-color)' }} />
                      </div>
                    )}
                  </div>
                </div>
                <div className="form-actions">
                  <button type="submit" className="btn-primary" disabled={!categoryFormData.name || !categoryFormData.image}>Save Category</button>
                  <button type="button" className="btn-secondary" onClick={() => setIsCategoryFormOpen(false)}>Cancel</button>
                </div>
              </form>
            )}

            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map(category => (
                    <tr key={category._id}>
                      <td><img src={category.image} alt={category.name} className="table-img" /></td>
                      <td>{category.name}</td>
                      <td className="table-actions">
                        <button className="btn-icon delete" onClick={() => handleDeleteCategory(category._id)}><Trash2 size={18} /></button>
                      </td>
                    </tr>
                  ))}
                  {categories.length === 0 && (
                    <tr>
                      <td colSpan="3" style={{ textAlign: 'center', padding: '20px' }}>No categories found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-section">
            <div className="section-header">
              <h3>Customer Orders</h3>
            </div>
            <div className="table-responsive">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Order ID</th>
                    <th>Customer</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Method</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 8)}...</td>
                      <td>{order.user?.name || 'Unknown'}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>₹{order.totalPrice.toFixed(2)}</td>
                      <td>{order.paymentMethod}</td>
                      <td>
                        <select 
                          className="status-dropdown" 
                          value={order.deliveryStatus} 
                          onChange={(e) => handleStatusChange(order._id, e.target.value)}
                          disabled={order.deliveryStatus === 'Cancelled'}
                        >
                          <option value="Ordered">Ordered</option>
                          <option value="Packed">Packed</option>
                          <option value="Shipped">Shipped</option>
                          <option value="Delivered">Delivered</option>
                          {order.deliveryStatus === 'Cancelled' && <option value="Cancelled">Cancelled</option>}
                        </select>
                      </td>
                    </tr>
                  ))}
                  {orders.length === 0 && (
                    <tr>
                      <td colSpan="6" style={{ textAlign: 'center', padding: '20px' }}>No orders found.</td>
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
