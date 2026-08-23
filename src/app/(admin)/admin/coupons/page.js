"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminCouponsPage() {
  // Page security check aur lock modal
  const lockScreen = useAdminProtect();

  const [coupons, setCoupons] = useState([]);
  const [editingCoupon, setEditingCoupon] = useState(null);

  const [formData, setFormData] = useState({
    code: "",
    discountPercentage: "",
    minOrderAmount: "",
    couponFor: "all",
    validTill: "",
  });

  const fetchCoupons = async () => {
    try {
      const res = await fetch("/api/admin/coupons");
      const data = await res.json();
      if (data.success) setCoupons(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingCoupon ? `/api/admin/coupons` : `/api/admin/coupons`;
    const method = editingCoupon ? "PUT" : "POST";
    
    const payload = editingCoupon ? { id: editingCoupon._id, ...formData } : formData;

    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      setFormData({ code: "", discountPercentage: "", minOrderAmount: "", couponFor: "all", validTill: "" });
      setEditingCoupon(null);
      fetchCoupons();
    }
  };

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setFormData({
      code: coupon.code,
      discountPercentage: coupon.discountPercentage,
      minOrderAmount: coupon.minOrderAmount,
      couponFor: coupon.couponFor,
      validTill: coupon.validTill ? coupon.validTill.split("T")[0] : "",
    });
  };

  const handleDelete = async (id) => {
    if (confirm("Kya aap is coupon ko delete karna chahte hain?")) {
      const res = await fetch(`/api/admin/coupons?id=${id}`, { method: "DELETE" });
      if (res.ok) fetchCoupons();
    }
  };

  // Agar user authenticated nahi hai, toh lock modal dikhega
  if (lockScreen) return lockScreen;

  return (
    <div style={{ maxWidth: "900px", margin: "32px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold" }}>🎟️ Manage Coupons</h1>
        <Link href="/admin" style={{ backgroundColor: "#1f2937", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontSize: "14px", fontWeight: "bold" }}>
          ← Back to Dashboard
        </Link>
      </div>

      {/* Add / Edit Coupon Form */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", gridColumn: "span 2", color: "#374151" }}>
          {editingCoupon ? "Edit Coupon" : "Create New Coupon"}
        </h2>
        
        <input name="code" placeholder="Coupon Code (e.g. WELCOME50)" value={formData.code} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }} required />
        
        <input name="discountPercentage" type="number" placeholder="Discount Percentage (e.g. 10%)" value={formData.discountPercentage} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }} required />
        
        <input name="minOrderAmount" type="number" placeholder="Min Order Amount (e.g. 500)" value={formData.minOrderAmount} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }} required />
        
        <select name="couponFor" value={formData.couponFor} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }}>
          <option value="all">Every User</option>
          <option value="new">New Users Only (0 Orders)</option>
          <option value="old">Existing Users (1+ Orders)</option>
        </select>

        <input name="validTill" type="date" value={formData.validTill} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", gridColumn: "span 2" }} required />

        <div style={{ display: "flex", gap: "10px", gridColumn: "span 2" }}>
          <button type="submit" style={{ flex: 1, backgroundColor: "#2563eb", color: "#fff", padding: "10px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
            {editingCoupon ? "Update Coupon" : "Save Coupon"}
          </button>
          {editingCoupon && (
            <button type="button" onClick={() => { setEditingCoupon(null); setFormData({ code: "", discountPercentage: "", minOrderAmount: "", couponFor: "all", validTill: "" }); }} style={{ backgroundColor: "#6b7280", color: "#fff", padding: "10px 20px", borderRadius: "8px", border: "none", fontWeight: "bold", cursor: "pointer" }}>
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Coupons List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {coupons.map((c) => (
          <div key={c._id} style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "10px", border: "1px solid #e5e7eb", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: "16px", fontWeight: "bold", color: "#2563eb" }}>{c.code}</div>
              <div style={{ fontSize: "13px", color: "#4b5563" }}>
                Discount: <strong>{c.discountPercentage}%</strong> | Min Order: <strong>₹{c.minOrderAmount}</strong> | For: <strong style={{ textTransform: "uppercase" }}>{c.couponFor}</strong>
              </div>
              <div style={{ fontSize: "12px", color: "#9ca3af" }}>Valid Till: {new Date(c.validTill).toLocaleDateString()}</div>
            </div>
            <div style={{ display: "flex", gap: "8px" }}>
              <button onClick={() => handleEdit(c)} style={{ backgroundColor: "#eab308", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Edit</button>
              <button onClick={() => handleDelete(c._id)} style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}