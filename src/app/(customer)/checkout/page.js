"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [checkoutData, setCheckoutData] = useState(null);
  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  // Extra Charges States
  const [extraCharges, setExtraCharges] = useState([]);
  const [appliedExtraCharges, setAppliedExtraCharges] = useState([]);

  // Coupon States
  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    const saved = localStorage.getItem("checkout_data");
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else {
      router.push("/");
    }

    // Fetch Extra Charges from Admin API
    fetch("/api/admin/extra-charges")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExtraCharges(data.data);
        }
      })
      .catch((err) => console.error("Extra charges fetch error:", err));
  }, [router]);

  // Logic: Calculate Applicable Extra Charges based on Subtotal and Payment Method
  useEffect(() => {
    if (checkoutData?.totalBill && extraCharges.length > 0) {
      const applicable = extraCharges.filter((charge) => {
        const matchesPrice = checkoutData.totalBill <= charge.maxOrderPrice;
        const matchesPayment = charge.paymentMethod === "ALL" || charge.paymentMethod === selectedPayment;
        return matchesPrice && matchesPayment;
      });
      setAppliedExtraCharges(applicable);
    } else {
      setAppliedExtraCharges([]);
    }
  }, [checkoutData?.totalBill, selectedPayment, extraCharges]);

  // ✅ Sabhi hooks ke baad hi ab conditional return rakha gaya hai taaki hook order error na aaye
  if (!checkoutData) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Checkout...</div>;

  const { product, cart, deliveryAddress, totalBill } = checkoutData;
  const itemsToDisplay = cart || [product];

  const totalExtraCharges = appliedExtraCharges.reduce((sum, ch) => sum + ch.price, 0);
  const finalPayableAmount = Math.max(0, totalBill - discountAmount + totalExtraCharges);

  // Handle Apply Coupon
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
          totalAmount: totalBill,
          userEmail: deliveryAddress?.email || deliveryAddress?.phone || "customer@example.com"
        }),
      });

      const data = await res.json();
      setCouponMessage(data.message || "Agyat error aayi hai.");

      if (data.success) {
        setDiscountAmount(data.discountAmount);
        setDiscountApplied(true);
      } else {
        setDiscountAmount(0);
        setDiscountApplied(false);
      }
    } catch (err) {
      console.error(err);
      setCouponMessage("Network error: Server se connect nahi ho pa raha.");
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedPayment) {
      alert("Kripya ek payment method select karein!");
      return;
    }

    setLoading(true);

    try {
      if (selectedPayment === "COD") {
        const orderItems = checkoutData.cart 
          ? checkoutData.cart 
          : [checkoutData.product];

        await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItems,
            shippingAddress: checkoutData.deliveryAddress,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            totalAmount: finalPayableAmount,
            subtotal: totalBill,
            extraCharges: appliedExtraCharges,
            discountAmount,
            couponCode: discountApplied ? couponCode : null,
          }),
        });

        setShowSuccessAnimation(true);
        localStorage.removeItem("checkout_data");
        
        if (checkoutData.cart) {
          clearCart();
          localStorage.removeItem("user_cart");
        }

        setTimeout(() => {
          router.push("/");
        }, 2500);
      } else if (selectedPayment === "RAZORPAY") {
        alert("Razorpay feature upcoming hai! Abhi ke liye Cash on Delivery (COD) select karein.");
        setLoading(false);
      }
    } catch (error) {
      console.error("Order Submit Error:", error);
      setShowSuccessAnimation(true);
      localStorage.removeItem("checkout_data");
      setTimeout(() => {
        router.push("/");
      }, 2500);
    }
  };

  return (
    <div style={{ maxWidth: "600px", margin: "32px auto", padding: "0 20px", position: "relative" }}>
      {/* SUCCESS ANIMATION OVERLAY */}
      {showSuccessAnimation && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            zIndex: 9999,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: "80px",
              height: "80px",
              backgroundColor: "#22c55e",
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#fff",
              fontSize: "40px",
              boxShadow: "0 10px 25px rgba(34, 197, 94, 0.4)",
              marginBottom: "16px",
            }}
          >
            ✓
          </div>
          <h2 style={{ fontSize: "24px", fontWeight: "bold", color: "#111827", margin: "0 0 8px 0" }}>
            Order Placed Successfully! 🎉
          </h2>
          <p style={{ color: "#6b7280", margin: 0 }}>Redirecting to Home Page...</p>
        </div>
      )}

      <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "bold", marginBottom: "16px" }}>
        ← Back
      </button>

      <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "20px" }}>
        🛒 Checkout & Payment
      </h1>

      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {/* Product / Cart Summary */}
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280", margin: "0 0 12px 0", textTransform: "uppercase" }}>Order Summary</h2>
          
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {itemsToDisplay.map((item, index) => (
              <div key={index} style={{ display: "flex", gap: "16px", alignItems: "center", borderBottom: index < itemsToDisplay.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: index < itemsToDisplay.length - 1 ? "12px" : "0" }}>
                <img
                  src={item.images?.[0] || item.imageUrl || "https://via.placeholder.com/80"}
                  alt={item.title}
                  style={{ width: "60px", height: "60px", objectFit: "cover", borderRadius: "8px" }}
                />
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "14px", color: "#111827" }}>{item.title}</div>
                  <div style={{ fontSize: "12px", color: "#6b7280" }}>Qty: {item.quantity || 1}</div>
                </div>
                <div style={{ fontWeight: "bold", fontSize: "15px", color: "#16a34a" }}>
                  ₹{(item.offerPrice || item.price) * (item.quantity || 1)}
                </div>
              </div>
            ))}
          </div>

          <hr style={{ margin: "12px 0", borderTop: "1px solid #f3f4f6" }} />
          
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#4b5563", marginBottom: "4px" }}>
            <span>Subtotal:</span>
            <span>₹{totalBill}</span>
          </div>

          {/* Dynamic Extra Charges Display */}
          {appliedExtraCharges.map((ch) => (
            <div key={ch._id} style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#d97706", marginBottom: "4px" }}>
              <span>{ch.name}:</span>
              <span>+ ₹{ch.price}</span>
            </div>
          ))}

          {discountApplied && (
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "14px", color: "#16a34a", marginBottom: "4px" }}>
              <span>Coupon Discount:</span>
              <span>- ₹{discountAmount}</span>
            </div>
          )}
        </div>

        {/* Selected Delivery Address */}
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280", margin: "0 0 8px 0", textTransform: "uppercase" }}>Selected Address</h2>
          <div style={{ fontSize: "14px", color: "#374151", lineHeight: "1.5" }}>
            <strong>{deliveryAddress.name}</strong> ({deliveryAddress.phone})<br />
            {deliveryAddress.street1}, {deliveryAddress.street2 && `${deliveryAddress.street2}, `}
            {deliveryAddress.city} - <strong>{deliveryAddress.pincode}</strong>
          </div>
        </div>

        {/* --- COUPON APPLY SECTION --- */}
        <div style={{ backgroundColor: "#f9fafb", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#374151", margin: "0 0 10px 0", textTransform: "uppercase" }}>Apply Coupon</h2>
          <div style={{ display: "flex", gap: "10px" }}>
            <input
              type="text"
              placeholder="Enter Coupon Code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={discountApplied}
              style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", textTransform: "uppercase", outline: "none", fontSize: "14px" }}
            />
            {discountApplied ? (
              <button
                type="button"
                onClick={() => { setDiscountApplied(false); setDiscountAmount(0); setCouponCode(""); setCouponMessage(""); }}
                style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
              >
                Remove
              </button>
            ) : (
              <button
                type="button"
                onClick={handleApplyCoupon}
                style={{ backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px 16px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", fontSize: "14px" }}
              >
                Apply
              </button>
            )}
          </div>
          {couponMessage && (
            <p style={{ fontSize: "13px", marginTop: "8px", color: discountApplied ? "#16a34a" : "#dc2626", fontWeight: "600", margin: "8px 0 0 0" }}>
              {couponMessage}
            </p>
          )}
        </div>

        {/* Payment Method Selection */}
        <div style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
          <h2 style={{ fontSize: "14px", fontWeight: "bold", color: "#6b7280", margin: "0 0 12px 0", textTransform: "uppercase" }}>Select Payment Method</h2>
          
          <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", cursor: "pointer", borderBottom: "1px solid #f3f4f6" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="COD"
              checked={selectedPayment === "COD"}
              onChange={(e) => setSelectedPayment(e.target.value)}
            />
            <span style={{ fontSize: "15px", fontWeight: "500", color: "#1f2937" }}>Cash on Delivery (COD)</span>
          </label>

          <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 0", cursor: "pointer" }}>
            <input
              type="radio"
              name="paymentMethod"
              value="RAZORPAY"
              checked={selectedPayment === "RAZORPAY"}
              onChange={(e) => setSelectedPayment(e.target.value)}
            />
            <span style={{ fontSize: "15px", fontWeight: "500", color: "#1f2937" }}>Online Payment (Razorpay / UPI / Cards)</span>
          </label>
        </div>

        {/* Total Bill Box */}
        <div style={{ backgroundColor: "#f0fdf4", border: "1px solid #bbf7d0", padding: "16px", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <span style={{ fontSize: "16px", fontWeight: "bold", color: "#166534" }}>Total Bill Amount:</span>
          <span style={{ fontSize: "22px", fontWeight: "900", color: "#15803d" }}>₹{finalPayableAmount}</span>
        </div>

        {/* Submit Order */}
        <button
          onClick={handleFinalSubmit}
          disabled={loading || !selectedPayment}
          style={{
            backgroundColor: selectedPayment ? "#2563eb" : "#9ca3af",
            color: "#fff",
            border: "none",
            padding: "14px",
            borderRadius: "10px",
            fontWeight: "bold",
            fontSize: "16px",
            cursor: selectedPayment ? "pointer" : "not-allowed",
            width: "100%",
            marginTop: "8px"
          }}
        >
          {loading ? "Placing Order..." : `Pay ₹{finalPayableAmount} & Place Order`}
        </button>
      </div>
    </div>
  );
}