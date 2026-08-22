"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    // LocalStorage se selected address aur checkout items load karein[cite: 5]
    const items = JSON.parse(localStorage.getItem("checkout_items") || "[]");
    const address = JSON.parse(localStorage.getItem("selected_address") || "null");

    if (!address) {
      // Agar address selected nahi hai toh wapas address page par bhejein[cite: 5]
      router.push("/checkout/address");
      return;
    }

    setCartItems(items);
    setSelectedAddress(address);
  }, [router]);

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.offerPrice || item.price) * (item.quantity || 1),
    0
  );

  const finalTotalAmount = Math.max(0, subtotal - discountAmount);

  // Apply Coupon Handler
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponMessage("Kripya coupon code enter karein.");
      return;
    }

    try {
      const res = await fetch("/api/orders/apply-coupon", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: couponCode,
          totalAmount: subtotal,
          userEmail: selectedAddress?.email || selectedAddress?.phone || "customer@example.com"
        }),
      });

      const data = await res.json();
      setCouponMessage(data.message);

      if (data.success) {
        setDiscountAmount(data.discountAmount);
        setDiscountApplied(true);
      } else {
        setDiscountAmount(0);
        setDiscountApplied(false);
      }
    } catch (err) {
      console.error(err);
      setCouponMessage("Coupon apply karne me error aayi.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      alert("Kripya payment method select karein!");
      return;
    }

    setLoading(true);

    try {
      if (selectedPayment === "COD") {
        // Cash on Delivery Order Creation API
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            shippingAddress: selectedAddress,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            totalAmount: finalTotalAmount,
            discountAmount,
            couponCode: discountApplied ? couponCode : null,
          }),
        });

        const data = await res.json();

        if (data.success) {
          // Checkout state clear karein[cite: 5]
          localStorage.removeItem("checkout_items");
          router.push("/orders"); // Your Orders page[cite: 5]
        } else {
          alert(data.message || "Order place karne me error aaya.");
        }
      } else if (selectedPayment === "RAZORPAY") {
        // Razorpay feature placeholder[cite: 5]
        alert("Razorpay paymentGateway jald hi activate hoga. Abhi ke liye Cash on Delivery select karein.");
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Kuch galat ho gaya, kripya dobara try karein.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: "650px", margin: "40px auto", padding: "20px", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "24px", fontWeight: "bold", marginBottom: "20px" }}>
        Order Summary & Payment
      </h1>

      {/* Address Review */}
      {selectedAddress && (
        <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "8px" }}>Deliver To:</h2>
          <p style={{ margin: "2px 0", color: "#374151" }}><strong>{selectedAddress.name}</strong></p>
          <p style={{ margin: "2px 0", color: "#4b5563" }}>{selectedAddress.street}, {selectedAddress.city}</p>
          <p style={{ margin: "2px 0", color: "#4b5563" }}>{selectedAddress.state} - {selectedAddress.pincode}</p>
          <p style={{ margin: "2px 0", color: "#4b5563" }}>Phone: {selectedAddress.phone}</p>
        </div>
      )}

      {/* Product List Review */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", marginBottom: "20px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>Products</h2>
        {cartItems.map((item, index) => (
          <div key={item._id || index} style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
            <span>{item.title || item.name} (x{item.quantity || 1})</span>
            <span>₹{((item.offerPrice || item.price) * (item.quantity || 1)).toLocaleString()}</span>
          </div>
        ))}
        
        <hr style={{ margin: "12px 0", borderTop: "1px solid #e5e7eb" }} />
        
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#4b5563", marginBottom: "6px" }}>
          <span>Subtotal:</span>
          <span>₹{subtotal.toLocaleString()}</span>
        </div>

        {discountApplied && (
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#16a34a", marginBottom: "6px" }}>
            <span>Coupon Discount:</span>
            <span>- ₹{discountAmount.toLocaleString()}</span>
          </div>
        )}

        <div style={{ display: "flex", justifyContent: "space-between", fontWeight: "bold", fontSize: "18px", marginTop: "8px" }}>
          <span>Total Amount:</span>
          <span>₹{finalTotalAmount.toLocaleString()}</span>
        </div>
      </div>

      {/* --- COUPON SECTION (Payment section se theek upar) --- */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", marginBottom: "20px", backgroundColor: "#f9fafb" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "10px" }}>Apply Coupon</h2>
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            placeholder="Enter Coupon Code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            disabled={discountApplied}
            style={{ flex: 1, padding: "10px", borderRadius: "6px", border: "1px solid #d1d5db", textTransform: "uppercase", outline: "none" }}
          />
          {discountApplied ? (
            <button
              onClick={() => { setDiscountApplied(false); setDiscountAmount(0); setCouponCode(""); setCouponMessage(""); }}
              style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              Remove
            </button>
          ) : (
            <button
              onClick={handleApplyCoupon}
              style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "6px", fontWeight: "bold", cursor: "pointer" }}
            >
              Apply
            </button>
          )}
        </div>
        {couponMessage && (
          <p style={{ fontSize: "13px", marginTop: "8px", color: discountApplied ? "#16a34a" : "#dc2626", fontWeight: "600" }}>
            {couponMessage}
          </p>
        )}
      </div>

      {/* Payment Option Selection */}
      <div style={{ border: "1px solid #e5e7eb", borderRadius: "8px", padding: "16px", marginBottom: "24px" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "600", marginBottom: "12px" }}>Select Payment Method</h2>
        
        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", cursor: "pointer" }}>
          <input
            type="radio"
            name="paymentMethod"
            value="COD"
            checked={selectedPayment === "COD"}
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span>Cash on Delivery (COD)</span>
        </label>

        <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", cursor: "pointer" }}>
          <input
            type="radio"
            name="paymentMethod"
            value="RAZORPAY"
            checked={selectedPayment === "RAZORPAY"}
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span>Online Payment (Razorpay / UPI / Cards)</span>
        </label>
      </div>

      {/* Action Button */}
      <button
        onClick={handlePlaceOrder}
        disabled={loading || !selectedPayment}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: selectedPayment ? "#2563eb" : "#9ca3af",
          color: "#ffffff",
          fontSize: "16px",
          fontWeight: "600",
          border: "none",
          borderRadius: "6px",
          cursor: selectedPayment ? "pointer" : "not-allowed",
        }}
      >
        {loading ? "Placing Order..." : `Pay ₹{finalTotalAmount.toLocaleString()} & Place Order`}
      </button>
    </div>
  );
}