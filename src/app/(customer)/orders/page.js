"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";

const getCustomerStatus = (dbStatus) => {
  switch (dbStatus) {
    case "Pending": return "Placed";
    case "Processing": return "Processing";
    case "In Transit": return "Shipped";
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
  const [searchQuery, setSearchQuery] = useState("");

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
    doc.text("Thank you for shopping with ZENTROBAZAAR! This is a computer-generated receipt.", 14, startY);

    doc.save(`ZentroBazaar-Invoice-${order._id}.pdf`);
  };

  const totalOrdersCount = orders.length;
  const deliveredCount = orders.filter(o => getCustomerStatus(o.status || o.orderStatus) === "Delivered").length;
  const processingCount = orders.filter(o => getCustomerStatus(o.status || o.orderStatus) === "Processing").length;
  const cancelledCount = orders.filter(o => getCustomerStatus(o.status || o.orderStatus) === "Cancelled").length;

  const tabs = ["All Orders", "Processing", "Shipped", "Delivered", "Cancelled"];

  const filteredOrders = orders.filter((order) => {
    const matchesSearch = 
      order._id?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.items?.some(i => i.title?.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;
    if (filterStatus === "All Orders") return true;

    const currentStatusLabel = getCustomerStatus(order.status || order.orderStatus).toLowerCase();
    if (filterStatus === "Processing") return currentStatusLabel.includes("processing") || currentStatusLabel.includes("placed");
    if (filterStatus === "Shipped") return currentStatusLabel.includes("shipped") || currentStatusLabel.includes("transit");
    if (filterStatus === "Delivered") return currentStatusLabel.includes("delivered");
    if (filterStatus === "Cancelled") return currentStatusLabel.includes("cancelled");
    
    return true;
  });

  if (loading) {
    return (
      <div style={{ minHeight: "60vh", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ color: "#64748b", fontWeight: "600", fontSize: "15px" }}>Loading your orders...</div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "1280px", margin: "0 auto", paddingBottom: "80px", fontFamily: "system-ui, -apple-system, sans-serif", paddingLeft: "24px", paddingRight: "24px" }}>
      
      {/* Banner */}
      <div style={{ 
        background: "#f8fafc", 
        borderRadius: "24px", 
        padding: "36px 44px", 
        marginTop: "24px", 
        marginBottom: "28px",
        border: "1px solid #e2e8f0",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "20px"
      }}>
        <div>
          <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 4px 0", letterSpacing: "-0.5px" }}>
            My Orders
          </h1>
          <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 12px 0", fontWeight: "500" }}>
            Track, return or buy again
          </p>
          <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
            <span style={{ color: "#4f46e5", cursor: "pointer" }} onClick={() => router.push("/")}>Home</span> &gt; <span style={{ color: "#0f172a" }}>My Orders</span>
          </div>
        </div>
        
        <div style={{ width: "90px", height: "90px", display: "flex", alignItems: "center", justifyContent: "center", background: "#ede9fe", borderRadius: "20px", fontSize: "38px" }}>
          🛍️
        </div>
      </div>

      {/* Stat Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "16px", marginBottom: "28px" }}>
        
        <div style={{ background: "#fff", padding: "20px 22px", borderRadius: "18px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#f1f5f9", color: "#475569", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>📦</div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Total Orders</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a" }}>{totalOrdersCount}</div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "20px 22px", borderRadius: "18px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#dcfce7", color: "#16a34a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>✅</div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Delivered</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a" }}>{deliveredCount}</div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "20px 22px", borderRadius: "18px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#fef3c7", color: "#d97706", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>⏳</div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Processing</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a" }}>{processingCount}</div>
          </div>
        </div>

        <div style={{ background: "#fff", padding: "20px 22px", borderRadius: "18px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", gap: "16px" }}>
          <div style={{ width: "46px", height: "46px", borderRadius: "14px", background: "#fee2e2", color: "#dc2626", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>❌</div>
          <div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Cancelled</div>
            <div style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a" }}>{cancelledCount}</div>
          </div>
        </div>

      </div>

      {/* Filter and Search Layout */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "28px", flexWrap: "wrap", alignItems: "center" }}>
        <div style={{ flex: 1, minWidth: "260px", position: "relative" }}>
          <span style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
          <input
            type="text"
            placeholder="Search by Order ID or Product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: "100%",
              padding: "12px 16px 12px 44px",
              borderRadius: "14px",
              border: "1px solid #e2e8f0",
              backgroundColor: "#fff",
              outline: "none",
              fontSize: "14px",
              color: "#0f172a",
              fontWeight: "500",
            }}
          />
        </div>

        <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "2px" }}>
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setFilterStatus(tab)}
              style={{
                padding: "12px 18px",
                borderRadius: "14px",
                border: filterStatus === tab ? "none" : "1px solid #e2e8f0",
                backgroundColor: filterStatus === tab ? "#4f46e5" : "#fff",
                color: filterStatus === tab ? "#fff" : "#475569",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                whiteSpace: "nowrap",
                boxShadow: filterStatus === tab ? "0 4px 12px rgba(79, 70, 229, 0.2)" : "none",
              }}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* CANCELLATION REASON POPUP MODAL */}
      {selectedOrderForCancel && (
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
                onClick={() => setSelectedOrderForCancel(null)}
                style={{ padding: "10px 16px", backgroundColor: "#f1f5f9", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", color: "#475569", fontSize: "14px" }}
              >
                Close
              </button>
              <button
                onClick={handleCancelSubmit}
                disabled={actionLoading === selectedOrderForCancel}
                style={{ padding: "10px 16px", backgroundColor: "#ef4444", color: "#fff", border: "none", borderRadius: "10px", cursor: "pointer", fontWeight: "600", fontSize: "14px" }}
              >
                {actionLoading === selectedOrderForCancel ? "Cancelling..." : "Confirm Cancel"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ORDERS LIST */}
      {filteredOrders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px", backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
          <p style={{ color: "#64748b", fontWeight: "600", fontSize: "15px", marginBottom: "16px" }}>You have no orders placed in this category.</p>
          <button
            onClick={() => router.push("/")}
            style={{ padding: "12px 24px", backgroundColor: "#4f46e5", color: "#fff", border: "none", borderRadius: "12px", cursor: "pointer", fontWeight: "700", fontSize: "14px" }}
          >
            Start Shopping
          </button>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {filteredOrders.map((order) => {
            const cancellable = isCancellable(order.createdAt, order.orderStatus, order.status);
            const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled" || order.status === "cancelled";
            const isDelivered = order.orderStatus === "Delivered" || order.status === "Delivered" || order.status === "delivered";
            const isShipped = order.orderStatus === "In Transit" || order.status === "Shipped" || order.status === "in transit";
            const isProcessing = !isCancelled && !isDelivered && !isShipped;

            const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : "Recent";
            const formattedTime = order.createdAt ? new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : "";
            const customerStatusLabel = getCustomerStatus(order.status || order.orderStatus);

            let badgeBg = "#fef3c7";
            let badgeColor = "#d97706";
            if (isDelivered) { badgeBg = "#dcfce7"; badgeColor = "#16a34a"; }
            if (isShipped) { badgeBg = "#e0e7ff"; badgeColor = "#4f46e5"; }
            if (isCancelled) { badgeBg = "#fee2e2"; badgeColor = "#dc2626"; }

            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fff",
                  borderRadius: "20px",
                  border: "1px solid #e2e8f0",
                  boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                  padding: "22px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "16px",
                }}
              >
                {/* Order Top Line */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Order ID:</span>
                    <strong style={{ fontSize: "14px", color: "#0f172a" }}>#{order._id}</strong>
                    <button
                      onClick={() => handleCopyId(order._id)}
                      style={{ background: "#f1f5f9", border: "none", borderRadius: "6px", cursor: "pointer", fontSize: "11px", padding: "2px 6px", fontWeight: "700", color: "#475569" }}
                    >
                      Copy
                    </button>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span
                      style={{
                        backgroundColor: badgeBg,
                        color: badgeColor,
                        padding: "5px 12px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                      }}
                    >
                      {customerStatusLabel}
                    </span>

                    <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>
                      📅 {formattedDate} {formattedTime}
                    </span>
                  </div>
                </div>

                {/* Items Container */}
                <div style={{ display: "flex", flexDirection: "column", gap: "14px", borderTop: "1px solid #f8fafc", borderBottom: "1px solid #f8fafc", padding: "14px 0" }}>
                  {order.items?.map((item, idx) => (
                    <div key={idx} style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "16px" }}>
                      <div style={{ display: "flex", gap: "14px", alignItems: "center" }}>
                        <div style={{ width: "70px", height: "70px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", padding: "6px", flexShrink: 0 }}>
                          <img src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/70"} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain" }} />
                        </div>
                        <div>
                          <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0", textDecoration: isCancelled ? "line-through" : "none", lineHeight: "1.4" }}>
                            {item.title}
                          </h4>
                          <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "500", display: "flex", gap: "10px" }}>
                            <span>Qty: <strong style={{ color: "#0f172a" }}>{item.quantity || item.qty || 1}</strong></span>
                            {item.variant || item.selectedColor ? (
                              <span>Variant: <strong style={{ color: "#0f172a" }}>{item.variant || item.selectedColor}</strong></span>
                            ) : null}
                          </div>
                        </div>
                      </div>

                      <div style={{ textAlign: "right", flexShrink: 0 }}>
                        <div style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a" }}>
                          ₹{item.offerPrice || item.price}
                        </div>
                        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "700", textTransform: "uppercase" }}>
                          {order.paymentMethod || "COD"}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Status Indicator */}
                <div style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "13px", color: "#475569", fontWeight: "500" }}>
                  <span>🚚</span>
                  {isDelivered && <span>Delivered on {formattedDate}</span>}
                  {isShipped && <span>Shipped from warehouse</span>}
                  {isProcessing && <span>Order is currently processing</span>}
                  {isCancelled && <span style={{ color: "#dc2626" }}>Order was cancelled</span>}
                  <span style={{ margin: "0 4px", color: "#cbd5e1" }}>•</span>
                  <span>📍 {order.shippingAddress?.city || "Jaipur"}</span>
                </div>

                {/* Cancel Reason Display */}
                {isCancelled && order.cancellationReason && (
                  <div style={{ fontSize: "12px", color: "#dc2626", fontStyle: "italic", backgroundColor: "#fef2f2", padding: "8px 12px", borderRadius: "8px", border: "1px solid #fee2e2" }}>
                    <strong>Reason:</strong> {order.cancellationReason}
                  </div>
                )}

                {/* Bottom Footer Action Bar */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", backgroundColor: "#f8fafc", padding: "14px 18px", borderRadius: "14px", border: "1px solid #f1f5f9", flexWrap: "wrap", gap: "12px" }}>
                  <span style={{ fontSize: "13px", color: "#64748b", fontWeight: "500" }}>
                    Deliver To: <strong style={{ color: "#0f172a" }}>{order.shippingAddress?.name} ({order.shippingAddress?.phone})</strong>
                  </span>

                  <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                    <span style={{ fontSize: "13px", fontWeight: "600", color: "#64748b" }}>
                      Total: <strong style={{ fontSize: "16px", color: "#0f172a" }}>₹{order.totalAmount}</strong>
                    </span>

                    <button
                      onClick={() => router.push(`/orders/${order._id}`)}
                      style={{
                        backgroundColor: "#fff",
                        color: "#0f172a",
                        border: "1px solid #cbd5e1",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      View Details →
                    </button>

                    <button
                      onClick={() => generateReceiptPDF(order)}
                      style={{
                        backgroundColor: "#1e293b",
                        color: "#fff",
                        border: "none",
                        padding: "8px 14px",
                        borderRadius: "10px",
                        fontSize: "12px",
                        fontWeight: "700",
                        cursor: "pointer"
                      }}
                    >
                      📄 Invoice
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
                          fontWeight: "700",
                          cursor: "pointer"
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