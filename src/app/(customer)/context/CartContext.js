"use client";
import { createContext, useContext, useState, useEffect } from "react";

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);
  const [userEmail, setUserEmail] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("customer_user");
      if (savedUser) {
        const parsedUser = JSON.parse(savedUser);
        if (parsedUser?.email) {
          setUserEmail(parsedUser.email);
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
      
      const savedCart = localStorage.getItem("user_cart");
      if (savedCart) setCart(JSON.parse(savedCart));
    } catch (e) {
      console.error(e);
    }
  }, []);

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

  const addToCart = (product) => {
    const existingIndex = cart.findIndex(
      (item) =>
        item._id === product._id &&
        item.selectedColor === product.selectedColor &&
        item.selectedSize === product.selectedSize
    );

    const maxStock = product.stock !== undefined ? product.stock : 10;

    if (existingIndex > -1) {
      const currentQty = cart[existingIndex].quantity || 1;
      const newQty = currentQty + 1;

      if (newQty > maxStock) {
        alert(`Only ${maxStock} items available in stock!`);
        return false;
      }

      const newCart = [...cart];
      newCart[existingIndex] = { ...newCart[existingIndex], quantity: newQty };
      setCart(newCart);
      syncCartToBackend(newCart);
      return true;
    }

    if (maxStock < 1) {
      alert("Item is out of stock!");
      return false;
    }

    const newCart = [...cart, { ...product, quantity: product.quantity || 1 }];
    setCart(newCart);
    syncCartToBackend(newCart);
    return true;
  };

  const updateQuantity = (id, amount, selectedColor = null, selectedSize = null) => {
    const newCart = cart
      .map((item) => {
        const matches =
          item._id === id &&
          item.selectedColor === selectedColor &&
          item.selectedSize === selectedSize;

        if (matches) {
          const currentQty = item.quantity || 1;
          const newQty = currentQty + amount;
          const maxStock = item.stock !== undefined ? item.stock : 10;

          if (amount > 0 && newQty > maxStock) {
            alert(`Only ${maxStock} items available in stock!`);
            return item; 
          }

          return newQty > 0 ? { ...item, quantity: newQty } : null;
        }
        return item;
      })
      .filter(Boolean);

    setCart(newCart);
    syncCartToBackend(newCart); // Yeh function name theek kar diya gaya hai
  };

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