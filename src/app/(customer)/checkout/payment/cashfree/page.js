"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/app/(customer)/context/CartContext";

export default function CashfreePaymentPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);

    const saved = localStorage.getItem("checkout_data");
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else {
      router.push("/checkout");
    }
  }, [router]);

  const handleCashfreePayment = async () => {
    if (!checkoutData) return;
    setLoading(true);

    try {
      const orderItems = checkoutData.cartItems || checkoutData.cart || [checkoutData.product];

      const res = await fetch("/api/orders/create/online", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: orderItems,
          shippingAddress: checkoutData.shippingAddress,
          email: checkoutData.email || checkoutData.shippingAddress?.email,
          userId: checkoutData.userId || "guest_user",
          paymentMethod: "Online",
          paymentStatus: "Pending",
          totalAmount: checkoutData.totalBill,
          subtotal: checkoutData.subtotal || checkoutData.totalBill,
          extraCharges: checkoutData.extraCharges || [],
          discountAmount: checkoutData.discountAmount || 0,
          couponCode: checkoutData.couponCode || null,
        }),
      });
      const data = await res.json();

      if (!data.success || !data.payment_session_id) {
        alert(data.message || "Failed to initialize Cashfree payment");
        setLoading(false);
        return;
      }

      const cashfree = window.Cashfree({ mode: "sandbox" });
      cashfree.checkout({
        paymentSessionId: data.payment_session_id,
        redirectTarget: "_modal",
      }).then(async (result) => {
        if (result.error) {
          setLoading(false);
          alert("Payment failed or cancelled: " + result.error.message);
          return;
        }

        if (result.order || result.paymentDetails) {
          try {
            const verifyRes = await fetch("/api/orders/verify/cashfree", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                orderId: data.orderId,
                cashfree_order_id: result.order?.orderId
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              setLoading(false);
              setShowSuccessAnimation(true);
              localStorage.removeItem("checkout_data");
              localStorage.removeItem("user_cart");
              if (clearCart) clearCart();

              setTimeout(() => {
                router.push(`/orders/${data.orderId}`);
              }, 1500);
            } else {
              setLoading(false);
              alert("Payment verification failed. Please contact support.");
            }
          } catch (err) {
            console.error("Verification error:", err);
            setLoading(false);
            alert("An error occurred during payment verification.");
          }
        } else {
          setLoading(false);
        }
      });
    } catch (err) {
      console.error("Cashfree Error:", err);
      alert("Something went wrong during payment.");
      setLoading(false);
    }
  };

  if (!checkoutData) return <div style={{ padding: "40px", fontFamily: "sans-serif" }}>Loading payment details...[cite: 5]</div>;

  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px", fontFamily: "sans-serif", maxWidth: "480px", margin: "0 auto", position: "relative" }}>
      
      {showSuccessAnimation && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(255, 255, 255, 0.95)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "64px", height: "64px", backgroundColor: "#10b981", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>✓</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Payment Successful & Order Placed!</h2>
        </div>
      )}

      <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "8px" }}>Cashfree Checkout[cite: 5]</h1>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Amount: ₹{checkoutData.totalBill}</p>
      
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <button
          onClick={handleCashfreePayment}
          disabled={loading}
          style={{ background: "#4f46e5", color: "#fff", border: "none", padding: "14px", borderRadius: "8px", cursor: "pointer", fontWeight: "700" }}
        >
          {loading ? "Processing..." : `Pay ₹{checkoutData.totalBill}`}
        </button>
        <button
          onClick={() => router.push("/checkout/payment")}
          style={{ background: "#f3f4f6", color: "#374151", border: "none", padding: "12px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
        >
          Change Gateway[cite: 5]
        </button>
      </div>
    </div>
  );
}