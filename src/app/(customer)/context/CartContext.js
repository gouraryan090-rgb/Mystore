"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  // LocalStorage se saved cart load karein
  useEffect(() => {
    const savedCart = localStorage.getItem("user_cart");
    if (savedCart) setCart(JSON.parse(savedCart));
  }, []);

  // Cart update hone par LocalStorage me sync karein
  useEffect(() => {
    localStorage.setItem("user_cart", JSON.stringify(cart));
  }, [cart]);

  // Product Add karna (Safe duplicate check)
  const addToCart = (product) => {
    // Current cart array me direct duplicate check
    const isAlreadyInCart = cart.some((item) => item._id === product._id);

    if (isAlreadyInCart) {
      alert("Yeh product pehle se cart me add hai!");
      return false;
    }

    setCart((prevCart) => [...prevCart, { ...product, quantity: 1 }]);
    return true;
  };

  // Quantity increase/decrease karna
  const updateQuantity = (id, amount) => {
    setCart((prevCart) =>
      prevCart
        .map((item) => {
          if (item._id === id) {
            const newQty = item.quantity + amount;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean)
    );
  };

  // Cart empty karna
  const clearCart = () => setCart([]);

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);