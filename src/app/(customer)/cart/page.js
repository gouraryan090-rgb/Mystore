"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";
import Link from "next/link";

export default function CartPage() {
  const router = useRouter();
  const { cart, updateQuantity } = useCart();
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);

  // Fetch saved addresses
  useEffect(() => {
    const saved = localStorage.getItem("customer_addresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
    }
  }, []);

  const totalAmount = cart.reduce(
    (sum, item) => sum + (item.offerPrice || item.price) * item.quantity,
    0
  );

  const handleCheckoutClick = () => {
    if (addresses.length === 0) {
      alert("Please go to the 'Edit Address' section and save at least one address!");
      router.push("/edit-address");
      return;
    }
    setShowAddressModal(true);
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddressId) return;

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    
    // Multiple items cart checkout payload
    const checkoutPayload = {
      cart: cart,
      deliveryAddress: selectedAddr,
      totalBill: totalAmount,
    };

    localStorage.setItem("checkout_data", JSON.stringify(checkoutPayload));
    router.push("/checkout");
  };

  if (cart.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "40px", backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
        <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>Your Cart is Empty 🛒</h2>
        <p style={{ color: "#6b7280", marginBottom: "20px" }}>Please add some products first!</p>
        <Link href="/" style={{ backgroundColor: "#2563eb", color: "#fff", padding: "10px 20px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold" }}>
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "800px", margin: "0 auto", padding: "20px" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>Your Shopping Cart ({cart.length})</h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {cart.map((item) => (
          <div
            key={item._id}
            style={{
              display: "flex",
              alignItems: "center",
              gap: "16px",
              backgroundColor: "#fff",
              padding: "16px",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
            }}
          >
            <img
              src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/80"}
              alt={item.title}
              style={{ width: "80px", height: "80px", objectFit: "cover", borderRadius: "8px" }}
            />

            <div style={{ flex: 1 }}>
              <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0" }}>{item.title}</h3>
              <p style={{ color: "#16a34a", fontWeight: "bold", margin: "0 0 8px 0" }}>₹{item.offerPrice || item.price}</p>

              {/* Quantity Controls */}
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <button
                  onClick={() => updateQuantity(item._id, -1)}
                  style={{ padding: "4px 10px", borderRadius: "4px", border: "1px solid #d1d5db", cursor: "pointer", fontWeight: "bold" }}
                >
                  -
                </button>
                <span style={{ fontWeight: "bold" }}>{item.quantity}</span>
                <button
                  onClick={() => updateQuantity(item._id, 1)}
                  style={{ padding: "4px 10px", borderRadius: "4px", border: "1px solid #d1d5db", cursor: "pointer", fontWeight: "bold" }}
                >
                  +
                </button>
              </div>
            </div>
          </div>
        ))}

        {/* Total Summary & Proceed Button */}
        <div style={{ backgroundColor: "#fff", padding: "20px", borderRadius: "12px", border: "1px solid #e5e7eb", marginTop: "16px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "18px", fontWeight: "bold", marginBottom: "16px" }}>
            <span>Total Amount:</span>
            <span style={{ color: "#16a34a" }}>₹{totalAmount}</span>
          </div>

          <button
            onClick={handleCheckoutClick}
            style={{
              width: "100%",
              backgroundColor: "#16a34a",
              color: "#fff",
              padding: "12px",
              borderRadius: "8px",
              border: "none",
              fontWeight: "bold",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Proceed to Checkout →
          </button>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "500px", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Select Delivery Address</h2>
              <button onClick={() => setShowAddressModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            {/* Address Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto", marginBottom: "16px" }}>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "8px",
                    border: `2px solid ${selectedAddressId === addr.id ? "#2563eb" : "#e5e7eb"}`,
                    backgroundColor: selectedAddressId === addr.id ? "#eff6ff" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    <strong>{addr.name}</strong> ({addr.phone})<br />
                    {addr.street1}, {addr.city} - <strong>{addr.pincode}</strong>
                  </div>
                </label>
              ))}
            </div>

            {/* Total Bill Box */}
            <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", border: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Total Bill:</span>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a" }}>₹{totalAmount}</span>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedAddressId}
              style={{
                width: "100%",
                backgroundColor: selectedAddressId ? "#16a34a" : "#9ca3af",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "15px",
                cursor: selectedAddressId ? "pointer" : "not-allowed",
              }}
            >
              Continue to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}