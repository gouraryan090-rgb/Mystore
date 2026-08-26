"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

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

  // 24 Hours time check for cancellation
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

  // PDF Generator Function
  const generateReceiptPDF = (order) => {
    const doc = new jsPDF();
    
    const primaryColor = [99, 102, 241]; 
    const textColor = [15, 23, 42];      
    const grayColor = [100, 116, 139];   

    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("ZENTROBAZAAR", 14, 20);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text("Digital Tax Invoice / Receipt", 14, 26);

    doc.setFontSize(9);
    doc.text("Nawa City, Rajasthan - 341509", 200, 20, { align: "right" });
    doc.text("Email: zentrobazaar.shop@gmail.com", 200, 25, { align: "right" });
    doc.text("Mobile: +91 7378200781", 200, 30, { align: "right" });

    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 42, 196, 42);

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    doc.text("Order Details:", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: #${order._id}`, 14, 59);
    doc.text(`Date: ${order.createdAt ? new Date(order.createdAt).toLocaleDateString() : "Recent"}`, 14, 66);
    doc.text(`Payment Method: ${order.paymentMethod || "COD"}`, 14, 73);

    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address:", 110, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${order.shippingAddress?.name || "Customer"}`, 110, 59);
    doc.text(`Phone: ${order.shippingAddress?.phone || "N/A"}`, 110, 66);
    doc.text(`Address: ${order.shippingAddress?.address || "Nawa City"}`, 110, 73, { maxWidth: 85 });

    doc.setFillColor(241, 245, 249);
    doc.rect(14, 85, 182, 8, "F");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text("Item Description", 18, 91);
    doc.text("Qty", 120, 91);
    doc.text("Price", 145, 91);
    doc.text("Total", 175, 91);

    let startY = 99;
    doc.setFont("helvetica", "normal");
    
    const items = order.items || [];
    items.forEach((item) => {
      const title = item.title || "Product Item";
      const qty = item.quantity || item.qty || 1;
      const price = item.offerPrice || item.price || 0;
      const itemTotal = qty * price;

      doc.text(title, 18, startY, { maxWidth: 95 });
      doc.text(String(qty), 120, startY);
      doc.text(`Rs. ${price}`, 145, startY);
      doc.text(`Rs. ${itemTotal}`, 175, startY);

      startY += 10;
    });

    doc.line(14, startY + 2, 196, startY + 2);
    startY += 10;

    const subtotal = order.totalAmount || items.reduce((acc, item) => acc + (item.quantity || item.qty || 1) * (item.offerPrice || item.price || 0), 0);
    const shipping = order.shippingFee || 0;
    const grandTotal = subtotal + shipping;

    doc.setFont("helvetica", "normal");
    doc.text("Subtotal:", 130, startY);
    doc.text(`Rs. ${subtotal}`, 175, startY);

    startY += 7;
    doc.text("Shipping Fee:", 130, startY);
    doc.text(`Rs. ${shipping}`, 175, startY);

    startY += 8;
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...primaryColor);
    doc.text("Grand Total:", 130, startY);
    doc.text(`Rs. ${grandTotal}`, 175, startY);

    startY += 25;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text("Thank you for shopping with ZENTROBAZAAR! Computer generated receipt.", 14, startY);

    doc.save(`ZentroBazaar-Invoice-${order._id}.pdf`);
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
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", minHeight: "60vh", color: "#64748b", fontWeight: "700", fontSize: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#fff", padding: "20px 30px", borderRadius: "16px", boxShadow: "0 10px 25px rgba(0,0,0,0.05)" }}>
          <span style={{ animation: "spin 1s linear infinite" }}>⏳</span> Loading your active orders...
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "860px", margin: "0 auto", paddingBottom: "80px", fontFamily: "system-ui, -apple-system, sans-serif", paddingLeft: "20px", paddingRight: "20px" }}>
      
      {/* Page Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px", paddingTop: "28px", borderBottom: "1px solid #f1f5f9", paddingBottom: "16px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ width: "48px", height: "48px", borderRadius: "14px", backgroundColor: "#e0e7ff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px" }}>
            📦
          </div>
          <div>
            <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: 0, letterSpacing: "-0.5px" }}>
              My Orders
            </h1>
            <p style={{ fontSize: "13px", color: "#64748b", margin: "2px 0 0 0", fontWeight: "600" }}>
              Track, download invoices, and manage your purchases
            </p>
          </div>
        </div>
      </div>

      {/* Status Filter Tabs */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "12px", marginBottom: "24px" }}>
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => setFilterStatus(tab)}
            style={{
              padding: "10px 18px",
              borderRadius: "14px",
              border: filterStatus === tab ? "none" : "1px solid #e2e8f0",
              backgroundColor: filterStatus === tab ? "#6366f1" : "#ffffff",
              color: filterStatus === tab ? "#fff" : "#475569",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "13px",
              whiteSpace: "nowrap",
              boxShadow: filterStatus === tab ? "0 4px 14px rgba(99, 102, 241, 0.3)" : "0 1px 2px rgba(0,0,0,0.02)",
              transition: "all 0.2s"
            }}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* CANCELLATION REASON POPUP MODAL */}
      {selectedOrderForCancel && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", width: "100%", maxWidth: "420px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <h3 style={{ margin: "0 0 8px 0", fontSize: "18px", fontWeight: "900", color: "#0f172a" }}>Cancel Order</h3>
            <p style={{ fontSize: "13px", color: "#64748b", marginBottom: "20px", fontWeight: "600" }}>Please choose a reason for cancelling this order:</p>

            <select
              value={cancelReason}
              onChange={(e) => setCancelReason(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "14px", border: "1px solid #cbd5e1", marginBottom: "24px", fontSize: "13px", outline: "none", backgroundColor: "#f8fafc", color: "#0f172a", fontWeight: "600" }}
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
                style={{ padding: "10px 18px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", color: "#475569", fontSize: "13px" }}
              >
                Close
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={actionLoading === selectedOrderForCancel}
                style={{ padding: "10px 18px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "13px", boxShadow: "0 4px 12px rgba(239, 68, 68, 0.3)" }}
              >
                {actionLoading === selectedOrderForCancel ? "Processing..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "64px 20px", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>🛒</div>
          <h3 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>No orders found</h3>
          <p style={{ color: "#64748b", fontWeight: "600", fontSize: "13px", marginBottom: "20px" }}>You haven't placed any orders matching this filter view.</p>
          <button
            onClick={() => router.push("/")}
            style={{ padding: "12px 24px", backgroundColor: "#6366f1", color: "#fff", border: "none", borderRadius: "14px", cursor: "pointer", fontWeight: "800", fontSize: "13px", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)" }}
          >
            Explore Store Products
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
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 10px 30px -10px rgba(0,0,0,0.05)",
                  padding: "24px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "18px",
                  opacity: isCancelled ? 0.9 : 1,
                  transition: "all 0.2s"
                }}
              >
                {/* Order Top Bar: ID & Date */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px", borderBottom: "1px solid #f1f5f9", paddingBottom: "14px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>Order ID</span>
                    <strong style={{ fontSize: "13px", color: "#0f172a" }}>#{order._id}</strong>
                    <button
                      onClick={() => handleCopyId(order._id)}
                      style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "6px", cursor: "pointer", fontSize: "12px", padding: "2px 6px" }}
                      title="Copy ID"
                    >
                      📋
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                    {/* Status Badge */}
                    <span
                      style={{
                        backgroundColor: isCancelled ? "#fee2e2" : "#f0fdf4",
                        color: isCancelled ? "#dc2626" : "#16a34a",
                        border: `1px solid ${isCancelled ? "#fecaca" : "#bbf7d0"}`,
                        padding: "6px 12px",
                        borderRadius: "12px",
                        fontSize: "12px",
                        fontWeight: "800",
                      }}
                    >
                      ● {getCustomerStatus(order.status || order.orderStatus)}
                    </span>

                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "700" }}>
                      📅 {formattedDate}
                    </span>
                  </div>
                </div>

                {/* Items List inside Order */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: "16px", backgroundColor: "#f8fafc", padding: "12px 16px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "60px", height: "60px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", padding: "4px", flexShrink: 0 }}>
                          <img src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/80"} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px 0", textDecoration: isCancelled ? "line-through" : "none" }}>
                            {item.title}
                          </h4>
                          <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "600" }}>
                            Payment Mode: <strong style={{ color: "#0f172a" }}>{order.paymentMethod || "COD"}</strong>
                          </span>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700", marginBottom: "2px" }}>
                          Qty: {item.quantity || item.qty || 1}
                        </div>
                        <div style={{ fontSize: "15px", fontWeight: "900", color: "#0f172a" }}>
                          ₹{item.offerPrice || item.price}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Cancellation Reason Display if Cancelled */}
                {isCancelled && order.cancellationReason && (
                  <div style={{ fontSize: "13px", color: "#dc2626", fontStyle: "italic", backgroundColor: "#fef2f2", padding: "10px 14px", borderRadius: "12px", border: "1px solid #fee2e2" }}>
                    <strong>Reason for cancellation:</strong> {order.cancellationReason}
                  </div>
                )}

                {/* Order Footer: Deliver To, Total Bill, Cancel Action & Download Receipt Button */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#ffffff", padding: "14px 18px", borderRadius: "16px", border: "1px solid #e2e8f0", flexWrap: "wrap", gap: "15px" }}>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", lineHeight: "1.4" }}>
                    Deliver To: <strong style={{ color: "#0f172a" }}>{order.shippingAddress?.name} ({order.shippingAddress?.phone})</strong>
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "14px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", fontWeight: "700", color: "#64748b" }}>
                      Total Amount: <strong style={{ fontSize: "17px", color: "#059669" }}>₹{order.totalAmount}</strong>
                    </span>

                    {/* Download Receipt Button */}
                    <button
                      onClick={() => generateReceiptPDF(order)}
                      style={{
                        backgroundColor: "#0f172a",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "800",
                        cursor: "pointer",
                        boxShadow: "0 2px 8px rgba(15, 23, 42, 0.2)"
                      }}
                    >
                      📄 Download Invoice
                    </button>

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