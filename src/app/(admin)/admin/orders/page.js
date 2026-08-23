"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function AdminOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("All");

  const tabs = [
    { label: "All Orders", value: "All" },
    { label: "Pending (Unmarked)", value: "Pending" },
    { label: "Processing (In Preparation)", value: "Processing" },
    { label: "In Transit", value: "In Transit" },
    { label: "Delivered", value: "Delivered" },
    { label: "Cancelled", value: "Cancelled" },
  ];

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

  // 100% accurate client-side filtering for each tab
  const filteredOrders = orders.filter((order) => {
    const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled";
    const currentStatus = order.status || order.orderStatus || "Pending";

    if (activeTab === "All") return true;
    if (activeTab === "Cancelled") return isCancelled;
    
    // Agar order cancelled hai toh use doosri tabs mein mat dikhao
    if (isCancelled) return false;
    
    return currentStatus.toLowerCase() === activeTab.toLowerCase();
  });

  return (
    <div style={{ maxWidth: "1000px", margin: "32px auto", padding: "0 20px" }}>
      {/* Navigation Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>
          📦 Manage Orders
        </h1>
        <Link
          href="/admin"
          style={{
            backgroundColor: "#1f2937",
            color: "#fff",
            padding: "8px 16px",
            borderRadius: "8px",
            textDecoration: "none",
            fontWeight: "bold",
            fontSize: "14px"
          }}
        >
          ← Back to Dashboard
        </Link>
      </div>

      {/* Filter Tabs */}
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "24px" }}>
        {tabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveTab(tab.value)}
            style={{
              padding: "8px 14px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "13px",
              cursor: "pointer",
              backgroundColor: activeTab === tab.value ? "#2563eb" : "#e5e7eb",
              color: activeTab === tab.value ? "#fff" : "#374151",
              transition: "background-color 0.2s"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ padding: "40px", textAlign: "center" }}>Loading Orders...</div>
      ) : filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9fafb", borderRadius: "12px" }}>
          <p style={{ color: "#6b7280" }}>Is category mein koi order nahi hai.</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredOrders.map((order) => {
            const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled";
            const currentStatus = isCancelled ? "Cancelled" : (order.status || order.orderStatus || "Pending");

            return (
              <div
                key={order._id}
                onClick={() => router.push(`/admin/orders/${order._id}`)}
                style={{
                  backgroundColor: "#fff",
                  border: isCancelled ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {/* Header */}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "12px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>ORDER ID (Click for Full Details)</div>
                    <div style={{ fontSize: "14px", fontWeight: "bold", color: "#2563eb" }}>#{order._id}</div>
                  </div>
                  <div>
                    <span
                      style={{
                        backgroundColor: isCancelled ? "#fee2e2" : "#dcfce7",
                        color: isCancelled ? "#dc2626" : "#166534",
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "4px 10px",
                        borderRadius: "12px",
                      }}
                    >
                      {currentStatus}
                    </span>
                  </div>
                </div>

                {/* Items */}
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "8px" }}>
                    <img
                      src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/50"}
                      alt={item.title || "Product"}
                      style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "6px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: "14px", textDecoration: isCancelled ? "line-through" : "none" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>
                        Qty: {item.quantity || 1} | Price: ₹{item.offerPrice || item.price}
                      </div>
                    </div>
                  </div>
                ))}

                {/* Cancellation Reason Display if cancelled */}
                {isCancelled && order.cancellationReason && (
                  <div style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px", fontStyle: "italic", backgroundColor: "#fef2f2", padding: "6px 10px", borderRadius: "6px" }}>
                    Reason: {order.cancellationReason}
                  </div>
                )}

                {/* Shipping Details */}
                <div style={{ borderTop: "1px solid #f3f4f6", marginTop: "12px", paddingTop: "12px", display: "flex", justifyContent: "space-between", fontSize: "13px" }}>
                  <div>
                    <strong>Customer:</strong> {order.shippingAddress?.name || "N/A"} <br />
                    <strong>Phone:</strong> {order.shippingAddress?.phone || "N/A"} <br />
                    <strong>Address:</strong> {order.shippingAddress?.address || order.shippingAddress?.street1 || "N/A"}, {order.shippingAddress?.city || ""}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ color: "#6b7280" }}>Payment: {order.paymentMethod}</div>
                    <div style={{ fontSize: "16px", fontWeight: "bold", color: "#16a34a", marginTop: "4px" }}>
                      Total: ₹{order.totalAmount}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}