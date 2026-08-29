"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [cartItems, setCartItems] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [isCashfreeLoaded, setIsCashfreeLoaded] = useState(false);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    // Load Cashfree JS SDK and handle redirect verification
    if (document.getElementById("cashfree-sdk")) {
      setIsCashfreeLoaded(true);
    } else {
      const script = document.createElement("script");
      script.id = "cashfree-sdk";
      script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
      script.async = true;
      script.onload = () => setIsCashfreeLoaded(true);
      document.body.appendChild(script);
    }

    // Check if the user returned from an online payment redirect
    const queryParams = new URLSearchParams(window.location.search);
    const orderIdParam = queryParams.get("order_id");

    if (orderIdParam) {
      verifyPaymentAfterRedirect(orderIdParam);
      return;
    }

    // Load selected address and checkout items from LocalStorage
    const items = JSON.parse(localStorage.getItem("checkout_items") || "[]");
    const address = JSON.parse(localStorage.getItem("selected_address") || "null");

    if (!address) {
      router.push("/checkout/address");
      return;
    }

    setCartItems(items);
    setSelectedAddress(address);
  }, [router]);

  const verifyPaymentAfterRedirect = async (orderId) => {
    setLoading(true);
    try {
      const verifyRes = await fetch("/api/orders/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId }),
      });

      const verifyData = await verifyRes.json();
      setLoading(false);

      if (verifyData.success) {
        localStorage.removeItem("checkout_items");
        router.push(`/orders`);
      } else {
        alert("Payment verification failed: " + (verifyData.message || "Please check order status"));
        router.push(`/checkout/payment`);
      }
    } catch (err) {
      console.error("Verification network error:", err);
      setLoading(false);
      alert("An error occurred during payment verification.");
    }
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + (item.offerPrice || item.price) * (item.quantity || 1),
    0
  );

  const finalTotalAmount = Math.max(0, subtotal - discountAmount);

  // Apply Coupon Handler
  const handleApplyCoupon = async () => {
    if (!couponCode) {
      setCouponMessage("Please enter a coupon code.");
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
      setCouponMessage("An error occurred while applying the coupon.");
    }
  };

  const handlePlaceOrder = async () => {
    if (!selectedPayment) {
      alert("Please select a payment method!");
      return;
    }

    setLoading(true);

    try {
      if (selectedPayment === "COD") {
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
          localStorage.removeItem("checkout_items");
          router.push("/orders");
        } else {
          alert(data.message || "An error occurred while placing the order.");
          setLoading(false);
        }
      } else if (selectedPayment === "ONLINE") {
        if (!window.Cashfree) {
          alert("Payment SDK is still loading, please wait a moment.");
          setLoading(false);
          return;
        }

        // 1. Create order and fetch Cashfree Session ID
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: cartItems,
            shippingAddress: selectedAddress,
            paymentMethod: "Online",
            paymentStatus: "Pending",
            totalAmount: finalTotalAmount,
            discountAmount,
            couponCode: discountApplied ? couponCode : null,
          }),
        });

        const data = await res.json();

        if (!data.success || !data.payment_session_id) {
          alert("Error initializing payment: " + (data.message || "Unknown error"));
          setLoading(false);
          return;
        }

        // 2. Initialize Cashfree SDK and redirect for stable verification
        const cashfree = window.Cashfree({
          mode: "sandbox"
        });

        let checkoutOptions = {
          paymentSessionId: data.payment_session_id,
          redirectTarget: "_modal"
        };

        cashfree.checkout(checkoutOptions);
      }
    } catch (error) {
      console.error("Order error:", error);
      alert("Something went wrong, please try again.");
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

      {/* COUPON SECTION */}
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
            value="ONLINE"
            checked={selectedPayment === "ONLINE"}
            onChange={(e) => setSelectedPayment(e.target.value)}
          />
          <span>Online Payment (UPI / Cards / NetBanking via Cashfree)</span>
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
        {loading ? "Processing..." : `Pay ₹${finalTotalAmount.toLocaleString()} & Place Order`}
      </button>
    </div>
  );
}