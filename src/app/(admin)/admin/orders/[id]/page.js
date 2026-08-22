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

  useEffect(() => {
    async function fetchOrderDetail() {
      try {
        const res = await fetch(`/api/admin/orders/${orderId}`);
        const data = await res.json();
        if (data.success) {
          setOrder(data.data);
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

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Loading Order Details...</div>;
  }

  if (!order) {
    return <div style={{ padding: "40px", textAlign: "center" }}>Order nahi mila!</div>;
  }

  const addr = order.shippingAddress || {};

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
              <strong>Full Address:</strong> {addr.street1 || ""} {addr.street2 ? `, ${addr.street2}` : ""}, {addr.city || ""} - <strong>{addr.pincode || ""}</strong>
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

        {/* Payment & Status Summary */}
        <div style={{ backgroundColor: "#f9fafb", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <div style={{ fontSize: "13px", color: "#6b7280" }}>Payment Method: <strong>{order.paymentMethod}</strong></div>
            <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>Order Status: <strong style={{ color: "#166534" }}>{order.orderStatus || "Placed"}</strong></div>
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