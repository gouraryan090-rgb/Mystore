"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminFinancePage() {
  // Naya page-level protect hook jo modal render karega agar cookie na ho
  const lockScreen = useAdminProtect();

  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({ totalRevenue: 0, totalProfit: 0, totalOrdersCount: 0, cancelledOrdersCount: 0 });
  const [monthlyData, setMonthlyData] = useState({});
  const [categoryData, setCategoryData] = useState({});

  useEffect(() => {
    fetch("/api/admin/finance")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setStats(data.stats);
          setMonthlyData(data.monthlyData);
          setCategoryData(data.categoryData);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching finance data:", err);
        setLoading(false);
      });
  }, []);

  // Agar user authenticated nahi hai, toh lock modal dikhega
  if (lockScreen) return lockScreen;

  if (loading) {
    return (
      <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", textAlign: "center", fontFamily: "system-ui, sans-serif", color: "#6b7280" }}>
        Loading Financial Analytics...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/admin" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
        ← Back to Admin Dashboard
      </Link>

      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb", marginTop: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
          📊 Finance & Business Analytics
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Cancelled orders ko hata kar saari revenue, profit aur category-wise sales yahan dekhein.
        </p>

        {/* Top Summary Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", marginBottom: "32px" }}>
          <div style={{ backgroundColor: "#eff6ff", border: "1px solid #bfdbfe", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", color: "#1e40af", fontWeight: "bold", textTransform: "uppercase" }}>Total Revenue</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#1d4ed8", marginTop: "6px" }}>₹{stats.totalRevenue.toLocaleString()}</div>
          </div>

          <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", color: "#166534", fontWeight: "bold", textTransform: "uppercase" }}>Estimated Profit</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#15803d", marginTop: "6px" }}>₹{stats.totalProfit.toLocaleString()}</div>
          </div>

          <div style={{ backgroundColor: "#fdf4ff", border: "1px solid #f5d0fe", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", color: "#86198f", fontWeight: "bold", textTransform: "uppercase" }}>Successful Orders</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#a21caf", marginTop: "6px" }}>{stats.totalOrdersCount}</div>
          </div>

          <div style={{ backgroundColor: "#fef2f2", border: "1px solid #fca5a5", padding: "16px", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", color: "#991b1b", fontWeight: "bold", textTransform: "uppercase" }}>Cancelled Orders</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#dc2626", marginTop: "6px" }}>{stats.cancelledOrdersCount}</div>
          </div>
        </div>

        {/* Breakdown Section */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
          
          {/* Monthly Revenue Breakdown */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#111827" }}>📅 Monthly Revenue</h2>
            {Object.keys(monthlyData).length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: "14px" }}>No data available yet.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(monthlyData).map(([month, amount]) => (
                  <div key={month} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>{month}</span>
                    <span style={{ fontWeight: "bold", color: "#2563eb", fontSize: "14px" }}>₹{amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Category-wise Sales Breakdown */}
          <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#111827" }}>🏷️ Category-wise Sales</h2>
            {Object.keys(categoryData).length === 0 ? (
              <p style={{ color: "#6b7280", fontSize: "14px" }}>No category data available.</p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {Object.entries(categoryData).map(([category, amount]) => (
                  <div key={category} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                    <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>{category}</span>
                    <span style={{ fontWeight: "bold", color: "#16a34a", fontSize: "14px" }}>₹{amount.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
}