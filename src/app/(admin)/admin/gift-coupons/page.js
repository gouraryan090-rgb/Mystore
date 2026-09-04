"use client";
import { useState, useEffect } from "react";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminGiftCouponsPage() {
  const lockScreen = useAdminProtect();

  const [coupons, setCoupons] = useState([]);
  const [selectedCouponId, setSelectedCouponId] = useState("");
  const [couponFor, setCouponFor] = useState("all");
  const [specificEmail, setSpecificEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    fetch("/api/admin/coupons")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) setCoupons(data.data);
      })
      .catch((err) => console.error("Error fetching coupons:", err));
  }, []);

  const handleAssignCoupon = async (e) => {
    e.preventDefault();
    if (!selectedCouponId) {
      alert("Please select a coupon!");
      return;
    }

    setLoading(true);
    setSuccessMessage("");
    try {
      const res = await fetch("/api/admin/coupons", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: selectedCouponId,
          couponFor,
          specificEmail: couponFor === "specific" ? specificEmail : "",
        }),
      });
      const data = await res.json();

      if (res.ok) {
        setSuccessMessage("Coupon targeting updated successfully!");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        alert(data.error || data.message || "Failed to update");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong!");
    } finally {
      setLoading(false);
    }
  };

  if (lockScreen) return lockScreen;

  return (
    <div style={{ padding: "30px", maxWidth: "1300px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
          🎁 Coupon Gifting & Targeting Management
        </h1>
        <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
          Assign existing coupons to specific user groups or individual email addresses.
        </p>
      </div>

      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e2e8f0", maxWidth: "500px", boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)" }}>
        <form onSubmit={handleAssignCoupon} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
              Select Coupon
            </label>
            <select
              value={selectedCouponId}
              onChange={(e) => setSelectedCouponId(e.target.value)}
              required
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
            >
              <option value="">-- Choose a Coupon --</option>
              {coupons.map((c) => (
                <option key={c._id} value={c._id}>
                  {c.code} ({c.discountPercentage}% OFF)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
              Target Audience
            </label>
            <select
              value={couponFor}
              onChange={(e) => setCouponFor(e.target.value)}
              style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none" }}
            >
              <option value="all">Every User (All)</option>
              <option value="new">New Users Only (0 orders)</option>
              <option value="old">Existing Users Only</option>
              <option value="specific">Specific Email ID</option>
            </select>
          </div>

          {couponFor === "specific" && (
            <div>
              <label style={{ fontSize: "13px", fontWeight: "700", color: "#475569", display: "block", marginBottom: "6px" }}>
                Recipient Email ID
              </label>
              <input
                type="email"
                placeholder="user@example.com"
                value={specificEmail}
                onChange={(e) => setSpecificEmail(e.target.value)}
                required
                style={{ width: "100%", padding: "10px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", outline: "none", boxSizing: "border-box" }}
              />
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#6366f1",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "700",
              fontSize: "14px",
              cursor: "pointer",
              marginTop: "4px",
              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Saving..." : "Save & Assign Coupon"}
          </button>

          {successMessage && (
            <div style={{ fontSize: "13px", fontWeight: "700", color: "#16a34a", textAlign: "center", marginTop: "4px" }}>
              ✓ {successMessage}
            </div>
          )}
        </form>
      </div>
    </div>
  );
}