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
    
    // Agar order Cancelled ho ya Processing se aage badh chuka ho (In Transit, Delivered) toh cancel allow na karein
    if (
      currentStatus === "cancelled" || 
      currentStatus === "delivered" || 
      currentStatus === "in transit" || 
      currentStatus === "processing"
    ) {
      return false;
    }

    // Fallback: Agar purane test orders me createdAt field miss ho, tab bhi button dikhega
    if (!createdAt) return true;

    const orderTime = new Date(createdAt).getTime();
    const currentTime = new Date().getTime();
    const hoursDiff = (currentTime - orderTime) / (1000 * 60 * 60);

    return hoursDiff <= 24;
  };

  const handleCancelSubmit = async () => {
    if (!cancelReason) {
      alert("Kripya cancellation ka reason select karein.");
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
        fetchOrders(); // List update karega
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
      alert("Order cancel nahi ho saka.");
    } finally {
      setActionLoading(null);
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading your orders...</div>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "32px auto", padding: "0 20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        📦 Your Orders
      </h1>

      {/* CANCELLATION REASON POPUP MODAL */}
      {selectedOrderForCancel && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", width: "90%", maxWidth: "400px" }}>
            <h3 style={{ margin: "0 0 12px 0", fontSize: "18px", fontWeight: "bold", color: "#111827" }}>Cancel Order</h3>
            <p style={{ fontSize: "14px", color: "#4b5563", marginBottom: "12px" }}>Kripya order cancel karne ka reason chuney:</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", marginBottom: "12px", fontSize: "14px", outline: "none" }}
            >
              <option value="">-- Select Reason --</option>
              <option value="Galti se order ho gaya">Galti se order ho gaya</option>
              <option value="Delivery time zyada hai">Delivery time zyada hai</option>
              <option value="Sahi address enter nahi kiya">Sahi address enter nahi kiya</option>
              <option value="Kahi aur se sasta mil raha hai">Kahi aur se sasta mil raha hai</option>
              <option value="Other Reason">Other Reason</option>
            </select>

            <div style={{ display: "flex", gap: "10px", justifyContent: "flex-end", marginTop: "16px" }}>
              <button
                onClick={() => setSelectedOrderForCancel(null)}
                style={{ padding: "8px 16px", backgroundColor: "#e5e7eb", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold", color: "#374151" }}
              >
                Close
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={actionLoading === selectedOrderForCancel}
                style={{ padding: "8px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" }}
              >
                {actionLoading === selectedOrderForCancel ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS LIST */}
      {orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#f9fafb", borderRadius: "12px" }}>
          <p style={{ color: "#6b7280" }}>Aapne abhi tak koi order nahi kiya hai.</p>
          <button
            onClick={() => router.push("/")}
            style={{ marginTop: "12px", padding: "10px 20px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {orders.map((order) => {
            const cancellable = isCancellable(order.createdAt, order.orderStatus, order.status);
            const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled";

            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  border: isCancelled ? "1px solid #fca5a5" : "1px solid #e5e7eb",
                  borderRadius: "12px",
                  padding: "16px",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                  opacity: isCancelled ? 0.85 : 1,
                }}
              >
                {/* Header Info */}
                <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f3f4f6", paddingBottom: "12px", marginBottom: "12px" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>ORDER ID</div>
                    <div style={{ fontSize: "14px", fontWeight: "bold" }}>
                      #{order._id}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <span
                      style={{
                        backgroundColor: isCancelled ? "#fee2e2" : "#dcfce7",
                        color: isCancelled ? "#dc2626" : "#166534",
                        fontSize: "12px",
                        fontWeight: "bold",
                        padding: "4px 10px",
                        borderRadius: "12px",
                        border: isCancelled ? "1px solid #f87171" : "none",
                      }}
                    >
                      {getCustomerStatus(order.status || order.orderStatus)}
                    </span>
                  </div>
                </div>

                {/* Items List */}
                {order.items?.map((item, idx) => (
                  <div key={idx} style={{ display: "flex", gap: "12px", alignItems: "center", marginBottom: "12px" }}>
                    <img
                      src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/60"}
                      alt={item.title || "Product"}
                      style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "6px" }}
                    />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: "bold", fontSize: "14px", textDecoration: isCancelled ? "line-through" : "none" }}>
                        {item.title}
                      </div>
                      <div style={{ fontSize: "12px", color: "#6b7280" }}>Payment: {order.paymentMethod}</div>
                    </div>
                    <div style={{ fontWeight: "bold", fontSize: "15px" }}>₹{item.offerPrice || item.price}</div>
                  </div>
                ))}

                {/* Cancellation Reason Display */}
                {isCancelled && order.cancellationReason && (
                  <div style={{ fontSize: "12px", color: "#dc2626", marginBottom: "8px", fontStyle: "italic", backgroundColor: "#fef2f2", padding: "6px 10px", borderRadius: "6px" }}>
                    Reason: {order.cancellationReason}
                  </div>
                )}

                {/* Shipping & Bill Summary + Cancel Action Button */}
                <div style={{ borderTop: "1px solid #f3f4f6", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    <strong>Deliver To:</strong> {order.shippingAddress?.name} ({order.shippingAddress?.phone})<br />
                    <strong>Total:</strong> ₹{order.totalAmount}
                  </div>

                  {cancellable && (
                    <button
                      onClick={() => setSelectedOrderForCancel(order._id)}
                      style={{
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "6px",
                        fontSize: "13px",
                        fontWeight: "bold",
                        cursor: "pointer",
                      }}
                    >
                      Cancel Order
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}