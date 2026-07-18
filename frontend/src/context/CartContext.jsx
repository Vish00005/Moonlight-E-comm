import React, { createContext, useState, useEffect, useContext } from 'react';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const { user } = useContext(AuthContext);

  const getCartKey = () => `cart_${user?._id || 'guest'}`;

  useEffect(() => {
    const savedCart = localStorage.getItem(getCartKey());
    if (savedCart) {
      setCart(JSON.parse(savedCart));
    } else {
      setCart([]);
    }
  }, [user]); // Re-run when user logs in/out

  useEffect(() => {
    localStorage.setItem(getCartKey(), JSON.stringify(cart));
  }, [cart, user]);

  const addToCart = (product, qty = 1) => {
    setCart((prevCart) => {
      const existItem = prevCart.find((x) => x.product === product._id);
      if (existItem) {
        return prevCart.map((x) =>
          x.product === existItem.product ? { ...x, qty: x.qty + qty } : x
        );
      } else {
        return [...prevCart, { 
          product: product._id, 
          name: product.name, 
          image: product.image, 
          price: product.price, 
          qty 
        }];
      }
    });
  };

  const removeFromCart = (id) => {
    setCart((prevCart) => prevCart.filter((x) => x.product !== id));
  };

  const clearCart = () => {
    setCart([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};
