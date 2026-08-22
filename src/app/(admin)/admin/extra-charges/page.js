"use client";
import { useState, useEffect } from "react";

export default function ManageExtraCharges() {
  const [charges, setCharges] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: "",
    chargeFor: "both",
    maxOrderPrice: "",
    paymentMethod: "ALL",
  });

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    try {
      const res = await fetch("/api/admin/extra-charges");
      const data = await res.json();
      if (data.success) setCharges(data.data);
    } catch (error) {
      console.error("Error fetching charges:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("Submitting form data:", form);

    try {
      const res = await fetch("/api/admin/extra-charges", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();
      console.log("Server response:", data);

      if (res.ok && data.success) {
        alert("Extra charge successfully add ho gaya!");
        setForm({ name: "", price: "", chargeFor: "both", maxOrderPrice: "", paymentMethod: "ALL" });
        fetchCharges();
      } else {
        alert(data.message || "Kuch galti ho gayi hai, check karein.");
      }
    } catch (error) {
      console.error("Error adding charge:", error);
      alert("Network ya server error aayi hai!");
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Kya aap is charge ko delete karna chahte hain?")) return;
    try {
      const res = await fetch(`/api/admin/extra-charges?id=${id}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success) {
        fetchCharges();
      } else {
        alert(data.message);
      }
    } catch (error) {
      console.error("Error deleting charge:", error);
    }
  };

  return (
    <div style={{ padding: "32px 24px", maxWidth: "800px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "22px", fontWeight: "bold", marginBottom: "20px", color: "#111827" }}>
        ⚙️ Manage Extra Charges
      </h1>

      {/* Form to Add Charge */}
      <form
        onSubmit={handleSubmit}
        style={{
          backgroundColor: "#fff",
          padding: "24px",
          borderRadius: "12px",
          border: "1px solid #e5e7eb",
          display: "flex",
          flexDirection: "column",
          gap: "14px",
          marginBottom: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
        }}
      >
        <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#374151", margin: 0 }}>Add New Extra Charge</h2>
        
        <input
          type="text"
          placeholder="Charge Name (e.g., COD Fee, Packaging Charge)"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          required
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
        />

        <input
          type="number"
          placeholder="Charge Price (₹)"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
          required
          style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
        />

        <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
          <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563" }}>Charge For Users:</label>
            <select
              value={form.chargeFor}
              onChange={(e) => setForm({ ...form, chargeFor: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", backgroundColor: "#fff" }}
            >
              <option value="both">Both (New & Existing)</option>
              <option value="new">New Users Only</option>
              <option value="old">Existing Users Only</option>
            </select>
          </div>

          <div style={{ flex: 1, minWidth: "200px", display: "flex", flexDirection: "column", gap: "6px" }}>
            <label style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563" }}>Payment Method:</label>
            <select
              value={form.paymentMethod}
              onChange={(e) => setForm({ ...form, paymentMethod: e.target.value })}
              style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", backgroundColor: "#fff" }}
            >
              <option value="ALL">All Payment Methods</option>
              <option value="COD">COD Only</option>
              <option value="RAZORPAY">Online Payment Only</option>
            </select>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <label style={{ fontSize: "12px", fontWeight: "600", color: "#4b5563" }}>Apply if Order is Under Price (₹):</label>
          <input
            type="number"
            placeholder="e.g., 500 (Isse kam ya barabar ke order par lagega)"
            value={form.maxOrderPrice}
            onChange={(e) => setForm({ ...form, maxOrderPrice: Number(e.target.value) })}
            required
            style={{ padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }}
          />
        </div>

        <button
          type="submit"
          style={{
            backgroundColor: "#2563eb",
            color: "#fff",
            padding: "14px",
            borderRadius: "8px",
            border: "none",
            fontWeight: "bold",
            fontSize: "15px",
            cursor: "pointer",
            marginTop: "6px",
          }}
        >
          + Create Extra Charge
        </button>
      </form>

      {/* List of Existing Charges */}
      <h2 style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "14px", color: "#111827" }}>
        Existing Charges List
      </h2>
      
      {charges.length === 0 ? (
        <p style={{ color: "#6b7280", fontSize: "14px" }}>Koi extra charge abhi nahi banaya gaya hai.</p>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {charges.map((ch) => (
            <div
              key={ch._id}
              style={{
                backgroundColor: "#fff",
                padding: "16px 20px",
                borderRadius: "10px",
                border: "1px solid #e5e7eb",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                boxShadow: "0 1px 2px rgba(0,0,0,0.05)",
              }}
            >
              <div>
                <strong style={{ fontSize: "16px", color: "#1f2937" }}>{ch.name}</strong> 
                <span style={{ color: "#16a34a", fontWeight: "bold", marginLeft: "8px" }}>₹{ch.price}</span>
                <div style={{ fontSize: "13px", color: "#6b7280", marginTop: "4px" }}>
                  User: <span style={{ textTransform: "uppercase", fontWeight: "500" }}>{ch.chargeFor}</span> | 
                  Payment: <span style={{ fontWeight: "500" }}>{ch.paymentMethod}</span> | 
                  Max Order Limit: <span style={{ fontWeight: "500" }}>₹{ch.maxOrderPrice}</span>
                </div>
              </div>
              <button
                onClick={() => handleDelete(ch._id)}
                style={{
                  backgroundColor: "#ef4444",
                  color: "#fff",
                  border: "none",
                  padding: "8px 14px",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "13px",
                }}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}