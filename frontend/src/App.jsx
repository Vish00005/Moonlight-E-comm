import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import AdminDashboard from './pages/AdminDashboard';
import ProductDetails from './pages/ProductDetails';
import Payment from './pages/Payment';
import SplashScreen from './components/SplashScreen';
import Footer from './components/Footer';
import './index.css';

function App() {
  const [loading, setLoading] = useState(true);

  return (
    <Router>
      <SplashScreen finishLoading={() => setLoading(false)} isLoading={loading} />
      <div style={{ opacity: loading ? 0 : 1, transition: 'opacity 0.8s ease' }}>
        <Navbar />
        <div className="main-content">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/product/:id" element={<ProductDetails />} />
            <Route path="/payment" element={<Payment />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/admin-moonlight-secret" element={<AdminDashboard />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
