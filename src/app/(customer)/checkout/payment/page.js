"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function PaymentPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [checkoutData, setCheckoutData] = useState(null);

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

  if (!checkoutData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "sans-serif" }}>
        Loading payment details...
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", padding: "40px 16px", fontFamily: "sans-serif", maxWidth: "480px", margin: "0 auto" }}>
      <h1 style={{ fontSize: "20px", fontWeight: "700", marginBottom: "16px" }}>Complete Payment</h1>
      <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>Total Amount: ₹{checkoutData.totalBill}</p>
      
      <button
        onClick={() => router.push("/checkout")}
        style={{ background: "#111827", color: "#fff", border: "none", padding: "12px 20px", borderRadius: "8px", cursor: "pointer", fontWeight: "600" }}
      >
        Back to Checkout
      </button>
    </div>
  );
}