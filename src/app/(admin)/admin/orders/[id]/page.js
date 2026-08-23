"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminOrderDetailPage({ params }) {
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

  // Status update function (Fixed URL to use dynamic [id] route)
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

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading Order Details...</div>;
  }

  if (!order) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Order nahi mila!</div>;
  }

  const addr = order.shippingAddress || {};
  const currentStatus = order.status || order.orderStatus || "Pending";

  return (
    <div style={{ maxWidth: "800px", margin: "32px auto", padding: "0 20px" }}>
      <button
        onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "bold", marginBottom: "16px" }}
      >
        ← Back to Orders
      </button>

      <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px" }}>
        📋 Order Details: #{order._id}
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        {/* Customer & Contact Info */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#4b5563", marginBottom: "12px", textTransform: "uppercase" }}>
            Customer & Delivery Information
          </h2>
          <div style={{ fontSize: "14px", color: "#1f2937", lineHeight: "1.6" }}>
            <div><strong>Name:</strong> {addr.name || "N/A"}</div>
            <div><strong>Mobile Number:</strong> {addr.phone || "N/A"}</div>
            <div><strong>Email:</strong> {order.userEmail || addr.email || "N/A"}</div>
            <div>
              <strong>Full Address:</strong> {addr.street1 || addr.address || ""} {addr.street2 ? `, ${addr.street2}` : ""}, {addr.city || ""} - <strong>{addr.pincode || ""}</strong>
            </div>
          </div>
        </div>

        {/* Order Products */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#4b5563", marginBottom: "12px", textTransform: "uppercase" }}>
            Ordered Items
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {order.items?.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: index < order.items.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: index < order.items.length - 1 ? "12px" : "0" }}>
                <img
                  src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/60"}
                  alt={item.title}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Quantity: {item.quantity || 1}</div>
                </div>
                <div style={{ fontWeight: "bold", fontSize: "15px", color: "#16a34a" }}>
                  ₹{(item.offerPrice || item.price) * (item.quantity || 1)}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Status Update Control Box */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", flexDirection: "column", gap: "12px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: "bold", color: "#4b5563", textTransform: "uppercase" }}>
            Update Order Status
          </h2>
          <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              style={{ padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", flex: 1 }}
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
              style={{ padding: "8px 16px", backgroundColor: "#2563eb", color: "#fff", border: "none", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              {updating ? "Updating..." : "Update Status"}
            </button>
          </div>
        </div>

        {/* Payment & Status Summary */}
        <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>Payment Method: <strong>{order.paymentMethod}</strong></div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
              Current Status: <strong style={{ color: currentStatus === "Cancelled" ? "#dc2626" : "#166534" }}>{currentStatus}</strong>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>Total Bill</div>
            <div style={{ fontSize: "20px", fontWeight: "900", color: "#15803d" }}>₹{order.totalAmount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}