(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(customer)/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>CheckoutPage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/navigation.js [app-client] (ecmascript)");
(()=>{
    const e = new Error("Cannot find module '../context/CartContext'");
    e.code = 'MODULE_NOT_FOUND';
    throw e;
})();
;
var _s = __turbopack_context__.k.signature();
"use client";
;
;
;
function CheckoutPage() {
    _s();
    const router = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"])();
    const { clearCart } = useCart();
    const [currentStep, setCurrentStep] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(1);
    const [checkoutData, setCheckoutData] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [savedAddresses, setSavedAddresses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [selectedAddress, setSelectedAddress] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [loadingAddresses, setLoadingAddresses] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [selectedPayment, setSelectedPayment] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [showSuccessAnimation, setShowSuccessAnimation] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [extraCharges, setExtraCharges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [appliedExtraCharges, setAppliedExtraCharges] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [couponCode, setCouponCode] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [discountAmount, setDiscountAmount] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(0);
    const [discountApplied, setDiscountApplied] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [couponMessage, setCouponMessage] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            const saved = localStorage.getItem("checkout_data");
            if (saved) {
                setCheckoutData(JSON.parse(saved));
            } else {
                router.push("/");
            }
            const fetchUserAddresses = {
                "CheckoutPage.useEffect.fetchUserAddresses": async ()=>{
                    try {
                        const loggedInUser = JSON.parse(localStorage.getItem("customer_user") || "{}");
                        const userEmail = loggedInUser?.email || loggedInUser?.mail;
                        if (userEmail) {
                            const res = await fetch(`/api/customer/addresses?email=${encodeURIComponent(userEmail)}`);
                            const data = await res.json();
                            if (data.success && Array.isArray(data.addresses)) {
                                setSavedAddresses(data.addresses);
                            } else if (Array.isArray(data)) {
                                setSavedAddresses(data);
                            } else {
                                setSavedAddresses([]);
                            }
                        } else {
                            setSavedAddresses([]);
                        }
                    } catch (err) {
                        console.error("Error fetching user addresses:", err);
                        setSavedAddresses([]);
                    } finally{
                        setLoadingAddresses(false);
                    }
                }
            }["CheckoutPage.useEffect.fetchUserAddresses"];
            fetchUserAddresses();
            fetch("/api/admin/extra-charges").then({
                "CheckoutPage.useEffect": (res)=>res.json()
            }["CheckoutPage.useEffect"]).then({
                "CheckoutPage.useEffect": (data)=>{
                    if (data.success) {
                        setExtraCharges(data.data);
                    }
                }
            }["CheckoutPage.useEffect"]).catch({
                "CheckoutPage.useEffect": (err)=>console.error("Extra charges fetch error:", err)
            }["CheckoutPage.useEffect"]);
        }
    }["CheckoutPage.useEffect"], [
        router
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "CheckoutPage.useEffect": ()=>{
            if (checkoutData?.totalBill && extraCharges.length > 0) {
                const applicable = extraCharges.filter({
                    "CheckoutPage.useEffect.applicable": (charge)=>{
                        const matchesPrice = checkoutData.totalBill <= charge.maxOrderPrice;
                        const matchesPayment = charge.paymentMethod === "ALL" || charge.paymentMethod === selectedPayment;
                        return matchesPrice && matchesPayment;
                    }
                }["CheckoutPage.useEffect.applicable"]);
                setAppliedExtraCharges(applicable);
            } else {
                setAppliedExtraCharges([]);
            }
        }
    }["CheckoutPage.useEffect"], [
        checkoutData?.totalBill,
        selectedPayment,
        extraCharges
    ]);
    if (!checkoutData) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                minHeight: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                background: "#ffffff",
                color: "#111827",
                fontFamily: "sans-serif",
                fontSize: "14px"
            },
            children: "Loading checkout..."
        }, void 0, false, {
            fileName: "[project]/src/app/(customer)/page.js",
            lineNumber: 91,
            columnNumber: 7
        }, this);
    }
    const { product, cart, totalBill } = checkoutData;
    const itemsToDisplay = cart || [
        product
    ];
    const totalExtraCharges = appliedExtraCharges.reduce((sum, ch)=>sum + ch.price, 0);
    const finalPayableAmount = Math.max(0, totalBill - discountAmount + totalExtraCharges);
    const handleApplyCoupon = async ()=>{
        if (!couponCode) {
            setCouponMessage("Please enter a coupon code.");
            return;
        }
        try {
            const res = await fetch("/api/orders/apply-coupon", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    code: couponCode,
                    totalAmount: totalBill,
                    userEmail: selectedAddress?.email || selectedAddress?.phone || "customer@example.com"
                })
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
    const handleFinalSubmit = async ()=>{
        if (!selectedAddress) {
            alert("Please select a delivery address.");
            return;
        }
        if (!selectedPayment) {
            alert("Please select a payment method.");
            return;
        }
        setLoading(true);
        const orderItems = checkoutData.cart ? checkoutData.cart : [
            checkoutData.product
        ];
        const loggedInUser = JSON.parse(localStorage.getItem("customer_user") || "{}");
        const currentLogEmail = loggedInUser?.email || loggedInUser?.mail || selectedAddress?.email || "";
        const currentUserId = loggedInUser?.id || loggedInUser?.userId || currentLogEmail || "guest_user";
        try {
            if (selectedPayment === "COD") {
                const res = await fetch("/api/orders/create/cod", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json"
                    },
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
                        couponCode: discountApplied ? couponCode : null
                    })
                });
                const data = await res.json();
                if (data.success) {
                    setShowSuccessAnimation(true);
                    localStorage.removeItem("checkout_data");
                    if (checkoutData.cart) {
                        clearCart();
                        localStorage.removeItem("user_cart");
                    }
                    setTimeout(()=>{
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
                    couponCode: discountApplied ? couponCode : null
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
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            minHeight: "100vh",
            backgroundColor: "#f9fafb",
            padding: "40px 16px",
            fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
            color: "#111827"
        },
        children: [
            showSuccessAnimation && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    inset: 0,
                    backgroundColor: "rgba(255, 255, 255, 0.9)",
                    zIndex: 9999,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            width: "64px",
                            height: "64px",
                            backgroundColor: "#10b981",
                            color: "#fff",
                            borderRadius: "50%",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            fontSize: "28px",
                            fontWeight: "bold",
                            marginBottom: "12px"
                        },
                        children: "✓"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                        style: {
                            fontSize: "20px",
                            fontWeight: "700",
                            margin: 0
                        },
                        children: "Order Successful"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 220,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 218,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: "560px",
                    margin: "0 auto"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                style: {
                                    fontSize: "22px",
                                    fontWeight: "700",
                                    letterSpacing: "-0.3px",
                                    margin: "0 0 4px 0"
                                },
                                children: "Checkout"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 227,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    fontSize: "14px",
                                    color: "#6b7280",
                                    margin: 0
                                },
                                children: "Select your saved delivery address and payment option."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 228,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 226,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            borderBottom: "1px solid #e5e7eb",
                            marginBottom: "24px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "0 0 12px 0",
                                    marginRight: "24px",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    borderBottom: currentStep === 1 ? "2px solid #111827" : "2px solid transparent",
                                    color: currentStep === 1 ? "#111827" : "#9ca3af"
                                },
                                children: "1. Select Address"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 232,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    padding: "0 0 12px 0",
                                    fontSize: "14px",
                                    fontWeight: "600",
                                    borderBottom: currentStep === 2 ? "2px solid #111827" : "2px solid transparent",
                                    color: currentStep === 2 ? "#111827" : "#9ca3af"
                                },
                                children: "2. Payment & Summary"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 235,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 231,
                        columnNumber: 9
                    }, this),
                    currentStep === 1 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            marginBottom: "14px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "12px",
                                                    fontWeight: "700",
                                                    color: "#6b7280",
                                                    textTransform: "uppercase",
                                                    letterSpacing: "0.5px"
                                                },
                                                children: "Choose Delivery Address"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 244,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>router.push("/edit-address"),
                                                style: {
                                                    background: "none",
                                                    border: "none",
                                                    color: "#2563eb",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    cursor: "pointer"
                                                },
                                                children: "Manage Addresses +"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 245,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 243,
                                        columnNumber: 15
                                    }, this),
                                    loadingAddresses ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "14px",
                                            color: "#6b7280",
                                            textAlign: "center",
                                            padding: "20px 0"
                                        },
                                        children: "Loading saved addresses..."
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 254,
                                        columnNumber: 17
                                    }, this) : savedAddresses.length === 0 ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            textAlign: "center",
                                            padding: "16px 0"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "14px",
                                                    color: "#ef4444",
                                                    marginBottom: "8px"
                                                },
                                                children: "No saved addresses found. Please add one first."
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 257,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>router.push("/edit-address"),
                                                style: {
                                                    background: "#111827",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "8px 16px",
                                                    borderRadius: "6px",
                                                    fontSize: "13px",
                                                    fontWeight: "600",
                                                    cursor: "pointer"
                                                },
                                                children: "Add New Address"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 258,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 256,
                                        columnNumber: 17
                                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "12px"
                                        },
                                        children: savedAddresses.map((addr, idx)=>{
                                            const addressId = addr.id || idx;
                                            const isSelected = selectedAddress?.id === addr.id || selectedAddress === addr;
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "flex-start",
                                                    gap: "12px",
                                                    padding: "14px",
                                                    border: "1px solid",
                                                    borderColor: isSelected ? "#111827" : "#e5e7eb",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    backgroundColor: isSelected ? "#f9fafb" : "#fff"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "savedAddress",
                                                        checked: isSelected,
                                                        onChange: ()=>setSelectedAddress(addr),
                                                        style: {
                                                            accentColor: "#111827",
                                                            marginTop: "3px"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 285,
                                                        columnNumber: 25
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "14px",
                                                                    fontWeight: "600",
                                                                    color: "#111827",
                                                                    marginBottom: "2px"
                                                                },
                                                                children: addr.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(customer)/page.js",
                                                                lineNumber: 293,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "13px",
                                                                    color: "#4b5563",
                                                                    lineHeight: "1.4",
                                                                    marginBottom: "4px"
                                                                },
                                                                children: [
                                                                    addr.street1,
                                                                    addr.street2 ? `, ${addr.street2}` : "",
                                                                    ", ",
                                                                    addr.city,
                                                                    " - ",
                                                                    addr.pincode
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(customer)/page.js",
                                                                lineNumber: 294,
                                                                columnNumber: 27
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "12px",
                                                                    color: "#6b7280"
                                                                },
                                                                children: [
                                                                    "Phone: ",
                                                                    addr.phone,
                                                                    " | Email: ",
                                                                    addr.email
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(customer)/page.js",
                                                                lineNumber: 297,
                                                                columnNumber: 27
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 292,
                                                        columnNumber: 25
                                                    }, this)
                                                ]
                                            }, addressId, true, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 271,
                                                columnNumber: 23
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 266,
                                        columnNumber: 17
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 242,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    if (!selectedAddress) {
                                        alert("Please select an address to continue.");
                                        return;
                                    }
                                    setCurrentStep(2);
                                },
                                style: {
                                    background: "#111827",
                                    color: "#ffffff",
                                    border: "none",
                                    padding: "14px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    cursor: "pointer",
                                    width: "100%"
                                },
                                children: "Continue to Payment"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 306,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 241,
                        columnNumber: 11
                    }, this),
                    currentStep === 2 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>setCurrentStep(1),
                                style: {
                                    background: "none",
                                    border: "none",
                                    color: "#4b5563",
                                    cursor: "pointer",
                                    fontWeight: "600",
                                    fontSize: "13px",
                                    textAlign: "left",
                                    padding: 0
                                },
                                children: "← Change Address"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#6b7280",
                                            textTransform: "uppercase",
                                            marginBottom: "16px",
                                            letterSpacing: "0.5px"
                                        },
                                        children: "Items Summary"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 329,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "14px"
                                        },
                                        children: itemsToDisplay.map((item, index)=>{
                                            const itemImg = item.images?.[0] || item.imageUrl || item.image || "https://via.placeholder.com/60";
                                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "12px",
                                                    borderBottom: index < itemsToDisplay.length - 1 ? "1px solid #f3f4f6" : "none",
                                                    paddingBottom: index < itemsToDisplay.length - 1 ? "14px" : "0"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: itemImg,
                                                        alt: item.title || item.name,
                                                        style: {
                                                            width: "50px",
                                                            height: "50px",
                                                            objectFit: "cover",
                                                            borderRadius: "8px",
                                                            border: "1px solid #e5e7eb"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 336,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            flex: 1
                                                        },
                                                        children: [
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "14px",
                                                                    fontWeight: "600",
                                                                    color: "#111827"
                                                                },
                                                                children: item.title || item.name
                                                            }, void 0, false, {
                                                                fileName: "[project]/src/app/(customer)/page.js",
                                                                lineNumber: 338,
                                                                columnNumber: 25
                                                            }, this),
                                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                                style: {
                                                                    fontSize: "12px",
                                                                    color: "#6b7280"
                                                                },
                                                                children: [
                                                                    "Qty: ",
                                                                    item.quantity || 1
                                                                ]
                                                            }, void 0, true, {
                                                                fileName: "[project]/src/app/(customer)/page.js",
                                                                lineNumber: 339,
                                                                columnNumber: 25
                                                            }, this)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 337,
                                                        columnNumber: 23
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                        style: {
                                                            fontSize: "14px",
                                                            fontWeight: "600",
                                                            color: "#111827"
                                                        },
                                                        children: [
                                                            "₹",
                                                            (item.offerPrice || item.price) * (item.quantity || 1)
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 341,
                                                        columnNumber: 23
                                                    }, this)
                                                ]
                                            }, index, true, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 335,
                                                columnNumber: 21
                                            }, this);
                                        })
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 331,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            height: "1px",
                                            backgroundColor: "#e5e7eb",
                                            margin: "16px 0"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 349,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "8px",
                                            fontSize: "14px",
                                            color: "#4b5563"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Subtotal"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 353,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "₹",
                                                            totalBill
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 354,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 352,
                                                columnNumber: 17
                                            }, this),
                                            appliedExtraCharges.map((ch)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        display: "flex",
                                                        justifyContent: "space-between",
                                                        color: "#d97706"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: ch.name
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 359,
                                                            columnNumber: 21
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            children: [
                                                                "+ ₹",
                                                                ch.price
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 360,
                                                            columnNumber: 21
                                                        }, this)
                                                    ]
                                                }, ch._id, true, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 358,
                                                    columnNumber: 19
                                                }, this)),
                                            discountApplied && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    display: "flex",
                                                    justifyContent: "space-between",
                                                    color: "#10b981"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: "Discount"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 366,
                                                        columnNumber: 21
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        children: [
                                                            "- ₹",
                                                            discountAmount
                                                        ]
                                                    }, void 0, true, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 367,
                                                        columnNumber: 21
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 351,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 328,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#6b7280",
                                            textTransform: "uppercase",
                                            marginBottom: "10px",
                                            letterSpacing: "0.5px"
                                        },
                                        children: "Promo Code"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 374,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            gap: "8px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                type: "text",
                                                placeholder: "Enter code",
                                                value: couponCode,
                                                onChange: (e)=>setCouponCode(e.target.value),
                                                disabled: discountApplied,
                                                style: {
                                                    flex: 1,
                                                    padding: "10px 12px",
                                                    borderRadius: "6px",
                                                    border: "1px solid #d1d5db",
                                                    outline: "none",
                                                    fontSize: "14px",
                                                    textTransform: "uppercase",
                                                    fontWeight: "600"
                                                }
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 376,
                                                columnNumber: 17
                                            }, this),
                                            discountApplied ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setDiscountApplied(false);
                                                    setDiscountAmount(0);
                                                    setCouponCode("");
                                                    setCouponMessage("");
                                                },
                                                style: {
                                                    background: "#ef4444",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "0 16px",
                                                    borderRadius: "6px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    fontSize: "13px"
                                                },
                                                children: "Remove"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 385,
                                                columnNumber: 19
                                            }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: handleApplyCoupon,
                                                style: {
                                                    background: "#111827",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "0 16px",
                                                    borderRadius: "6px",
                                                    fontWeight: "600",
                                                    cursor: "pointer",
                                                    fontSize: "13px"
                                                },
                                                children: "Apply"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 389,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 375,
                                        columnNumber: 15
                                    }, this),
                                    couponMessage && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            marginTop: "8px",
                                            color: discountApplied ? "#10b981" : "#ef4444",
                                            fontWeight: "600"
                                        },
                                        children: couponMessage
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 394,
                                        columnNumber: 33
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 373,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    background: "#ffffff",
                                    border: "1px solid #e5e7eb",
                                    borderRadius: "12px",
                                    padding: "20px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#6b7280",
                                            textTransform: "uppercase",
                                            marginBottom: "12px",
                                            letterSpacing: "0.5px"
                                        },
                                        children: "Payment Option"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 398,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            display: "flex",
                                            flexDirection: "column",
                                            gap: "10px"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "12px",
                                                    border: "1px solid",
                                                    borderColor: selectedPayment === "COD" ? "#111827" : "#e5e7eb",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    backgroundColor: selectedPayment === "COD" ? "#f9fafb" : "#fff"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "paymentMethod",
                                                        value: "COD",
                                                        checked: selectedPayment === "COD",
                                                        onChange: (e)=>setSelectedPayment(e.target.value),
                                                        style: {
                                                            accentColor: "#111827"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 402,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "14px",
                                                            fontWeight: "600"
                                                        },
                                                        children: "Cash on Delivery"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 403,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 401,
                                                columnNumber: 17
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("label", {
                                                style: {
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: "10px",
                                                    padding: "12px",
                                                    border: "1px solid",
                                                    borderColor: selectedPayment === "ONLINE" ? "#111827" : "#e5e7eb",
                                                    borderRadius: "8px",
                                                    cursor: "pointer",
                                                    backgroundColor: selectedPayment === "ONLINE" ? "#f9fafb" : "#fff"
                                                },
                                                children: [
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                                        type: "radio",
                                                        name: "paymentMethod",
                                                        value: "ONLINE",
                                                        checked: selectedPayment === "ONLINE",
                                                        onChange: (e)=>setSelectedPayment(e.target.value),
                                                        style: {
                                                            accentColor: "#111827"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 407,
                                                        columnNumber: 19
                                                    }, this),
                                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                        style: {
                                                            fontSize: "14px",
                                                            fontWeight: "600"
                                                        },
                                                        children: "Online Payment (Choose Gateway on Next Step)"
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 408,
                                                        columnNumber: 19
                                                    }, this)
                                                ]
                                            }, void 0, true, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 406,
                                                columnNumber: 17
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 400,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 397,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    padding: "16px 20px",
                                    background: "#f3f4f6",
                                    borderRadius: "12px",
                                    border: "1px solid #e5e7eb"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "14px",
                                            fontWeight: "600",
                                            color: "#4b5563"
                                        },
                                        children: "Total Payable"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 414,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "20px",
                                            fontWeight: "800",
                                            color: "#111827"
                                        },
                                        children: [
                                            "₹",
                                            finalPayableAmount
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 415,
                                        columnNumber: 15
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 413,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: handleFinalSubmit,
                                disabled: loading || !selectedPayment,
                                style: {
                                    background: selectedPayment ? "#111827" : "#e5e7eb",
                                    color: selectedPayment ? "#ffffff" : "#9ca3af",
                                    border: "none",
                                    padding: "16px",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    fontSize: "15px",
                                    cursor: selectedPayment ? "pointer" : "not-allowed",
                                    width: "100%"
                                },
                                children: loading ? "Processing..." : selectedPayment === "COD" ? "Place Order" : "Proceed to Payment Gateways"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 418,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 322,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 224,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(customer)/page.js",
        lineNumber: 215,
        columnNumber: 5
    }, this);
}
_s(CheckoutPage, "yq6UKkF4k2WhZKrGUejMeV1Z+/M=", false, function() {
    return [
        __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$navigation$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useRouter"],
        useCart
    ];
});
_c = CheckoutPage;
var _c;
__turbopack_context__.k.register(_c, "CheckoutPage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_app_%28customer%29_page_1329641.js.map