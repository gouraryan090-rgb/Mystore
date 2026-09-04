"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { generateReceiptPDF } from "@/lib/generateInvoice";

const getCustomerStatus = (orderStatus, paymentStatus) => {
  const currentStatus = (orderStatus || "Pending").toLowerCase();
  
  if (currentStatus === "cancelled") return "Cancelled";
  if (currentStatus === "delivered") return "Delivered";
  if (currentStatus === "in transit" || currentStatus === "shipped") return "Shipped";
  if (currentStatus === "processing") return "Processing";

  if (paymentStatus === "Paid") {
    return "Order Placed";
  }

  return "Placed";
};

export default function OrderDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const orderId = params?.id;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState("");

  useEffect(() => {
    if (orderId) {
      const queryParams = new URLSearchParams(window.location.search);
      const cashfreeOrderId = queryParams.get("order_id") || queryParams.get("cf_id");
      const razorpayPaymentId = queryParams.get("razorpay_payment_id");

      if (cashfreeOrderId) {
        verifyCashfreePayment(orderId, cashfreeOrderId);
      } else if (razorpayPaymentId) {
        verifyRazorpayPayment(orderId, razorpayPaymentId, queryParams.get("razorpay_order_id"), queryParams.get("razorpay_signature"));
      } else {
        fetchOrderDetails();
      }
    }
  }, [orderId]);

  async function verifyCashfreePayment(id, cfOrderId) {
    try {
      const res = await fetch("/api/orders/verify/cashfree", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId: id, cashfree_order_id: cfOrderId }),
      });
      const data = await res.json();
      if (data.success) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error("Cashfree verification error:", err);
    } finally {
      fetchOrderDetails();
    }
  }

  async function verifyRazorpayPayment(id, razorpayPaymentId, razorpayOrderId, razorpaySignature) {
    try {
      const res = await fetch("/api/orders/verify/razorpay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          orderId: id,
          razorpay_payment_id: razorpayPaymentId,
          razorpay_order_id: razorpayOrderId,
          razorpay_signature: razorpaySignature,
        }),
      });
      const data = await res.json();
      if (data.success) {
        window.history.replaceState({}, document.title, window.location.pathname);
      }
    } catch (err) {
      console.error("Razorpay verification error:", err);
    } finally {
      fetchOrderDetails();
    }
  }

  async function fetchOrderDetails() {
    try {
      const res = await fetch(`/api/orders/${orderId}`);
      const data = await res.json();
      if (data.success) {
        setOrder(data.data);
      } else {
        alert(data.message || "Order not found");
      }
    } catch (err) {
      console.error("Fetch order detail error:", err);
    } finally {
      setLoading(false);
    }
  }

  const isCancellable = (createdAt, orderStatus, dbStatus) => {
    const currentStatus = (orderStatus || dbStatus || "Placed").toLowerCase();
    if (["cancelled", "delivered", "in transit", "shipped", "processing"].includes(currentStatus)) {
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
    setActionLoading(true);
    try {
      const res = await fetch("/api/orders/cancel", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, reason: cancelReason }),
      });
      const data = await res.json();
      alert(data.message);
      if (data.success) {
        setShowCancelModal(false);
        setCancelReason("");
        fetchOrderDetails();
      }
    } catch (error) {
      console.error("Cancel Order Error:", error);
      alert("Unable to cancel the order.");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#64748b", fontWeight: "600", fontSize: "15px" }}>Loading order details...</div>
      </div>
    );
  }

  if (!order) {
    return (
      <div style={{ textAlign: "center", padding: "80px 20px" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "12px" }}>Order not found</h2>
        <button onClick={() => router.push("/orders")} style={{ padding: "10px 20px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "10px", fontWeight: "700", cursor: "pointer" }}>
          Back to My Orders
        </button>
      </div>
    );
  }

  const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled" || order.status === "cancelled";
  const isDelivered = order.orderStatus === "Delivered" || order.status === "Delivered" || order.status === "delivered";
  const isShipped = order.orderStatus === "In Transit" || order.status === "Shipped" || order.status === "in transit";
  const cancellable = isCancellable(order.createdAt, order.orderStatus, order.status);
  const customerStatusLabel = getCustomerStatus(order.orderStatus || order.status, order.paymentStatus);
  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : "Recent";

  let badgeBg = "#fef3c7";
  let badgeColor = "#d97706";
  if (order.paymentStatus === "Paid" && (!order.orderStatus || order.orderStatus === "Pending")) {
    badgeBg = "#dcfce7";
    badgeColor = "#16a34a";
  }
  if (isDelivered) { badgeBg = "#dcfce7"; badgeColor = "#16a34a"; }
  if (isShipped) { badgeBg = "#e0e7ff"; badgeColor = "#4f46e5"; }
  if (isCancelled) { badgeBg = "#fee2e2"; badgeColor = "#dc2626"; }

  const isOnline = order.paymentMethod === "Online" || order.paymentMethod === "ONLINE" || order.paymentMethod === "Cashfree" || order.paymentMethod === "Razorpay";

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", paddingBottom: "80px", fontFamily: "system-ui, -apple-system, sans-serif", paddingLeft: "24px", paddingRight: "24px" }}>
      <div style={{ margin: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px" }}>
        <div>
          <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", marginBottom: "8px" }}>
            <span style={{ color: "#4f46e5", cursor: "pointer" }} onClick={() => router.push("/")}>Home</span> &gt; <span style={{ color: "#4f46e5", cursor: "pointer" }} onClick={() => router.push("/orders")}>My Orders</span> &gt; <span style={{ color: "#0f172a" }}>Details</span>
          </div>
          <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
            Order Details
          </h1>
        </div>

        <button
          onClick={() => router.push("/orders")}
          style={{ backgroundColor: "#f1f5f9", color: "#475569", border: "none", padding: "10px 18px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}
        >
          ← Back to Orders
        </button>
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "16px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Order ID: </span>
            <strong style={{ fontSize: "15px", color: "#0f172a" }}>#{order._id}</strong>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span style={{ backgroundColor: badgeBg, color: badgeColor, padding: "6px 14px", borderRadius: "10px", fontSize: "12px", fontWeight: "700" }}>
              {customerStatusLabel}
            </span>
            <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>📅 {formattedDate}</span>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px", marginTop: "20px" }}>
          <div>
            <h4 style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", fontWeight: "700" }}>Shipping Address</h4>
            <p style={{ margin: "0 0 4px 0", fontWeight: "700", color: "#0f172a", fontSize: "14px" }}>{order.shippingAddress?.name}</p>
            <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>{order.shippingAddress?.address}</p>
            <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>Phone: {order.shippingAddress?.phone}</p>
          </div>

          <div>
            <h4 style={{ fontSize: "13px", color: "#64748b", textTransform: "uppercase", marginBottom: "6px", fontWeight: "700" }}>Payment & Summary</h4>
            <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>
              Type: <strong style={{ color: isOnline ? "#16a34a" : "#d97706" }}>{isOnline ? "Prepaid (Online)" : "Cash on Delivery (COD)"}</strong>
            </p>
            <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>
              Payment Status: <strong style={{ color: order.paymentStatus === "Paid" ? "#16a34a" : "#dc2626" }}>{order.paymentStatus || "Pending"}</strong>
            </p>
            
            {order.paymentId && (
              <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>
                Transaction ID: <strong style={{ color: "#0f172a", wordBreak: "break-all" }}>{order.paymentId}</strong>
              </p>
            )}

            <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>Items Total: <strong style={{ color: "#0f172a" }}>₹{order.totalAmount}</strong></p>
            <p style={{ margin: "0 0 4px 0", color: "#475569", fontSize: "13px" }}>Shipping Fee: <strong style={{ color: "#0f172a" }}>₹{order.shippingFee || 0}</strong></p>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "24px" }}>
        <h3 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 16px 0" }}>Ordered Items</h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {order.items?.map((item, idx) => (
            <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", paddingBottom: "16px", borderBottom: idx < order.items.length - 1 ? "1px solid #f1f5f9" : "none" }}>
              <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
                <div style={{ width: "75px", height: "75px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", flexShrink: 0 }}>
                  <img src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/75"} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                </div>
                <div>
                  <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0", lineHeight: "1.4" }}>
                    {item.title}
                  </h4>
                  <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", display: "flex", gap: "12px" }}>
                    <span>Qty: <strong style={{ color: "#0f172a" }}>{item.quantity || item.qty || 1}</strong></span>
                    {item.variant && <span>Variant: <strong style={{ color: "#0f172a" }}>{item.variant}</strong></span>}
                  </div>
                </div>
              </div>

              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                  ₹{item.offerPrice || item.price}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: "flex", gap: "12px", justifyContent: "flex-end", flexWrap: "wrap" }}>
        <button
          onClick={() => generateReceiptPDF(order)}
          style={{ backgroundColor: "#1e293b", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(15, 23, 42, 0.2)" }}
        >
          📄 Download Tax Invoice
        </button>

        {cancellable && (
          <button
            onClick={() => setShowCancelModal(true)}
            style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "12px", fontSize: "13px", fontWeight: "700", cursor: "pointer", boxShadow: "0 2px 8px rgba(239, 68, 68, 0.25)" }}
          >
            Cancel Order
          </button>
        )}
      </div>

      {showCancelModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", padding: "28px", borderRadius: "20px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "800", color: "#0f172a" }}>Cancel Order</h3>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "16px" }}>Please select a reason for cancelling this order:</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "10px", border: "1px solid #cbd5e1", marginBottom: "20px", fontSize: "14px", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a" }}
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
                onClick={() => setShowCancelModal(false)}
                style={{ padding: "10px 16px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", color: "#475569", fontSize: "14px" }}
              >
                Close
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={actionLoading}
                style={{ padding: "10px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
              >
                {actionLoading ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}