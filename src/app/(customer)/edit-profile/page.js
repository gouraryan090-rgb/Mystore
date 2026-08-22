"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditProfilePage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    gender: "",
    altPhone: "",
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    // LocalStorage se logged-in user details fetch karein
    try {
      const savedUser = localStorage.getItem("customer_user");
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        setFormData({
          name: parsed.name || "",
          email: parsed.email || "",
          phone: parsed.phone || "",
          gender: parsed.gender || "",
          altPhone: parsed.altPhone || "",
        });
      } else {
        // User logged in nahi hai toh home page par redirect karein
        router.push("/");
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage("");

    try {
      // LocalStorage update karein
      const savedUser = localStorage.getItem("customer_user");
      const existingData = savedUser ? JSON.parse(savedUser) : {};

      const updatedUser = {
        ...existingData,
        name: formData.name,
        phone: formData.phone,
        gender: formData.gender,
        altPhone: formData.altPhone,
      };

      localStorage.setItem("customer_user", JSON.stringify(updatedUser));
      setMessage("Profile successfully update ho gayi! 🎉");
    } catch (err) {
      console.error(err);
      setMessage("Update karne me dikkat aayi!");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>
        Loading Profile...
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "600px", margin: "32px auto", padding: "0 20px" }}>
      <button
        onClick={() => router.back()}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "28px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "22px",
            fontWeight: "800",
            color: "#111827",
            marginTop: 0,
            marginBottom: "20px",
          }}
        >
          ✏️ Edit Profile
        </h1>

        {message && (
          <div
            style={{
              padding: "12px",
              borderRadius: "8px",
              fontSize: "14px",
              marginBottom: "16px",
              backgroundColor: message.includes("🎉") ? "#f0fdf4" : "#fef2f2",
              color: message.includes("🎉") ? "#16a34a" : "#dc2626",
              border: `1px solid ${
                message.includes("🎉") ? "#bbf7d0" : "#fecaca"
              }`,
            }}
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Name Field */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Full Name *
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Email Field (Non-Editable) */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Email Address (Cannot be changed)
            </label>
            <input
              type="email"
              value={formData.email}
              disabled
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #e5e7eb",
                backgroundColor: "#f3f4f6",
                color: "#6b7280",
                fontSize: "14px",
                cursor: "not-allowed",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Mobile Number Field */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Mobile Number *
            </label>
            <input
              type="tel"
              required
              placeholder="10-digit mobile number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Gender Field */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Gender *
            </label>
            <select
              required
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                backgroundColor: "#fff",
                boxSizing: "border-box",
              }}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>
          </div>

          {/* Alternative Mobile Number Field */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
              Alternative Mobile Number (Optional)
            </label>
            <input
              type="tel"
              placeholder="Optional second number"
              value={formData.altPhone}
              onChange={(e) => setFormData({ ...formData, altPhone: e.target.value })}
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                fontSize: "14px",
                boxSizing: "border-box",
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            style={{
              marginTop: "8px",
              backgroundColor: "#2563eb",
              color: "#ffffff",
              fontWeight: "bold",
              padding: "12px",
              borderRadius: "10px",
              border: "none",
              cursor: "pointer",
              fontSize: "15px",
              opacity: saving ? 0.7 : 1,
            }}
          >
            {saving ? "Saving Changes..." : "Save Profile"}
          </button>
        </form>
      </div>
    </div>
  );
}