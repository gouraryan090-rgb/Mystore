"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

// Status translation function
const getCustomerStatus = (dbStatus) => {
  switch (dbStatus) {
    case "Pending": return "Placed";
    case "Processing": return "Order in Preparation";
    case "In Transit": return "Order in Transit";
    case "Delivered": return "Delivered";
    case "Cancelled": return "Cancelled";
    default: return dbStatus || "Placed";
  }
};

export default function YourOrdersPage() {
  const router = useRouter();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);
  const [filterStatus, setFilterStatus] = useState("All Orders");

  // Cancellation Modal States
  const [selectedOrderForCancel, setSelectedOrderForCancel] = useState(null);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    fetchOrders();
  }, []);

  async function fetchOrders() {
    try {
      const res = await fetch("/api/orders/my-orders");
      const data = await res.json();
      if (data.success) {
        setOrders(data.data || []);
      }
    } catch (err) {
      console.error("Orders fetch error:", err);
    } finally {
      setLoading(false);
    }
  }

  // Check function: 24 Hours time check with fallback for old test orders
  const isCancellable = (createdAt, orderStatus, dbStatus) => {
    const currentStatus = (orderStatus || dbStatus || "Placed").toLowerCase();
    
    if (
      currentStatus === "cancelled" || 
      currentStatus === "delivered" || 
      currentStatus === "in transit" || 
      currentStatus === "processing"
    ) {
      return false;
    }

    if (!createdAt) return true;

    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDiff = (currentTime - orderTime) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason) {
      alert("Please select a reason for cancellation.");
      return;
    }

    const orderId = selectedOrderForCancel;
    setActionLoading(orderId);

    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reason: cancelReason }),
      });

      const data = await res.json();
      alert(data.message);

      if (data.success) {
        setSelectedOrderForCancel(null);
        setCancelReason("");
        fetchOrders();
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
      alert("Unable to cancel the order.");
    } finally {
      setActionLoading(null);
    }
  };

  const handleCopyId = (id) => {
    navigator.clipboard.writeText(id);
    alert("Order ID copied to clipboard!");
  };

  const tabs = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = orders.filter((order) => {
    if (filterStatus === "All Orders") return true;
    const currentStatusLabel = getCustomerStatus(order.status || order.orderStatus).toLowerCase();
    
    if (filterStatus === "Processing") return currentStatusLabel.includes("placed") || currentStatusLabel.includes("preparation");
    if (filterStatus === "Shipped") return currentStatusLabel.includes("transit");
    if (filterStatus === "Delivered") return currentStatusLabel.includes("delivered");
    if (filterStatus === "Cancelled") return currentStatusLabel.includes("cancelled");
    
    return true;
  });

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>Loading your orders...</div>;
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", paddingBottom: "60px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "24px" }}>
        <span style={{ fontSize: "24px" }}>🛍️</span>
        <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
          Your Orders
        </h1>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "8px", marginBottom: "30px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            style={{
              padding: "10px 20px",
              borderRadius: "20px",
              border: filterStatus === tab ? "none" : "1px solid #e2e8f0",
              backgroundColor: filterStatus === tab ? "#6366f1" : "#fff",
              color: filterStatus === tab ? "#fff" : "#475569",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              whiteSpace: "nowrap",
              boxShadow: filterStatus === tab ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
              transition: "all 0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CANCELLATION REASON POPUP MODAL */}
      {selectedOrderForCancel && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", padding: "28px", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>Cancel Order</h3>
            <p style={{ fontSize: "14px", color: "#475569", marginBottom: "16px" }}>Please select a reason for cancelling this order:</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "12px", border: "1px solid #cbd5e1", marginBottom: "20px", fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a", fontWeight: "600" }}
            >
              <option value="">-- Select Reason --</option>
              <option value="Ordered by mistake">Ordered by mistake</option>
              <option value="Delivery time is too long">Delivery time is too long</option>
              <option value="Incorrect address entered">Incorrect address entered</option>
              <option value="Found a better price elsewhere">Found a better price elsewhere</option>
              <option value="Other Reason">Other Reason</option>
            </select>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end" }}>
              <button
                onClick={() => setSelectedOrderForCancel(null)}
                style={{ padding: "10px 18px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", color: "#475569", fontSize: "14px" }}
              >
                Close
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={actionLoading === selectedOrderForCancel}
                style={{ padding: "10px 18px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}
              >
                {actionLoading === selectedOrderForCancel ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
          <p style={{ color: "#64748b", fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}>You have no orders placed in this category.</p>
          <button
            onClick={() => router.push("/")}
            style={{ padding: "12px 24px", backgroundColor: "#6366f1", color: "#fff", border: "none", borderRadius: "14px", cursor: "pointer", fontWeight: "800", fontSize: "14px" }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {filteredOrders.map((order) => {
            const cancellable = isCancellable(order.createdAt, order.orderStatus, order.status);
            const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled" || order.status === "cancelled";
            const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent";

            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "24px",
                  border: "1px solid #f1f5f9",
                  boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                  opacity: isCancelled ? 0.9 : 1,
                }}
              >
                {/* Order Top Bar: ID & Date */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid #f8fafc", paddingBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Order ID</span>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>#{order._id}</strong>
                    <button
                      onClick={() => handleCopyId(order._id)}
                      style={{ background: "none", border: "none", cursor: "pointer", fontSize: "14px", padding: "2px" }}
                      title="Copy ID"
                    >
                      📋
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    {/* Status Badge */}
                    <span
                      style={{
                        backgroundColor: isCancelled ? "#fee2e2" : "#dcfce7",
                        color: isCancelled ? "#dc2626" : "#16a34a",
                        padding: "4px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      ● {getCustomerStatus(order.status || order.orderStatus)}
                    </span>

                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                      📅 {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Items List inside Order */}
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px" }}>
                      <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                        <div style={{ width: "70px", height: "70px", backgroundColor: "#f8fafc", borderRadius: "14px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", flexShrink: 0 }}>
                          <img src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/80"} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", textDecoration: isCancelled ? "line-through" : "none" }}>
                            {item.title}
                          </h4>
                          <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600" }}>
                            Payment: <strong style={{ color: "#0f172a" }}>{order.paymentMethod || "COD"}</strong>
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", marginBottom: "2px" }}>
                          Qty: {item.quantity || item.qty || 1}
                        </div>
                        <div style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                          ₹{item.offerPrice || item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancellation Reason Display if Cancelled */}
                {isCancelled && order.cancellationReason && (
                  <div style={{ fontSize: "13px", color: "#dc2626", fontStyle: "italic", backgroundColor: "#fef2f2", padding: "10px 14px", borderRadius: "12px", border: "1px solid #fee2e2" }}>
                    <strong>Reason:</strong> {order.cancellationReason}
                  </div>
                )}

                {/* Order Footer: Deliver To, Total Bill & Cancel Action */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "14px 20px", borderRadius: "16px", border: "1px solid #f1f5f9", marginTop: "4px", flexWrap: "wrap", gap: "15px" }}>
                  <span style={{ fontSize: "13px", color: "#475569", fontWeight: "600", lineHeight: "1.5" }}>
                    Deliver To: <strong style={{ color: "#0f172a" }}>{order.shippingAddress?.name} ({order.shippingAddress?.phone})</strong>
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <span style={{ fontSize: "14px", fontWeight: "700", color: "#475569" }}>
                      Total: <strong style={{ fontSize: "18px", color: "#059669" }}>₹{order.totalAmount}</strong>
                    </span>

                    {cancellable && (
                      <button
                        onClick={() => setSelectedOrderForCancel(order._id)}
                        style={{
                          backgroundColor: "#ef4444",
                          color: "#fff",
                          border: "none",
                          padding: "8px 14px",
                          borderRadius: "10px",
                          fontSize: "12px",
                          fontWeight: "800",
                          cursor: "pointer",
                          boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)"
                        }}
                      >
                        Cancel Order
                      </button>
                    )}
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