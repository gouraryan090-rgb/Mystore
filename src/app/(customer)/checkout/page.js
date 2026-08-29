"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutWizard() {
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState(null);
  
  // Address States
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [loadingAddresses, setLoadingAddresses] = useState(true);

  const [selectedPayment, setSelectedPayment] = useState("");
  const [loading, setLoading] = useState(false);
  const [showSuccessAnimation, setShowSuccessAnimation] = useState(false);

  const [extraCharges, setExtraCharges] = useState([]);
  const [appliedExtraCharges, setAppliedExtraCharges] = useState([]);

  const [couponCode, setCouponCode] = useState("");
  const [discountAmount, setDiscountAmount] = useState(0);
  const [discountApplied, setDiscountApplied] = useState(false);
  const [couponMessage, setCouponMessage] = useState("");

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://sdk.cashfree.com/js/v3/cashfree.js";
    script.async = true;
    document.body.appendChild(script);

    const saved = localStorage.getItem("checkout_data");
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else {
      router.push("/");
    }

    // Fetch user saved addresses from localStorage (customer_addresses)
    const localAddresses = localStorage.getItem("customer_addresses");
    if (localAddresses) {
      try {
        const parsed = JSON.parse(localAddresses);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSavedAddresses(parsed);
        }
      } catch (err) {
        console.error("Error parsing local addresses:", err);
      }
    }
    setLoadingAddresses(false);

    fetch("/api/admin/extra-charges")
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setExtraCharges(data.data);
        }
      })
      .catch((err) => console.error("Extra charges fetch error:", err));
  }, [router]);

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

  if (!checkoutData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", color: "#111827", fontFamily: "sans-serif", fontSize: "14px" }}>
        Loading checkout...
      </div>
    );
  }

  const { product, cart, totalBill } = checkoutData;
  const itemsToDisplay = cart || [product];

  const totalExtraCharges = appliedExtraCharges.reduce((sum, ch) => sum + ch.price, 0);
  const finalPayableAmount = Math.max(0, totalBill - discountAmount + totalExtraCharges);

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
          totalAmount: totalBill,
          userEmail: selectedAddress?.email || selectedAddress?.phone || "customer@example.com"
        }),
      });

      const data = await res.json();
      setCouponMessage(data.message || "Invalid coupon.");

      if (data.success) {
        setDiscountAmount(data.discountAmount);
        setDiscountApplied(true);
      } else {
        setDiscountAmount(0);
        setDiscountApplied(false);
      }
    } catch (err) {
      console.error(err);
      setCouponMessage("Something went wrong.");
    }
  };

  const handleFinalSubmit = async () => {
    if (!selectedAddress) {
      alert("Please select a delivery address.");
      return;
    }
    if (!selectedPayment) {
      alert("Please select a payment method.");
      return;
    }

    setLoading(true);
    const orderItems = checkoutData.cart ? checkoutData.cart : [checkoutData.product];

    try {
      if (selectedPayment === "COD") {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItems,
            shippingAddress: selectedAddress,
            paymentMethod: "COD",
            paymentStatus: "Pending",
            totalAmount: finalPayableAmount,
            subtotal: totalBill,
            extraCharges: appliedExtraCharges,
            discountAmount,
            couponCode: discountApplied ? couponCode : null,
          }),
        });

        const data = await res.json();
        if (data.success) {
          setShowSuccessAnimation(true);
          localStorage.removeItem("checkout_data");
          if (checkoutData.cart) {
            clearCart();
            localStorage.removeItem("user_cart");
          }
          setTimeout(() => {
            router.push(`/order-success?order_id=${data.orderId}`);
          }, 1500);
        } else {
          alert(data.message || "Error placing order");
          setLoading(false);
        }

      } else if (selectedPayment === "ONLINE") {
        const res = await fetch("/api/orders/create", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItems,
            shippingAddress: selectedAddress,
            paymentMethod: "Online",
            paymentStatus: "Pending",
            totalAmount: finalPayableAmount,
            subtotal: totalBill,
            extraCharges: appliedExtraCharges,
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

        const cashfree = window.Cashfree({ mode: "sandbox" });
        cashfree.checkout({ paymentSessionId: data.payment_session_id, redirectTarget: "_modal" }).then((result) => {
          setLoading(false);
          if (result.error) {
            alert("Payment failed or cancelled: " + result.error.message);
          }
          if (result.order) {
            setShowSuccessAnimation(true);
            localStorage.removeItem("checkout_data");
            if (checkoutData.cart) {
              clearCart();
              localStorage.removeItem("user_cart");
            }
            setTimeout(() => {
              router.push(`/order-success?order_id=${data.orderId}`);
            }, 1500);
          }
        });
      }
    } catch (error) {
      console.error("Order Submit Error:", error);
      alert("Something went wrong.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#f9fafb", padding: "40px 16px", fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", color: "#111827" }}>
      
      {showSuccessAnimation && (
        <div style={{ position: "fixed", inset: 0, backgroundColor: "rgba(255, 255, 255, 0.9)", zIndex: 9999, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "64px", height: "64px", backgroundColor: "#10b981", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", fontWeight: "bold", marginBottom: "12px" }}>✓</div>
          <h2 style={{ fontSize: "20px", fontWeight: "700", margin: 0 }}>Order Successful</h2>
        </div>
      )}

      <div style={{ maxWidth: "560px", margin: "0 auto" }}>
        
        {/* Header Title */}
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.3px", margin: "0 0 4px 0" }}>Checkout</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Select your saved delivery address and payment option.</p>
        </div>

        {/* Minimal Progress Tabs */}
        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "24px" }}>
          <div style={{ padding: "0 0 12px 0", marginRight: "24px", fontSize: "14px", fontWeight: "600", borderBottom: currentStep === 1 ? "2px solid #111827" : "2px solid transparent", color: currentStep === 1 ? "#111827" : "#9ca3af" }}>
            1. Select Address
          </div>
          <div style={{ padding: "0 0 12px 0", fontSize: "14px", fontWeight: "600", borderBottom: currentStep === 2 ? "2px solid #111827" : "2px solid transparent", color: currentStep === 2 ? "#111827" : "#9ca3af" }}>
            2. Payment & Summary
          </div>
        </div>

        {/* STEP 1: SELECT ADDRESS FROM LOCALSTORAGE */}
        {currentStep === 1 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "14px" }}>
                <div style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.5px" }}>Choose Delivery Address</div>
                <button 
                  onClick={() => router.push("/edit-address")} 
                  style={{ background: "none", border: "none", color: "#2563eb", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                >
                  Manage Addresses +
                </button>
              </div>
              
              {loadingAddresses ? (
                <div style={{ fontSize: "14px", color: "#6b7280", textAlign: "center", padding: "20px 0" }}>Loading saved addresses...</div>
              ) : savedAddresses.length === 0 ? (
                <div style={{ textAlign: "center", padding: "16px 0" }}>
                  <div style={{ fontSize: "14px", color: "#ef4444", marginBottom: "8px" }}>No saved addresses found. Please add one first.</div>
                  <button 
                    onClick={() => router.push("/edit-address")}
                    style={{ background: "#111827", color: "#fff", border: "none", padding: "8px 16px", borderRadius: "6px", fontSize: "13px", fontWeight: "600", cursor: "pointer" }}
                  >
                    Add New Address
                  </button>
                </div>
              ) : (
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {savedAddresses.map((addr, idx) => {
                    const addressId = addr.id || idx;
                    const isSelected = selectedAddress?.id === addr.id || selectedAddress === addr;
                    return (
                      <label 
                        key={addressId} 
                        style={{ 
                          display: "flex", 
                          alignItems: "flex-start", 
                          gap: "12px", 
                          padding: "14px", 
                          border: "1px solid", 
                          borderColor: isSelected ? "#111827" : "#e5e7eb", 
                          borderRadius: "8px", 
                          cursor: "pointer", 
                          backgroundColor: isSelected ? "#f9fafb" : "#fff" 
                        }}
                      >
                        <input 
                          type="radio" 
                          name="savedAddress" 
                          checked={isSelected} 
                          onChange={() => setSelectedAddress(addr)} 
                          style={{ accentColor: "#111827", marginTop: "3px" }} 
                        />
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827", marginBottom: "2px" }}>{addr.name}</div>
                          <div style={{ fontSize: "13px", color: "#4b5563", lineHeight: "1.4", marginBottom: "4px" }}>
                            {addr.street1}{addr.street2 ? `, ${addr.street2}` : ""}, {addr.city} - {addr.pincode}
                          </div>
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>Phone: {addr.phone}</div>
                        </div>
                      </label>
                    );
                  })}
                </div>
              )}
            </div>

            <button
              onClick={() => {
                if (!selectedAddress) {
                  alert("Please select an address to continue.");
                  return;
                }
                setCurrentStep(2);
              }}
              style={{ background: "#111827", color: "#ffffff", border: "none", padding: "14px", borderRadius: "8px", fontWeight: "600", fontSize: "15px", cursor: "pointer", width: "100%" }}
            >
              Continue to Payment
            </button>
          </div>
        )}

        {/* STEP 2: SUMMARY & PAYMENT */}
        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <button onClick={() => setCurrentStep(1)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "left", padding: 0 }}>
              ← Change Address
            </button>

            {/* Items List with Images */}
            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "0.5px" }}>Items Summary</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {itemsToDisplay.map((item, index) => {
                  const itemImg = item.images?.[0] || item.imageUrl || item.image || "https://via.placeholder.com/60";
                  return (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: index < itemsToDisplay.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: index < itemsToDisplay.length - 1 ? "14px" : "0" }}>
                      <img src={itemImg} alt={item.title || item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{item.title || item.name}</div>
                        <div style={{ fontSize: "12px", color: "#6b7280" }}>Qty: {item.quantity || 1}</div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                        ₹{(item.offerPrice || item.price) * (item.quantity || 1)}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div style={{ height: "1px", backgroundColor: "#e5e7eb", margin: "16px 0" }} />

              <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px", color: "#4b5563" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <span>Subtotal</span>
                  <span>₹{totalBill}</span>
                </div>

                {appliedExtraCharges.map((ch) => (
                  <div key={ch._id} style={{ display: "flex", justifyContent: "space-between", color: "#d97706" }}>
                    <span>{ch.name}</span>
                    <span>+ ₹{ch.price}</span>
                  </div>
                ))}

                {discountApplied && (
                  <div style={{ display: "flex", justifyContent: "space-between", color: "#10b981" }}>
                    <span>Discount</span>
                    <span>- ₹{discountAmount}</span>
                  </div>
                )}
              </div>
            </div>

            {/* Coupon Box */}
            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "10px", letterSpacing: "0.5px" }}>Promo Code</div>
              <div style={{ display: "flex", gap: "8px" }}>
                <input
                  type="text"
                  placeholder="Enter code"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value)}
                  disabled={discountApplied}
                  style={{ flex: 1, padding: "10px 12px", borderRadius: "6px", border: "1px solid #d1d5db", outline: "none", fontSize: "14px", textTransform: "uppercase", fontWeight: "600" }}
                />
                {discountApplied ? (
                  <button onClick={() => { setDiscountApplied(false); setDiscountAmount(0); setCouponCode(""); setCouponMessage(""); }} style={{ background: "#ef4444", color: "#fff", border: "none", padding: "0 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                    Remove
                  </button>
                ) : (
                  <button onClick={handleApplyCoupon} style={{ background: "#111827", color: "#fff", border: "none", padding: "0 16px", borderRadius: "6px", fontWeight: "600", cursor: "pointer", fontSize: "13px" }}>
                    Apply
                  </button>
                )}
              </div>
              {couponMessage && <div style={{ fontSize: "12px", marginTop: "8px", color: discountApplied ? "#10b981" : "#ef4444", fontWeight: "600" }}>{couponMessage}</div>}
            </div>

            {/* Payment Method */}
            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>Payment Option</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: "1px solid", borderColor: selectedPayment === "COD" ? "#111827" : "#e5e7eb", borderRadius: "8px", cursor: "pointer", backgroundColor: selectedPayment === "COD" ? "#f9fafb" : "#fff" }}>
                  <input type="radio" name="paymentMethod" value="COD" checked={selectedPayment === "COD"} onChange={(e) => setSelectedPayment(e.target.value)} style={{ accentColor: "#111827" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Cash on Delivery</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: "1px solid", borderColor: selectedPayment === "ONLINE" ? "#111827" : "#e5e7eb", borderRadius: "8px", cursor: "pointer", backgroundColor: selectedPayment === "ONLINE" ? "#f9fafb" : "#fff" }}>
                  <input type="radio" name="paymentMethod" value="ONLINE" checked={selectedPayment === "ONLINE"} onChange={(e) => setSelectedPayment(e.target.value)} style={{ accentColor: "#111827" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Online Payment (Cards / UPI via Cashfree)</span>
                </label>
              </div>
            </div>

            {/* Total Footer Banner */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 20px", background: "#f3f4f6", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#4b5563" }}>Total Payable</span>
              <span style={{ fontSize: "20px", fontWeight: "800", color: "#111827" }}>₹{finalPayableAmount}</span>
            </div>

            <button
              onClick={handleFinalSubmit}
              disabled={loading || !selectedPayment}
              style={{
                background: selectedPayment ? "#111827" : "#e5e7eb",
                color: selectedPayment ? "#ffffff" : "#9ca3af",
                border: "none",
                padding: "16px",
                borderRadius: "8px",
                fontWeight: "600",
                fontSize: "15px",
                cursor: selectedPayment ? "pointer" : "not-allowed",
                width: "100%"
              }}
            >
              {loading ? "Processing..." : selectedPayment === "COD" ? "Place Order" : `Pay ₹{finalPayableAmount}`}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}