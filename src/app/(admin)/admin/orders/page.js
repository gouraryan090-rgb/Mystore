"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminOrdersPage() {
  const lockScreen = useAdminProtect();
  const router = useRouter();
  
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All Orders");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatusFilter, setSelectedStatusFilter] = useState("All Status");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [currentPage, setCurrentPage] = useState(1);

  const tabs = ["All Orders", "Pending", "Processing", "In Transit", "Delivered", "Cancelled"];

  useEffect(() => {
    fetchAdminOrders();
  }, []);

  async function fetchAdminOrders() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error("Admin Orders Error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Calculate Metrics Counts
  const totalOrdersCount = orders.length;
  const totalRevenue = orders
    .filter(o => !(o.orderStatus === "Cancelled" || o.status === "Cancelled"))
    .reduce((acc, curr) => acc + (curr.totalAmount || 0), 0);
  const pendingCount = orders.filter(o => (o.status || o.orderStatus || "").toLowerCase() === "pending").length;
  const deliveredCount = orders.filter(o => (o.status || o.orderStatus || "").toLowerCase() === "delivered").length;
  const cancelledCount = orders.filter(o => o.orderStatus === "Cancelled" || o.status === "Cancelled").length;

  // Filtering Logic
  const filteredOrders = orders.filter((order) => {
    const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled";
    const currentStatus = order.status || order.orderStatus || "Pending";

    // Tab Filter
    let matchesTab = true;
    if (activeTab === "Cancelled") {
      matchesTab = isCancelled;
    } else if (activeTab !== "All Orders") {
      if (isCancelled) matchesTab = false;
      else matchesTab = currentStatus.toLowerCase() === activeTab.toLowerCase();
    }

    // Dropdown Status Filter
    let matchesDropdown = true;
    if (selectedStatusFilter !== "All Status") {
      if (selectedStatusFilter === "Cancelled") matchesDropdown = isCancelled;
      else matchesDropdown = currentStatus.toLowerCase() === selectedStatusFilter.toLowerCase();
    }

    // Search Filter (ID, Customer Name, or Phone)
    const orderIdStr = (order.orderId || order._id || "").toString().replace("#", "").toLowerCase();
    const customerName = (order.shippingAddress?.name || "").toLowerCase();
    const phone = (order.shippingAddress?.phone || "").toLowerCase();
    const query = searchTerm.trim().replace("#", "").toLowerCase();

    const matchesSearch = orderIdStr.includes(query) || customerName.includes(query) || phone.includes(query);

    return matchesTab && matchesDropdown && matchesSearch;
  });

  // Pagination calculation
  const totalPages = Math.ceil(filteredOrders.length / rowsPerPage) || 1;
  const paginatedOrders = filteredOrders.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage);

  if (lockScreen) return lockScreen;

  return (
    <div style={{ maxWidth: "1300px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      
      {/* Top Header Title & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "15px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "0 0 4px 0" }}>
            All Orders
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0, fontWeight: "600" }}>
            Manage and view all customer orders
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <button 
            onClick={() => alert("Exporting orders...")}
            style={{ backgroundColor: "#fff", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#0f172a" }}
          >
            📥 Export
          </button>
          <button 
            onClick={fetchAdminOrders}
            style={{ backgroundColor: "#6366f1", border: "none", padding: "10px 18px", borderRadius: "12px", fontWeight: "700", fontSize: "13px", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", color: "#fff", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)" }}
          >
            🔄 Refresh
          </button>
        </div>
      </div>

      {/* STAT CARDS ROW */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "30px" }}>
        <StatBox icon="🛍️" label="Total Orders" value={totalOrdersCount} bg="#eff6ff" />
        <StatBox icon="📈" label="Total Revenue" value={`₹${totalRevenue.toLocaleString()}`} bg="#f0fdf4" />
        <StatBox icon="⏳" label="Pending Orders" value={pendingCount} bg="#fef3c7" />
        <StatBox icon="✅" label="Delivered Orders" value={deliveredCount} bg="#f0fdf4" />
        <StatBox icon="❌" label="Cancelled Orders" value={cancelledCount} bg="#fef2f2" />
      </div>

      {/* SEARCH & FILTERS BAR */}
      <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 2px 10px rgba(0,0,0,0.02)", marginBottom: "24px", display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center" }}>
        
        {/* Search Input */}
        <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
          <span style={{ position: "absolute", left: "14px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by Order ID, Email or Mobile..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px 10px 38px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#f8fafc",
              fontWeight: "600",
              color: "#0f172a"
            }}
          />
        </div>

        {/* Status Dropdown Filter */}
        <div style={{ width: "200px" }}>
          <select
            value={selectedStatusFilter}
            onChange={(e) => setSelectedStatusFilter(e.target.value)}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#f8fafc",
              fontWeight: "600",
              color: "#0f172a"
            }}
          >
            <option value="All Status">All Status</option>
            <option value="Pending">Pending</option>
            <option value="Processing">Processing</option>
            <option value="In Transit">In Transit</option>
            <option value="Delivered">Delivered</option>
            <option value="Cancelled">Cancelled</option>
          </select>
        </div>

        {/* Date Range placeholder */}
        <div style={{ width: "220px" }}>
          <input
            type="text"
            placeholder="Select date range 📅"
            readOnly
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: "12px",
              border: "1px solid #cbd5e1",
              fontSize: "13px",
              outline: "none",
              backgroundColor: "#f8fafc",
              fontWeight: "600",
              color: "#64748b",
              cursor: "not-allowed"
            }}
          />
        </div>
      </div>

      {/* TABS FILTER */}
      <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "10px", marginBottom: "20px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: "8px 16px",
              borderRadius: "12px",
              border: activeTab === tab ? "none" : "1px solid #e2e8f0",
              backgroundColor: activeTab === tab ? "#6366f1" : "#fff",
              color: activeTab === tab ? "#fff" : "#475569",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "13px",
              whiteSpace: "nowrap",
              boxShadow: activeTab === tab ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none",
              transition: "all 0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* ORDERS DATA TABLE CONTAINER */}
      <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", overflow: "hidden" }}>
        
        {loading ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>Loading Orders...</div>
        ) : paginatedOrders.length === 0 ? (
          <div style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>No orders found matching criteria.</div>
        ) : (
          <div style={{ overflowX: "auto" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left", fontSize: "13px" }}>
              <thead>
                <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #f1f5f9", color: "#64748b", fontSize: "11px", fontWeight: "800", letterSpacing: "0.5px" }}>
                  <th style={{ padding: "16px 20px" }}>ORDER ID</th>
                  <th style={{ padding: "16px 20px" }}>CUSTOMER DETAILS</th>
                  <th style={{ padding: "16px 20px" }}>ORDER ITEMS</th>
                  <th style={{ padding: "16px 20px" }}>AMOUNT</th>
                  <th style={{ padding: "16px 20px" }}>STATUS</th>
                  <th style={{ padding: "16px 20px" }}>DATE & TIME</th>
                  <th style={{ padding: "16px 20px", textAlign: "center" }}>ACTION</th>
                </tr>
              </thead>
              <tbody>
                {paginatedOrders.map((order) => {
                  const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled";
                  const currentStatus = isCancelled ? "Cancelled" : (order.status || order.orderStatus || "Pending");
                  const firstItem = order.items?.[0] || {};
                  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent";
                  const formattedTime = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
                  
                  // Accurate Real Order ID presentation
                  const displayOrderId = order.orderId || order._id;

                  return (
                    <tr 
                      key={order._id}
                      style={{ borderBottom: "1px solid #f8fafc", transition: "background 0.1s" }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = "#fcfdfd"}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = "transparent"}
                    >
                      {/* Order ID */}
                      <td style={{ padding: "16px 20px", fontWeight: "800", color: "#6366f1", whiteSpace: "nowrap" }}>
                        #{displayOrderId}
                      </td>

                      {/* Customer Details */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ fontWeight: "800", color: "#0f172a" }}>{order.shippingAddress?.name || "Customer"}</div>
                        <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>
                          {order.shippingAddress?.phone || "N/A"} • {order.shippingAddress?.email || order.email || "zentrobazaar@gmail.com"}
                        </div>
                      </td>

                      {/* Order Items Preview */}
                      <td style={{ padding: "16px 20px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <img
                            src={firstItem.images?.[0] || firstItem.imageUrl || "https://via.placeholder.com/40"}
                            alt=""
                            style={{ width: "36px", height: "36px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e2e8f0" }}
                          />
                          <div>
                            <div style={{ fontWeight: "700", color: "#0f172a", maxWidth: "180px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                              {firstItem.title || "Product Item"}
                            </div>
                            <div style={{ fontSize: "11px", color: "#64748b" }}>
                              Qty: {firstItem.quantity || 1} | {order.paymentMethod || "COD"}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* Amount */}
                      <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                        <div style={{ fontWeight: "900", color: "#0f172a" }}>₹{order.totalAmount}</div>
                        <div style={{ fontSize: "11px", color: "#64748b" }}>{order.paymentMethod || "Online"}</div>
                      </td>

                      {/* Status */}
                      <td style={{ padding: "16px 20px", whiteSpace: "nowrap" }}>
                        <span
                          style={{
                            backgroundColor: isCancelled ? "#fee2e2" : currentStatus.toLowerCase() === "delivered" ? "#dcfce7" : "#fef3c7",
                            color: isCancelled ? "#dc2626" : currentStatus.toLowerCase() === "delivered" ? "#166534" : "#92400e",
                            padding: "4px 10px",
                            borderRadius: "10px",
                            fontSize: "11px",
                            fontWeight: "800",
                          }}
                        >
                          {currentStatus}
                        </span>
                      </td>

                      {/* Date & Time */}
                      <td style={{ padding: "16px 20px", whiteSpace: "nowrap", color: "#475569", fontWeight: "600" }}>
                        <div>{formattedDate}</div>
                        <div style={{ fontSize: "11px", color: "#94a3b8" }}>{formattedTime}</div>
                      </td>

                      {/* Action Icon */}
                      <td style={{ padding: "16px 20px", textAlign: "center" }}>
                        <button
                          onClick={() => router.push(`/admin/orders/${order._id}`)}
                          style={{
                            backgroundColor: "#f8fafc",
                            border: "1px solid #e2e8f0",
                            borderRadius: "10px",
                            padding: "8px 12px",
                            cursor: "pointer",
                            fontSize: "14px",
                            transition: "background 0.2s"
                          }}
                          title="View Order Details"
                        >
                          👁️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* PAGINATION FOOTER BAR */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", borderTop: "1px solid #f1f5f9", flexWrap: "wrap", gap: "10px" }}>
          <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
            Showing {filteredOrders.length > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0} to {Math.min(currentPage * rowsPerPage, filteredOrders.length)} of {filteredOrders.length} orders
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
            {/* Page number buttons */}
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#fff", cursor: currentPage === 1 ? "not-allowed" : "pointer", fontWeight: "700" }}
              >
                &lt;
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "8px",
                    border: "none",
                    backgroundColor: currentPage === i + 1 ? "#6366f1" : "#f1f5f9",
                    color: currentPage === i + 1 ? "#fff" : "#475569",
                    fontWeight: "800",
                    cursor: "pointer"
                  }}
                >
                  {i + 1}
                </button>
              ))}

              <button
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                style={{ padding: "6px 12px", borderRadius: "8px", border: "1px solid #e2e8f0", backgroundColor: "#fff", cursor: currentPage === totalPages ? "not-allowed" : "pointer", fontWeight: "700" }}
              >
                &gt;
              </button>
            </div>

            {/* Rows per page selector */}
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
              <span>Rows per page</span>
              <select
                value={rowsPerPage}
                onChange={(e) => { setRowsPerPage(Number(e.target.value)); setCurrentPage(1); }}
                style={{ padding: "6px 10px", borderRadius: "8px", border: "1px solid #cbd5e1", outline: "none", fontWeight: "700", backgroundColor: "#f8fafc" }}
              >
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function StatBox({ icon, label, value, bg }) {
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