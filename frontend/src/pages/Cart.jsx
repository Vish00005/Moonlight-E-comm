import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2 } from 'lucide-react';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import './Cart.css';

const Cart = () => {
  const { cart, removeFromCart, clearCart } = useContext(CartContext);
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const total = cart.reduce((acc, item) => acc + item.price * item.qty, 0);

  const handleCheckout = () => {
    if (!user) {
      navigate('/login');
      return;
    }
    // Simulate placing order
    alert('Order placed successfully! In a real app, this would route to a payment gateway.');
    clearCart();
    navigate('/profile');
  };

  return (
    <div className="container cart-page">
      <h2>Shopping Cart</h2>
      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty.</p>
          <Link to="/" className="btn-primary">Continue Shopping</Link>
        </div>
      ) : (
        <div className="cart-content">
          <div className="cart-items">
            {cart.map((item) => (
              <div key={item.product} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <Link to={`/product/${item.product}`}><h3>{item.name}</h3></Link>
                  <p>₹{item.price.toFixed(2)}</p>
                </div>
                <div className="item-qty">
                  <span>Qty: {item.qty}</span>
                </div>
                <button onClick={() => removeFromCart(item.product)} className="btn-remove">
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
          </div>
          <div className="cart-summary">
            <h3>Order Summary</h3>
            <div className="summary-row">
              <span>Subtotal</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <div className="summary-row">
              <span>Shipping</span>
              <span>Free</span>
            </div>
            <hr />
            <div className="summary-row total">
              <span>Total</span>
              <span>₹{total.toFixed(2)}</span>
            </div>
            <button className="btn-primary btn-checkout" onClick={handleCheckout}>
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
