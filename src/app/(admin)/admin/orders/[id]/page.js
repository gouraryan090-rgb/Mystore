"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { jsPDF } from "jspdf";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminOrderDetailPage({ params }) {
  const lockScreen = useAdminProtect();

  const resolvedParams = use(params);
  const orderId = resolvedParams.id;
  const router = useRouter();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [updating, setUpdating] = useState(false);

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
          setSelectedStatus(data.data.status || data.data.orderStatus || "Pending");
        }
      } catch (err) {
        console.error("Error fetching order detail:", err);
      } finally {
        setLoading(false);
      }
    }

    if (orderId) {
      fetchOrderDetail();
    }
  }, [orderId]);

  const handleStatusUpdate = async () => {
    try {
      setUpdating(true);
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newStatus: selectedStatus }),
      });
      const data = await res.json();
      if (data.success) {
        alert("Order status updated successfully!");
        setOrder((prev) => ({ ...prev, status: selectedStatus, orderStatus: selectedStatus }));
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (err) {
      console.error("Error updating status:", err);
      alert("Something went wrong!");
    } finally {
      setUpdating(false);
    }
  };

  // PDF Generator Function (Same as Customer Receipt)[cite: 9]
  const generateReceiptPDF = (orderData) => {
    const doc = new jsPDF();
    
    const primaryColor = [99, 102, 241]; // Indigo
    const textColor = [15, 23, 42];      // Slate 900
    const grayColor = [100, 116, 139];   // Slate 500

    // Header - Company Name
    doc.setFont("helvetica", "bold");
    doc.setFontSize(22);
    doc.setTextColor(...primaryColor);
    doc.text("ZENTROBAZAAR", 14, 20);

    // Subtitle / Tagline
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(...grayColor);
    doc.text("Digital Tax Invoice / Receipt (Admin Copy)", 14, 26);

    // Company Details (Right side)
    doc.setFontSize(9);
    doc.text("Nawa City, Rajasthan - 341509", 200, 20, { align: "right" });
    doc.text("Email: zentrobazaar.shop@gmail.com", 200, 25, { align: "right" });
    doc.text("Mobile: +91 7378200781", 200, 30, { align: "right" });
    doc.text("GSTIN: N/A", 200, 35, { align: "right" });

    // Divider Line
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.5);
    doc.line(14, 42, 196, 42);

    // Order & Customer Meta Info
    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(...textColor);
    doc.text("Order Details:", 14, 52);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(`Order ID: #${orderData.orderId || orderData._id}`, 14, 59);
    doc.text(`Date: ${orderData.createdAt ? new Date(orderData.createdAt).toLocaleDateString() : "Recent"}`, 14, 66);
    doc.text(`Payment Method: ${orderData.paymentMethod || "COD"}`, 14, 73);

    const addr = orderData.shippingAddress || {};
    doc.setFont("helvetica", "bold");
    doc.text("Shipping Address:", 110, 52);
    doc.setFont("helvetica", "normal");
    doc.text(`Name: ${addr.name || "Customer"}`, 110, 59);
    doc.text(`Phone: ${addr.phone || "N/A"}`, 110, 66);
    doc.text(`Address: ${addr.street1 || addr.address || "Nawa City"}`, 110, 73, { maxWidth: 85 });

    // Table Header Background
    doc.setFillColor(241, 245, 249);
    doc.rect(14, 85, 182, 8, "F");

    // Table Headers
    doc.setFont("helvetica", "bold");
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    doc.text("Item Description", 18, 91);
    doc.text("Qty", 120, 91);
    doc.text("Price", 145, 91);
    doc.text("Total", 175, 91);

    // Table Items Loop
    let startY = 99;
    doc.setFont("helvetica", "normal");
    
    const items = orderData.items || [];
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

    // Divider Line before Totals
    doc.line(14, startY + 2, 196, startY + 2);
    startY += 10;

    const subtotal = orderData.totalAmount || items.reduce((acc, item) => acc + (item.quantity || item.qty || 1) * (item.offerPrice || item.price || 0), 0);
    const shipping = orderData.shippingFee || 0;
    const grandTotal = subtotal + shipping;

    // Totals Section
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

    // Footer Note
    startY += 25;
    doc.setFont("helvetica", "italic");
    doc.setFontSize(9);
    doc.setTextColor(...grayColor);
    doc.text("ZENTROBAZAAR Admin Management Portal - Computer-generated invoice.", 14, startY);

    // Save PDF
    doc.save(`ZENTROBAZAAR-Invoice-${orderData.orderId || orderData._id}.pdf`);
  };

  if (lockScreen) return lockScreen;

  if (loading) {
    return <div style={{ padding: "80px", textAlign: "center", color: "#64748b", fontWeight: "700", fontSize: "15px" }}>Loading Order Details...</div>;
  }

  if (!order) {
    return <div style={{ padding: "80px", textAlign: "center", color: "#64748b", fontWeight: "700", fontSize: "15px" }}>Order nahi mila!</div>;
  }

  const addr = order.shippingAddress || {};
  const currentStatus = order.status || order.orderStatus || "Pending";
  const displayOrderId = order.orderId || order._id;
  const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleString('en-GB', { dateStyle: 'medium', timeStyle: 'short' }) : "Recent";

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "80px" }}>
      
      {/* Top Header & Actions */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px", flexWrap: "wrap", gap: "15px" }}>
        <button
          onClick={() => router.back()}
          style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "12px", color: "#0f172a", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)" }}
        >
          ← Back to Orders
        </button>

        <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
          {/* Download Receipt Button for Admin */}
          <button
            onClick={() => generateReceiptPDF(order)}
            style={{
              backgroundColor: "#0f172a",
              color: "#fff",
              border: "none",
              padding: "10px 18px",
              borderRadius: "12px",
              fontSize: "13px",
              fontWeight: "800",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(15, 23, 42, 0.25)",
              display: "flex",
              alignItem: "center",
              gap: "6px"
            }}
          >
            📄 Download Receipt PDF
          </button>

          <span style={{ fontSize: "12px", fontFamily: "monospace", backgroundColor: "#f1f5f9", padding: "8px 12px", borderRadius: "10px", color: "#475569", fontWeight: "700" }}>
            ID: {order._id}
          </span>
        </div>
      </div>

      {/* Main Container Layout */}
      <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
        
        {/* SECTION 1: STATUS UPDATE CONTROL BAR */}
        <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 4px 20px rgba(0,0,0,0.03)", display: "flex", flexDirection: "column", gap: "14px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "10px" }}>
            <div>
              <h2 style={{ fontSize: "14px", fontWeight: "900", color: "#0f172a", textTransform: "uppercase", letterSpacing: "0.5px", margin: 0 }}>
                Manage Order Status
              </h2>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "2px 0 0 0", fontWeight: "600" }}>Change fulfillment state to notify system updates</p>
            </div>
            <span
              style={{
                backgroundColor: currentStatus === "Cancelled" ? "#fee2e2" : currentStatus === "Delivered" ? "#dcfce7" : "#fef3c7",
                color: currentStatus === "Cancelled" ? "#dc2626" : currentStatus === "Delivered" ? "#166534" : "#92400e",
                padding: "6px 14px",
                borderRadius: "12px",
                fontSize: "12px",
                fontWeight: "800",
              }}
            >
              Current: {currentStatus}
            </span>
          </div>

          <div style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap", paddingTop: "6px" }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", flex: 1, minWidth: "240px", outline: "none", backgroundColor: "#f8fafc", fontWeight: "700", color: "#0f172a" }}
            >
              <option value="Pending">Pending (All Orders / Placed)</option>
              <option value="Processing">Order in Preparation (Processing)</option>
              <option value="In Transit">Order in Transit</option>
              <option value="Delivered">Delivered</option>
              <option value="Cancelled">Cancelled</option>
            </select>
            <button
              onClick={handleStatusUpdate}
              disabled={updating}
              style={{ padding: "12px 24px", backgroundColor: "#6366f1", color: "#fff", border: "none", borderRadius: "14px", fontWeight: "800", fontSize: "13px", cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)" }}
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>

        {/* SECTION 2: OFFICIAL CUSTOMER RECEIPT PREVIEW CARD */}
        <div style={{ backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", overflow: "hidden" }}>
          
          {/* Receipt Header Banner */}
          <div style={{ backgroundColor: "#f8fafc", padding: "24px 30px", borderBottom: "1px solid #f1f5f9", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
            <div>
              <div style={{ fontSize: "11px", fontWeight: "900", color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px" }}>Official Tax Invoice / Receipt Preview</div>
              <h1 style={{ fontSize: "20px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0 0" }}>
                Order #{displayOrderId}
              </h1>
            </div>
            <div style={{ textAlign: "right" }}>
              <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Order Timestamp</div>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>{formattedDate}</div>
            </div>
          </div>

          {/* Receipt Body Content */}
          <div style={{ padding: "30px", display: "flex", flexDirection: "column", gap: "24px" }}>
            
            {/* Customer & Shipping Grid */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "20px", backgroundColor: "#fcfcfd", padding: "20px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
              <div>
                <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Billed To Customer</h3>
                <div style={{ fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>{addr.name || "Customer Name"}</div>
                <div style={{ fontSize: "13px", color: "#475569", marginTop: "4px" }}>📞 {addr.phone || "N/A"}</div>
                <div style={{ fontSize: "13px", color: "#475569", marginTop: "2px" }}>✉️ {order.userEmail || addr.email || "N/A"}</div>
              </div>

              <div>
                <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "8px" }}>Shipping Destination</h3>
                <div style={{ fontSize: "13px", color: "#0f172a", lineHeight: "1.5", fontWeight: "600" }}>
                  {addr.street1 || addr.address || ""} {addr.street2 ? `, ${addr.street2}` : ""}, <br />
                  {addr.city || ""} - <strong style={{ color: "#0f172a" }}>{addr.pincode || ""}</strong>
                </div>
              </div>
            </div>

            {/* Line Items Table */}
            <div>
              <h3 style={{ fontSize: "12px", fontWeight: "900", color: "#64748b", textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: "12px" }}>Purchased Items</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {order.items?.map((item, index) => {
                  const itemPrice = item.offerPrice || item.price || 0;
                  const itemQty = item.quantity || item.qty || 1;
                  return (
                    <div key={index} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: index < order.items.length - 1 ? "1px solid #f1f5f9" : "none", paddingBottom: index < order.items.length - 1 ? "14px" : "0" }}>
                      <img
                        src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/60"}
                        alt={item.title}
                        style={{ width: "54px", height: "54px", objectFit: "cover", borderRadius: "12px", border: "1px solid #e2e8f0" }}
                      />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: "800", fontSize: "14px", color: "#0f172a" }}>{item.title}</div>
                        <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                          Unit Price: ₹{itemPrice} × Qty: {itemQty}
                        </div>
                      </div>
                      <div style={{ fontWeight: "900", fontSize: "15px", color: "#0f172a" }}>
                        ₹{itemPrice * itemQty}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Financial Summary Box */}
            <div style={{ backgroundColor: "#f8fafc", padding: "20px 24px", borderRadius: "16px", border: "1px solid #e2e8f0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "15px" }}>
              <div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600" }}>Payment Mode: <strong style={{ color: "#0f172a" }}>{order.paymentMethod || "Online / COD"}</strong></div>
                <div style={{ fontSize: "13px", color: "#64748b", fontWeight: "600", marginTop: "4px" }}>
                  Fulfillment Status: <strong style={{ color: currentStatus === "Cancelled" ? "#dc2626" : "#166534" }}>{currentStatus}</strong>
                </div>
              </div>
              <div style={{ textAlign: "right" }}>
                <div style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Grand Total Paid</div>
                <div style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a" }}>₹{order.totalAmount}</div>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}