import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import axios from 'axios';
import CategoryScroller from '../components/CategoryScroller';
import ProductCard from '../components/ProductCard';
import './Home.css';

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { type: 'spring', stiffness: 100 }
  }
};

const Home = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const searchTerm = searchParams.get('search');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data } = await axios.get('/api/products');
        setProducts(data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.message || err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  const displayedProducts = products.filter(p => {
    const matchesSearch = searchTerm ? p.name.toLowerCase().includes(searchTerm.toLowerCase()) : true;
    const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="home">
      <motion.div 
        className="hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="container hero-content">
          <h1>Simplicity is the Ultimate Sophistication</h1>
          <p>Curated minimalist accessories for everyday elegance.</p>
          <button className="btn-primary">Explore Collection</button>
        </div>
      </motion.div>
      
      <div className="container">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          <CategoryScroller 
            selectedCategory={selectedCategory} 
            onSelectCategory={setSelectedCategory} 
          />
        </motion.div>
        
        <h2 className="section-title">
          {searchTerm ? `Search Results for "${searchTerm}"` : (selectedCategory === 'All' ? "New Arrivals" : `${selectedCategory} Collection`)}
        </h2>
        
        <motion.div 
          className="products-grid"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          key={selectedCategory} // Force re-animation on category change
        >
          {loading ? (
            <p>Loading products...</p>
          ) : error ? (
            <p style={{ color: 'red' }}>Error: {error}</p>
          ) : displayedProducts.length === 0 ? (
            <p style={{ color: 'var(--text-muted)' }}>No products found in this category.</p>
          ) : (
            displayedProducts.map(product => (
              <motion.div key={product._id} variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            ))
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Home;
