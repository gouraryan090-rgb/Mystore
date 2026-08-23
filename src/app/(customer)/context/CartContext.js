"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  // 1. Fetch user email and load cart from database
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("customer_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.email) {
          setUserEmail(parsedUser.email);
          // Fetch database cart from backend
          fetch(`/api/user/cart?email=${parsedUser.email}`)
            .then((res) => res.json())
            .then((data) => {
              if (data.success && data.cart) {
                setCart(data.cart);
                localStorage.setItem("user_cart", JSON.stringify(data.cart));
              }
            })
            .catch((err) => console.error("Cart fetch error:", err));
          return;
        }
      }
      
      // If user is not logged in, load from localstorage
      const savedCart = localStorage.getItem("user_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error(e);
    }
  }, []);

  // 2. Sync cart to both LocalStorage and Database upon update
  const syncCartToBackend = async (updatedCart) => {
    localStorage.setItem("user_cart", JSON.stringify(updatedCart));

    if (userEmail) {
      try {
        await fetch("/api/user/cart", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: userEmail, cart: updatedCart }),
        });
      } catch (err) {
        console.error("Cart sync error:", err);
      }
    }
  };

  // Add product to cart (Safe duplicate check)
  const addToCart = (product) => {
    const isAlreadyInCart = cart.some((item) => item._id === product._id);

    if (isAlreadyInCart) {
      alert("This product is already added to your cart!");
      return false;
    }

    const newCart = [...cart, { ...product, quantity: 1 }];
    setCart(newCart);
    syncCartToBackend(newCart);
    return true;
  };

  // Increase/decrease quantity
  const updateQuantity = (id, amount) => {
    const newCart = cart
      .map((item) => {
        if (item._id === id) {
          const newQty = item.quantity + amount;
          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCart(newCart);
    syncCartToBackend(newCart);
  };

  // Clear cart
  const clearCart = () => {
    setCart([]);
    syncCartToBackend([]);
  };

  return (
    <CartContext.Provider value={{ cart, addToCart, updateQuantity, clearCart }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);