"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../context/CartContext";

export default function CheckoutPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [checkoutData, setCheckoutData] = useState(null);
  
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
    const saved = localStorage.getItem("checkout_data");
    if (saved) {
      setCheckoutData(JSON.parse(saved));
    } else {
      router.push("/");
    }

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

  // Quantity change handler for checkout items with stock validation
  const handleUpdateQuantity = (index, delta) => {
    if (!checkoutData) return;

    const updatedData = { ...checkoutData };
    
    if (updatedData.cart) {
      const updatedCart = [...updatedData.cart];
      const currentItem = updatedCart[index];
      const currentQty = currentItem.quantity || 1;
      const newQty = currentQty + delta;

      // Determine max available stock for this item/variant
      let maxStock = currentItem.stock !== undefined ? currentItem.stock : 10;
      if (currentItem.selectedSize && currentItem.selectedColor && currentItem.sizeStockVariants) {
        const variant = currentItem.sizeStockVariants.find(
          (v) => v.size === currentItem.selectedSize && v.color === currentItem.selectedColor
        );
        if (variant) maxStock = variant.stock;
      } else if (currentItem.selectedSize && currentItem.sizeStockVariants) {
        const variant = currentItem.sizeStockVariants.find(
          (v) => v.size === currentItem.selectedSize && (!v.color || v.color === "")
        );
        if (variant) maxStock = variant.stock;
      }

      if (delta > 0 && newQty > maxStock) {
        alert(`Only ${maxStock} items available in stock!`);
        return;
      }

      if (newQty <= 0) {
        updatedCart.splice(index, 1);
      } else {
        updatedCart[index].quantity = newQty;
      }
      updatedData.cart = updatedCart;
      
      // Recalculate totalBill
      updatedData.totalBill = updatedCart.reduce(
        (sum, item) => sum + (item.offerPrice || item.price) * (item.quantity || 1), 
        0
      );
      
      if (updatedCart.length === 0) {
        localStorage.removeItem("checkout_data");
        router.push("/");
        return;
      }
    } else if (updatedData.product) {
      const prod = updatedData.product;
      const currentQty = prod.quantity || 1;
      const newQty = currentQty + delta;

      let maxStock = prod.stock !== undefined ? prod.stock : 10;
      if (prod.selectedSize && prod.selectedColor && prod.sizeStockVariants) {
        const variant = prod.sizeStockVariants.find(
          (v) => v.size === prod.selectedSize && v.color === prod.selectedColor
        );
        if (variant) maxStock = variant.stock;
      } else if (prod.selectedSize && prod.sizeStockVariants) {
        const variant = prod.sizeStockVariants.find(
          (v) => v.size === prod.selectedSize && (!v.color || v.color === "")
        );
        if (variant) maxStock = variant.stock;
      }

      if (delta > 0 && newQty > maxStock) {
        alert(`Only ${maxStock} items available in stock!`);
        return;
      }

      if (newQty <= 0) {
        localStorage.removeItem("checkout_data");
        router.push("/");
        return;
      }
      prod.quantity = newQty;
      updatedData.totalBill = (prod.offerPrice || prod.price) * newQty;
    }

    setCheckoutData(updatedData);
    localStorage.setItem("checkout_data", JSON.stringify(updatedData));
    setDiscountApplied(false);
    setDiscountAmount(0);
    setCouponMessage("");
  };

  const { product, cart, totalBill } = checkoutData || {};
  const itemsToDisplay = cart || (product ? [product] : []);

  useEffect(() => {
    if (totalBill && extraCharges.length > 0) {
      const applicable = extraCharges.filter((charge) => {
        const matchesPrice = totalBill <= charge.maxOrderPrice;
        const matchesPayment = charge.paymentMethod === "ALL" || charge.paymentMethod === selectedPayment;
        return matchesPrice && matchesPayment;
      });
      setAppliedExtraCharges(applicable);
    } else {
      setAppliedExtraCharges([]);
    }
  }, [totalBill, selectedPayment, extraCharges]);

  if (!checkoutData) {
    return (
      <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", background: "#ffffff", color: "#111827", fontFamily: "sans-serif", fontSize: "14px" }}>
        Loading checkout...
      </div>
    );
  }

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

    const loggedInUser = JSON.parse(localStorage.getItem("customer_user") || "{}");
    const currentLogEmail = loggedInUser?.email || loggedInUser?.mail || selectedAddress?.email || "";
    const currentUserId = loggedInUser?.id || loggedInUser?.userId || currentLogEmail || "guest_user";

    try {
      if (selectedPayment === "COD") {
        const res = await fetch("/api/orders/create/cod", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: orderItems,
            shippingAddress: selectedAddress,
            email: currentLogEmail, 
            userId: currentUserId,
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
            router.push(`/orders/${data.orderId}`);
          }, 1500);
        } else {
          alert(data.message || "Error placing order");
          setLoading(false);
        }

      } else if (selectedPayment === "ONLINE") {
        const fullCheckoutPayload = {
          ...checkoutData,
          shippingAddress: selectedAddress,
          email: currentLogEmail,
          userId: currentUserId,
          paymentMethod: "Online",
          totalBill: finalPayableAmount,
          subtotal: totalBill,
          extraCharges: appliedExtraCharges,
          discountAmount,
          couponCode: discountApplied ? couponCode : null,
        };

        localStorage.setItem("checkout_data", JSON.stringify(fullCheckoutPayload));
        setLoading(false);
        router.push("/checkout/payment");
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
        
        <div style={{ marginBottom: "24px" }}>
          <h1 style={{ fontSize: "22px", fontWeight: "700", letterSpacing: "-0.3px", margin: "0 0 4px 0" }}>Checkout</h1>
          <p style={{ fontSize: "14px", color: "#6b7280", margin: 0 }}>Select your saved delivery address and payment option.</p>
        </div>

        <div style={{ display: "flex", borderBottom: "1px solid #e5e7eb", marginBottom: "24px" }}>
          <div style={{ padding: "0 0 12px 0", marginRight: "24px", fontSize: "14px", fontWeight: "600", borderBottom: currentStep === 1 ? "2px solid #111827" : "2px solid transparent", color: currentStep === 1 ? "#111827" : "#9ca3af" }}>
            1. Select Address
          </div>
          <div style={{ padding: "0 0 12px 0", fontSize: "14px", fontWeight: "600", borderBottom: currentStep === 2 ? "2px solid #111827" : "2px solid transparent", color: currentStep === 2 ? "#111827" : "#9ca3af" }}>
            2. Payment & Summary
          </div>
        </div>

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
                          <div style={{ fontSize: "12px", color: "#6b7280" }}>Phone: {addr.phone} | Email: {addr.email}</div>
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

        {currentStep === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            
            <button onClick={() => setCurrentStep(1)} style={{ background: "none", border: "none", color: "#4b5563", cursor: "pointer", fontWeight: "600", fontSize: "13px", textAlign: "left", padding: 0 }}>
              ← Change Address
            </button>

            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "16px", letterSpacing: "0.5px" }}>Items Summary</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {itemsToDisplay.map((item, index) => {
                  const itemImg = item.images?.[0] || item.imageUrl || item.image || "https://via.placeholder.com/60";
                  const itemQty = item.quantity || 1;
                  return (
                    <div key={index} style={{ display: "flex", alignItems: "center", gap: "12px", borderBottom: index < itemsToDisplay.length - 1 ? "1px solid #f3f4f6" : "none", paddingBottom: index < itemsToDisplay.length - 1 ? "14px" : "0" }}>
                      <img src={itemImg} alt={item.title || item.name} style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>{item.title || item.name}</div>
                        
                        {/* Quantity Controls (- / +) */}
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "6px" }}>
                          <button 
                            onClick={() => handleUpdateQuantity(index, -1)}
                            style={{ width: "22px", height: "22px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            -
                          </button>
                          <span style={{ fontSize: "13px", fontWeight: "600", minWidth: "16px", textAlign: "center" }}>{itemQty}</span>
                          <button 
                            onClick={() => handleUpdateQuantity(index, 1)}
                            style={{ width: "22px", height: "22px", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer", fontSize: "12px", fontWeight: "bold", display: "flex", alignItems: "center", justifyContent: "center" }}
                          >
                            +
                          </button>
                        </div>
                      </div>
                      <div style={{ fontSize: "14px", fontWeight: "600", color: "#111827" }}>
                        ₹{(item.offerPrice || item.price) * itemQty}
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

            <div style={{ background: "#ffffff", border: "1px solid #e5e7eb", borderRadius: "12px", padding: "20px" }}>
              <div style={{ fontSize: "12px", fontWeight: "700", color: "#6b7280", textTransform: "uppercase", marginBottom: "12px", letterSpacing: "0.5px" }}>Payment Option</div>
              
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: "1px solid", borderColor: selectedPayment === "COD" ? "#111827" : "#e5e7eb", borderRadius: "8px", cursor: "pointer", backgroundColor: selectedPayment === "COD" ? "#f9fafb" : "#fff" }}>
                  <input type="radio" name="paymentMethod" value="COD" checked={selectedPayment === "COD"} onChange={(e) => setSelectedPayment(e.target.value)} style={{ accentColor: "#111827" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Cash on Delivery</span>
                </label>

                <label style={{ display: "flex", alignItems: "center", gap: "10px", padding: "12px", border: "1px solid", borderColor: selectedPayment === "ONLINE" ? "#111827" : "#e5e7eb", borderRadius: "8px", cursor: "pointer", backgroundColor: selectedPayment === "ONLINE" ? "#f9fafb" : "#fff" }}>
                  <input type="radio" name="paymentMethod" value="ONLINE" checked={selectedPayment === "ONLINE"} onChange={(e) => setSelectedPayment(e.target.value)} style={{ accentColor: "#111827" }} />
                  <span style={{ fontSize: "14px", fontWeight: "600" }}>Online Payment (Choose Gateway on Next Step)</span>
                </label>
              </div>
            </div>

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
              {loading ? "Processing..." : selectedPayment === "COD" ? "Place Order" : "Proceed to Payment Gateways"}
            </button>

          </div>
        )}

      </div>
    </div>
  );
}