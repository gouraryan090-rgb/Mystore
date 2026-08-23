"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { CartProvider, useCart } from "./context/CartContext";

function HeaderContent({ isOpen, setIsOpen, user }) {
  const { cart } = useCart();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <header
      style={{
        backgroundColor: "#fff",
        padding: "16px 24px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        marginBottom: "24px",
      }}
    >
      <Link
        href="/"
        style={{
          color: "#111827",
          textDecoration: "none",
          fontSize: "24px",
          fontWeight: "900",
        }}
      >
        ZENTROBAZAAR
      </Link>

      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {/* Cart Icon with Live Badge Count */}
        <Link
          href="/cart"
          style={{
            position: "relative",
            fontSize: "22px",
            textDecoration: "none",
            color: "#111827",
            display: "flex",
            alignItems: "center",
          }}
        >
          🛒
          {totalItems > 0 && (
            <span
              style={{
                position: "absolute",
                top: "-6px",
                right: "-10px",
                backgroundColor: "#2563eb",
                color: "#fff",
                fontSize: "11px",
                fontWeight: "bold",
                borderRadius: "50%",
                width: "18px",
                height: "18px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {totalItems}
            </span>
          )}
        </Link>

        {user && (
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setIsOpen(!isOpen)}
              style={{
                background: "#f3f4f6",
                border: "1px solid #e5e7eb",
                padding: "6px 12px",
                borderRadius: "20px",
                cursor: "pointer",
                display: "flex",
                alignItems: "center",
                gap: "8px",
                fontSize: "14px",
                fontWeight: "600",
                color: "#374151",
              }}
            >
              <span>Hi, {user.name}</span>

              <div
                style={{
                  width: "28px",
                  height: "28px",
                  borderRadius: "50%",
                  backgroundColor: "#2563eb",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  fontSize: "12px",
                  fontWeight: "bold",
                }}
              >
                {user.photo ? (
                  <img
                    src={user.photo}
                    alt={user.name}
                    style={{ width: "100%", height: "100%", objectFit: "cover" }}
                  />
                ) : user.name ? (
                  user.name.charAt(0).toUpperCase()
                ) : (
                  "U"
                )}
              </div>

              <span style={{ fontSize: "10px", color: "#6b7280" }}>▼</span>
            </button>

            {isOpen && (
              <div
                style={{
                  position: "absolute",
                  right: 0,
                  top: "44px",
                  backgroundColor: "#fff",
                  boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                  borderRadius: "12px",
                  border: "1px solid #e5e7eb",
                  width: "180px",
                  overflow: "hidden",
                  zIndex: 1000,
                }}
              >
                <Link href="/edit-profile" onClick={() => setIsOpen(false)} style={linkStyle}>
                  ✏️ Edit Profile
                </Link>
                <Link href="/edit-address" onClick={() => setIsOpen(false)} style={linkStyle}>
                  🏠 Edit Address
                </Link>
                <Link href="/orders" onClick={() => setIsOpen(false)} style={linkStyle}>
                  📦 My Orders
                </Link>
                <Link href="/contact-us" onClick={() => setIsOpen(false)} style={linkStyle}>
                  📞 Contact Us
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}

export default function CustomerLayout({ children }) {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("customer_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  return (
    <CartProvider>
      <HeaderContent isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
      <main style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 20px 20px 20px" }}>
        {children}
      </main>
    </CartProvider>
  );
}

const linkStyle = {
  display: "block",
  padding: "10px 16px",
  color: "#374151",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "500",
  borderBottom: "1px solid #f3f4f6",
};