"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password }),
      });

      const data = await res.json();

      if (data.success) {
        setIsAuthenticated(true);
        sessionStorage.setItem("admin_auth", "true");
      } else {
        setError(data.error || "Galat password! Dobara koshish karein.");
      }
    } catch (err) {
      console.error(err);
      setError("Login error! Service check karein.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("admin_auth");
    setIsAuthenticated(false);
  };

  return (
    <div style={{ padding: "40px 20px", maxWidth: "900px", margin: "0 auto" }}>
      {!isAuthenticated && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0,0,0,0.8)",
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <form
            onSubmit={handleLogin}
            style={{
              backgroundColor: "#fff",
              width: "100%",
              maxWidth: "380px",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.3)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
            <h2 style={{ fontSize: "22px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
              Admin Access Required
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "20px" }}>
              Dashboard unlock karne ke liye password dalein.
            </p>

            {error && (
              <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px", padding: "10px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #fecaca" }}>
                {error}
              </div>
            )}

            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={{
                width: "100%",
                padding: "12px",
                border: "1px solid #d1d5db",
                borderRadius: "8px",
                marginBottom: "16px",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#2563eb",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: "pointer",
              }}
            >
              {loading ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      )}

      {isAuthenticated && (
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div>
              <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#111827", margin: 0 }}>Dashboard</h1>
              <p style={{ color: "#6b7280", margin: "4px 0 0 0" }}>Manage your store options below</p>
            </div>
            <button
              onClick={handleLogout}
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "8px",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "20px" }}>
            <Link href="/admin/orders" style={{ textDecoration: "none" }}>
              <div style={cardStyle}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>📦</div>
                <h3 style={cardTitleStyle}>Manage Orders</h3>
                <p style={cardDescStyle}>View, track, and update customer order status.</p>
              </div>
            </Link>

            <Link href="/admin/products" style={{ textDecoration: "none" }}>
              <div style={cardStyle}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🏷️</div>
                <h3 style={cardTitleStyle}>Manage Products</h3>
                <p style={cardDescStyle}>Add, edit, or delete store products and stock.</p>
              </div>
            </Link>

            <Link href="/admin/coupons" style={{ textDecoration: "none" }}>
              <div style={cardStyle}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>🎟️</div>
                <h3 style={cardTitleStyle}>Make / Edit Coupons</h3>
                <p style={cardDescStyle}>Create discount codes and edit coupon offers.</p>
              </div>
            </Link>

            <Link href="/admin/extra-charges" style={{ textDecoration: "none" }}>
              <div style={cardStyle}>
                <div style={{ fontSize: "36px", marginBottom: "12px" }}>⚡</div>
                <h3 style={cardTitleStyle}>Manage Extra Charges</h3>
                <p style={cardDescStyle}>Add or remove extra fees like COD charges or packaging fee.</p>
              </div>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}

const cardStyle = {
  backgroundColor: "#fff",
  padding: "24px",
  borderRadius: "12px",
  border: "1px solid #e5e7eb",
  boxShadow: "0 2px 4px rgba(0,0,0,0.05)",
  cursor: "pointer",
};

const cardTitleStyle = {
  fontSize: "18px",
  fontWeight: "bold",
  color: "#1f2937",
  margin: "0 0 8px 0",
};

const cardDescStyle = {
  fontSize: "13px",
  color: "#6b7280",
  margin: 0,
};