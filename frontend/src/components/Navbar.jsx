import React, { useContext, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User, LogOut, Moon } from 'lucide-react';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import './Navbar.css';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const { cart } = useContext(CartContext);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      navigate(`/?search=${searchTerm}`);
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-brand">
          <Moon className="brand-icon" />
          <span>MoonLight</span>
        </Link>

        <form onSubmit={handleSearch} className="nav-search">
          <input 
            type="text" 
            placeholder="Search ornaments..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button type="submit">
            <Search size={18} />
          </button>
        </form>

        <div className="nav-links">
          <Link to="/cart" className="nav-icon-link">
            <ShoppingCart size={24} />
            {cart.length > 0 && <span className="cart-badge">{cart.reduce((a, c) => a + c.qty, 0)}</span>}
          </Link>
          
          {user ? (
            <div className="nav-user-menu">
              <Link to="/profile" className="nav-icon-link">
                <User size={24} />
              </Link>
              <button onClick={logout} className="nav-icon-link logout-btn">
                <LogOut size={24} />
              </button>
            </div>
          ) : (
            <Link to="/login" className="btn-login">Login</Link>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
