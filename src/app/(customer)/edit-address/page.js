"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function EditAddressPage() {
  const router = useRouter();

  const [addresses, setAddresses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Form State
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    email: "",
    street1: "",
    street2: "",
    landmark: "",
    city: "",
    pincode: "",
  });

  useEffect(() => {
    try {
      // User data to import profile details & email key
      const savedUser = localStorage.getItem("customer_user");
      if (!savedUser) {
        router.push("/");
        return;
      }
      const parsedUser = JSON.parse(savedUser);
      const userEmail = parsedUser?.email;

      // Load existing saved addresses specific to this email
      if (userEmail) {
        const savedAddresses = localStorage.getItem(`customer_addresses_${userEmail}`);
        if (savedAddresses) {
          setAddresses(JSON.parse(savedAddresses));
        } else {
          setAddresses([]);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Open Modal and Pre-fill user data
  const handleOpenModal = () => {
    if (addresses.length >= 3) {
      alert("You can add a maximum of 3 addresses!");
      return;
    }

    const savedUser = localStorage.getItem("customer_user");
    const user = savedUser ? JSON.parse(savedUser) : {};

    setFormData({
      name: user.name || "",
      phone: user.phone || "",
      email: user.email || "",
      street1: "",
      street2: "",
      landmark: "",
      city: "",
      pincode: "",
    });

    setShowModal(true);
  };

  const handleSaveAddress = (e) => {
    e.preventDefault();

    const savedUser = JSON.parse(localStorage.getItem("customer_user") || "{}");
    const userEmail = savedUser?.email;

    const newAddress = {
      id: Date.now(),
      ...formData,
    };

    const updatedAddresses = [...addresses, newAddress];
    setAddresses(updatedAddresses);

    if (userEmail) {
      localStorage.setItem(`customer_addresses_${userEmail}`, JSON.stringify(updatedAddresses));
    }

    setShowModal(false);
  };

  const handleDeleteAddress = (id) => {
    const savedUser = JSON.parse(localStorage.getItem("customer_user") || "{}");
    const userEmail = savedUser?.email;

    const updated = addresses.filter((addr) => addr.id !== id);
    setAddresses(updated);

    if (userEmail) {
      localStorage.setItem(`customer_addresses_${userEmail}`, JSON.stringify(updated));
    }
  };

  if (loading) {
    return <div style={{ padding: "40px", textAlign: "center", color: "#6b7280" }}>Loading Addresses...</div>;
  }

  return (
    <div style={{ maxWidth: "700px", margin: "32px auto", padding: "0 20px", position: "relative", minHeight: "80vh" }}>
      
      {/* Top Header & Back Button */}
      <button
        onClick={() => router.back()}
        style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "bold", fontSize: "14px", marginBottom: "16px" }}
      >
        ← Back
      </button>

      <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 20px 0" }}>
        🏠 Saved Addresses ({addresses.length}/3)
      </h1>

      {/* Address List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "80px" }}>
        {addresses.length > 0 ? (
          addresses.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: "#fff",
                borderRadius: "12px",
                padding: "20px",
                border: "1px solid #e5e7eb",
                boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
              }}
            >
              <div>
                <div style={{ fontWeight: "700", fontSize: "16px", color: "#111827", marginBottom: "4px" }}>
                  {item.name} <span style={{ fontSize: "13px", fontWeight: "normal", color: "#6b7280" }}>({item.phone})</span>
                </div>
                {item.email && <div style={{ fontSize: "13px", color: "#6b7280", marginBottom: "8px" }}>{item.email}</div>}
                <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.4" }}>
                  {item.street1}, {item.street2 && `${item.street2}, `}
                  {item.landmark && `Near ${item.landmark}, `}
                  {item.city} - <strong>{item.pincode}</strong>
                </div>
              </div>

              <button
                onClick={() => handleDeleteAddress(item.id)}
                style={{ backgroundColor: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "6px 12px", borderRadius: "6px", cursor: "pointer", fontSize: "12px", fontWeight: "bold" }}
              >
                Delete
              </button>
            </div>
          ))
        ) : (
          <div style={{ textAlign: "center", padding: "40px 20px", backgroundColor: "#fff", borderRadius: "12px", border: "1px dashed #d1d5db", color: "#6b7280" }}>
            No address saved yet. Please add a new address using the floating button below.
          </div>
        )}
      </div>

      {/* Floating Add Address Button (Bottom Right) */}
      {addresses.length < 3 && (
        <button
          onClick={handleOpenModal}
          style={{
            position: "fixed",
            bottom: "32px",
            right: "32px",
            backgroundColor: "#2563eb",
            color: "#ffffff",
            border: "none",
            borderRadius: "50px",
            padding: "14px 24px",
            fontSize: "15px",
            fontWeight: "bold",
            boxShadow: "0 10px 15px -3px rgba(37, 99, 235, 0.4)",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: "8px",
            zIndex: 99,
          }}
        >
          ➕ Add Address
        </button>
      )}

      {/* Add Address Modal */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "500px", borderRadius: "16px", padding: "24px", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", margin: 0, color: "#111827" }}>Add New Address</h2>
              <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            <form onSubmit={handleSaveAddress} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Full Name *</label>
                <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Mobile Number *</label>
                  <input type="tel" required value={formData.phone} onChange={(e) => setFormData({ ...formData, phone: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Email (Optional)</label>
                  <input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Street Address 1 *</label>
                <input type="text" required placeholder="House No, Building Name, Area" value={formData.street1} onChange={(e) => setFormData({ ...formData, street1: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Street Address 2 (Optional)</label>
                <input type="text" placeholder="Colony, Locality, Road" value={formData.street2} onChange={(e) => setFormData({ ...formData, street2: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <div style={{ display: "flex", gap: "10px" }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Landmark (Optional)</label>
                  <input type="text" placeholder="Near Temple, School etc." value={formData.landmark} onChange={(e) => setFormData({ ...formData, landmark: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>City *</label>
                  <input type="text" required value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
                </div>
              </div>

              <div>
                <label style={{ fontSize: "12px", fontWeight: "600", color: "#374151" }}>Pincode *</label>
                <input type="text" required value={formData.pincode} onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} style={{ width: "100%", padding: "8px 12px", borderRadius: "6px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }} />
              </div>

              <button type="submit" style={{ marginTop: "12px", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: "pointer" }}>
                Save Address
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}