"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { CartProvider, useCart } from "./context/CartContext";

function HeaderContent({ isOpen, setIsOpen, user }) {
  const { cart } = useCart();
  const pathname = usePathname();
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  // Helper function to check if a link is active
  const isActive = (path) => pathname === path;

  const getLinkStyle = (path) => ({
    textDecoration: "none",
    backgroundColor: isActive(path) ? "#eef2ff" : "transparent",
    color: isActive(path) ? "#6366f1" : "#64748b",
    padding: "8px 16px",
    borderRadius: "12px",
    fontSize: "14px",
    fontWeight: isActive(path) ? "700" : "600",
  });

  return (
    <header
      style={{
        backgroundColor: "#fff",
        borderBottom: "1px solid #f1f5f9",
        position: "sticky",
        top: 0,
        zIndex: 1000,
        boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
      }}
    >
      <div
        style={{
          maxWidth: "1280px",
          margin: "0 auto",
          padding: "16px 20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "16px",
        }}
      >
        {/* Logo */}
        <Link
          href="/"
          style={{
            fontSize: "22px",
            fontWeight: "900",
            letterSpacing: "-0.5px",
            color: "#0f172a",
            textDecoration: "none",
          }}
        >
          ZENTRO<span style={{ color: "#6366f1" }}>BAZAAR</span>
        </Link>

        {/* Dynamic Nav Links */}
        <div style={{ display: "flex", alignItems: "center", gap: "6px", flexWrap: "wrap" }}>
          <Link href="/" style={getLinkStyle("/")}>
            🏠 Home
          </Link>
          <Link href="/categories" style={getLinkStyle("/categories")}>
            📑 Categories
          </Link>
          <Link href="/deals" style={getLinkStyle("/deals")}>
            🏷️ Deals
          </Link>
          <Link href="/orders" style={getLinkStyle("/orders")}>
            📦 Orders
          </Link>
          <Link href="/about" style={getLinkStyle("/about")}>
            ℹ️ About Us
          </Link>
        </div>

        {/* Right Section (Cart & User Profile Dropdown) */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            href="/cart"
            style={{
              textDecoration: "none",
              position: "relative",
              backgroundColor: "#f8fafc",
              border: "1px solid #e2e8f0",
              padding: "10px 12px",
              borderRadius: "12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            🛒
            {totalItems > 0 && (
              <span
                style={{
                  position: "absolute",
                  top: "-5px",
                  right: "-5px",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  fontSize: "10px",
                  fontWeight: "800",
                  width: "18px",
                  height: "18px",
                  borderRadius: "50%",
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
                  background: "#f8fafc",
                  border: "1px solid #e2e8f0",
                  padding: "6px 14px 6px 6px",
                  borderRadius: "30px",
                  cursor: "pointer",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                }}
              >
                <div
                  style={{
                    width: "28px",
                    height: "28px",
                    borderRadius: "50%",
                    backgroundColor: "#6366f1",
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
                <span style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>
                  Hi, {user.name?.split(" ")[0]}
                </span>
                <span style={{ fontSize: "10px", color: "#64748b" }}>▼</span>
              </button>

              {isOpen && (
                <div
                  style={{
                    position: "absolute",
                    right: 0,
                    top: "44px",
                    backgroundColor: "#fff",
                    boxShadow: "0 10px 25px -5px rgba(0, 0, 0, 0.1)",
                    borderRadius: "16px",
                    border: "1px solid #e2e8f0",
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
      <div style={{ minHeight: "100vh", backgroundColor: "#f8fafc" }}>
        <HeaderContent isOpen={isOpen} setIsOpen={setIsOpen} user={user} />
        <main style={{ maxWidth: "1280px", margin: "0 auto", padding: "24px 20px" }}>
          {children}
        </main>
      </div>
    </CartProvider>
  );
}

const linkStyle = {
  display: "block",
  padding: "12px 16px",
  color: "#334155",
  textDecoration: "none",
  fontSize: "14px",
  fontWeight: "600",
  borderBottom: "1px solid #f1f5f9",
};