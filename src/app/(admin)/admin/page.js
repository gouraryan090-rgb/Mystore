"use client";
import { useState } from "react";
import Link from "next/link";

export default function AdminDashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

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

      if (res.ok && data.success) {
        setIsAuthenticated(true);
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

  return (
    <div>
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
              borderRadius: "20px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🔒</div>
            <h2 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
              Admin Access Required
            </h2>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px" }}>
              Dashboard unlock karne ke liye password dalein.
            </p>

            {error && (
              <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "13px", padding: "10px", borderRadius: "10px", marginBottom: "16px", border: "1px solid #fee2e2" }}>
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
                border: "1px solid #cbd5e1",
                borderRadius: "12px",
                marginBottom: "16px",
                fontSize: "14px",
                boxSizing: "border-box",
                outline: "none",
                backgroundColor: "#f8fafc",
                fontWeight: "600",
              }}
            />

            <button
              type="submit"
              disabled={loading}
              style={{
                width: "100%",
                backgroundColor: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "12px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)"
              }}
            >
              {loading ? "Verifying..." : "Unlock Dashboard"}
            </button>
          </form>
        </div>
      )}

      {isAuthenticated && (
        <div>
          {/* Top Header & Logout */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
            <div>
              <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: 0 }}>Dashboard Overview</h1>
              <p style={{ color: "#64748b", fontSize: "13px", margin: "2px 0 0 0", fontWeight: "600" }}>Manage and view all store metrics and options</p>
            </div>
            <button
              onClick={() => setIsAuthenticated(false)}
              style={{
                backgroundColor: "#ef4444",
                color: "#fff",
                border: "none",
                padding: "8px 16px",
                borderRadius: "10px",
                fontWeight: "800",
                fontSize: "13px",
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
              }}
            >
              Logout
            </button>
          </div>

          {/* Metrics Stats Row */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
            <StatCard icon="🛍️" label="Total Orders" value="1,248" bg="#eff6ff" />
            <StatCard icon="📈" label="Total Revenue" value="₹12,48,750" bg="#f0fdf4" />
            <StatCard icon="⏳" label="Pending Orders" value="156" bg="#fef3c7" />
            <StatCard icon="✅" label="Delivered Orders" value="1,092" bg="#f0fdf4" />
            <StatCard icon="❌" label="Cancelled Orders" value="68" bg="#fef2f2" />
          </div>

          {/* Quick Management Section Grid */}
          <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", marginBottom: "16px" }}>Quick Management Modules</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px" }}>
            
            <DashboardCard href="/admin/orders" icon="📦" title="Manage Orders" desc="View, track, download receipt, and update customer order status." />
            <DashboardCard href="/admin/products" icon="🏷️" title="Manage Products" desc="Add, edit, or delete store products and stock." />
            <DashboardCard href="/admin/categories" icon="📂" title="Manage Categories" desc="Create new main categories or sub-categories." />
            <DashboardCard href="/admin/customers" icon="👥" title="Manage Customers" desc="View customer lists and details." />
            <DashboardCard href="/admin/coupons" icon="🎟️" title="Make / Edit Coupons" desc="Create discount codes and edit coupon offers." />
            <DashboardCard href="/admin/finance" icon="📊" title="Finance & Analytics" desc="Track revenue, estimated profit, and monthly/category sales." />
            <DashboardCard href="/admin/messages" icon="📬" title="Customer Messages" desc="View and manage customer complaints and support queries." />
            <DashboardCard href="/admin/extra-charges" icon="⚡" title="Manage Extra Charges" desc="Add or remove extra fees like COD charges or packaging fee." />

          </div>
        </div>
      )}
    </div>
  );
}

function StatCard({ icon, label, value, bg }) {
  return (
    <div style={{ backgroundColor: "#fff", padding: "18px", borderRadius: "16px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", display: "flex", alignItems: "center", gap: "14px" }}>
      <div style={{ width: "42px", height: "42px", borderRadius: "12px", backgroundColor: bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", flexShrink: 0 }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>{label}</div>
        <div style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", marginTop: "2px" }}>{value}</div>
      </div>
    </div>
  );
}

function DashboardCard({ href, icon, title, desc }) {
  return (
    <Link href={href} style={{ textDecoration: "none" }}>
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "18px", border: "1px solid #f1f5f9", boxShadow: "0 4px 15px rgba(0,0,0,0.02)", cursor: "pointer", transition: "all 0.2s" }}>
        <div style={{ fontSize: "28px", marginBottom: "12px" }}>{icon}</div>
        <h3 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>{title}</h3>
        <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "600", lineHeight: "1.4" }}>{desc}</p>
      </div>
    </Link>
  );
}