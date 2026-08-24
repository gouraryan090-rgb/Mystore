"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminFinancePage() {
  const lockScreen = useAdminProtect();

  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all"); // all, today, week, month
  const [stats, setStats] = useState({ totalRevenue: 0, totalProfit: 0, totalOrdersCount: 0, cancelledOrdersCount: 0 });
  const [monthlyData, setMonthlyData] = useState({});
  const [categoryData, setCategoryData] = useState({});
  const [subCategoryData, setSubCategoryData] = useState({});
  const [paymentModeData, setPaymentModeData] = useState({ Online: 0, COD: 0 });
  const [categoryCancelCount, setCategoryCancelCount] = useState({});

  const fetchFinanceData = async (selectedFilter) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/finance?filter=${selectedFilter}`);
      const data = await res.json();
      if (data.success) {
        setStats(data.stats);
        setMonthlyData(data.monthlyData);
        setCategoryData(data.categoryData);
        setSubCategoryData(data.subCategoryData || {});
        setPaymentModeData(data.paymentModeData || { Online: 0, COD: 0 });
        setCategoryCancelCount(data.categoryCancelCount || {});
      }
    } catch (err) {
      console.error("Error fetching finance data:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFinanceData(filter);
  }, [filter]);

  // CSV Report Download Function
  const exportToCSV = () => {
    let csvContent = "data:text/csv;charset=utf-8,";
    csvContent += "Metric,Value\n";
    csvContent += `Total Revenue,${stats.totalRevenue}\n`;
    csvContent += `Estimated Profit,${stats.totalProfit}\n`;
    csvContent += `Successful Orders,${stats.totalOrdersCount}\n`;
    csvContent += `Cancelled Orders,${stats.cancelledOrdersCount}\n`;
    csvContent += `Online Revenue,${paymentModeData.Online}\n`;
    csvContent += `COD Revenue,${paymentModeData.COD}\n`;

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Finance_Report_${filter}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (lockScreen) return lockScreen;

  return (
    <div style={{ maxWidth: "900px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <Link href="/admin" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
          ← Back to Admin Dashboard
        </Link>
        
        {/* Export Button */}
        <button
          onClick={exportToCSV}
          style={{
            backgroundColor: "#16a34a",
            color: "#fff",
            border: "none",
            padding: "8px 14px",
            borderRadius: "8px",
            fontWeight: "bold",
            fontSize: "13px",
            cursor: "pointer",
          }}
        >
          📥 Download Report (CSV)
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px", marginBottom: "24px" }}>
          <div>
            <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 4px 0" }}>
              📊 Advanced Finance & Analytics
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>
              Detailed breakdown of revenue, payment modes, and category performance.
            </p>
          </div>

          {/* Date Filter Dropdown */}
          <div>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              style={{ padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", backgroundColor: "#fff", fontWeight: "600" }}
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">This Month</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Loading Financial Data...</div>
        ) : (
          <>
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

            {/* Payment Mode Share */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "32px" }}>
              <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold" }}>ONLINE / PREPAID</div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginTop: "4px" }}>₹{paymentModeData.Online.toLocaleString()}</div>
                </div>
                <div style={{ fontSize: "24px" }}>💳</div>
              </div>

              <div style={{ backgroundColor: "#f9fafb", border: "1px solid #e5e7eb", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "bold" }}>CASH ON DELIVERY (COD)</div>
                  <div style={{ fontSize: "18px", fontWeight: "bold", color: "#1f2937", marginTop: "4px" }}>₹{paymentModeData.COD.toLocaleString()}</div>
                </div>
                <div style={{ fontSize: "24px" }}>💵</div>
              </div>
            </div>

            {/* Breakdown Sections Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "24px" }}>
              
              {/* Category-wise Sales */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#111827" }}>🏷️ Main Category Sales</h2>
                {Object.keys(categoryData).length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>No category data available.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {Object.entries(categoryData).map(([category, amount]) => (
                      <div key={category} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                        <div>
                          <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px", display: "block" }}>{category}</span>
                          {categoryCancelCount[category] > 0 && (
                            <span style={{ fontSize: "11px", color: "#dc2626" }}>Cancelled items: {categoryCancelCount[category]}</span>
                          )}
                        </div>
                        <span style={{ fontWeight: "bold", color: "#16a34a", fontSize: "14px" }}>₹{amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Sub-Category Sales */}
              <div style={{ border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px", backgroundColor: "#f9fafb" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", marginBottom: "16px", color: "#111827" }}>📂 Sub-Category Breakdown</h2>
                {Object.keys(subCategoryData).length === 0 ? (
                  <p style={{ color: "#6b7280", fontSize: "14px" }}>No sub-category data available.</p>
                ) : (
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {Object.entries(subCategoryData).map(([subCat, amount]) => (
                      <div key={subCat} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }}>
                        <span style={{ fontWeight: "600", color: "#374151", fontSize: "14px" }}>{subCat}</span>
                        <span style={{ fontWeight: "bold", color: "#2563eb", fontSize: "14px" }}>₹{amount.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          </>
        )}

      </div>
    </div>
  );
}