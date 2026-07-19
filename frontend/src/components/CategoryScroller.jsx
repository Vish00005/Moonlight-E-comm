import React from 'react';
import { motion } from 'framer-motion';
import './CategoryScroller.css';

const dummyCategories = [
  { id: 0, name: 'All', image: 'https://images.unsplash.com/photo-1596944924616-7b38e7cfac36?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 1, name: 'Bracelets', image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 2, name: 'Earrings', image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 3, name: 'Necklaces', image: 'https://images.unsplash.com/photo-1599643478524-fb66f70a0066?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 4, name: 'Rings', image: 'https://images.unsplash.com/photo-1605100804763-247f661214ec?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 5, name: 'Pendants', image: 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
  { id: 6, name: 'Watches', image: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&q=80' },
];

const CategoryScroller = ({ categories = dummyCategories, selectedCategory, onSelectCategory }) => {
  return (
    <div className="category-container">
      <div className="category-scroller">
        {categories.map((cat, index) => {
          const isSelected = selectedCategory === cat.name;
          return (
            <motion.div 
              key={cat._id || cat.id} 
              className={`category-item ${isSelected ? 'selected' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1, duration: 0.4 }}
              whileHover={{ scale: 1.05 }}
              onClick={() => onSelectCategory && onSelectCategory(cat.name)}
            >
              <div className="category-img-wrapper" style={{ borderColor: isSelected ? 'var(--secondary)' : 'var(--border-color)' }}>
                <img src={cat.image} alt={cat.name} />
              </div>
              <span style={{ color: isSelected ? 'var(--secondary)' : 'var(--text-main)', fontWeight: isSelected ? 600 : 500 }}>
                {cat.name}
              </span>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default CategoryScroller;
