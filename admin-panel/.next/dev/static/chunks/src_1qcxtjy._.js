(globalThis["TURBOPACK"] || (globalThis["TURBOPACK"] = [])).push([typeof document === "object" ? document.currentScript : undefined,
"[project]/src/app/(customer)/page.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "default",
    ()=>HomePage
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/jsx-dev-runtime.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/compiled/react/index.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/client/app-dir/link.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/firebase.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__f__as__GoogleAuthProvider$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-CvXU3_1x.js [app-client] (ecmascript) <export f as GoogleAuthProvider>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ai__as__signInWithPopup$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-CvXU3_1x.js [app-client] (ecmascript) <export ai as signInWithPopup>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/messaging/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/@firebase/messaging/dist/esm/index.esm.js [app-client] (ecmascript)");
;
var _s = __turbopack_context__.k.signature();
// src/app/(customer)/page.js
"use client";
;
;
;
;
;
function HomePage() {
    _s();
    const [products, setProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [categories, setCategories] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [filteredProducts, setFilteredProducts] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    const [search, setSearch] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
    const [selectedCategory, setSelectedCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [selectedSubCategory, setSelectedSubCategory] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("All");
    const [loading, setLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    // User & Auth State
    const [user, setUser] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    const [isCheckingAuth, setIsCheckingAuth] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(true);
    const [shareCopiedId, setShareCopiedId] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(null);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            if ("TURBOPACK compile-time truthy", 1) {
                const queryParams = new URLSearchParams(window.location.search);
                const urlSearch = queryParams.get("search");
                if (urlSearch) {
                    setSearch(urlSearch);
                }
            }
        }
    }["HomePage.useEffect"], []);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            try {
                const savedUser = localStorage.getItem("customer_user");
                if (savedUser) {
                    setUser(JSON.parse(savedUser));
                }
            } catch (e) {
                console.error(e);
            } finally{
                setIsCheckingAuth(false);
            }
        }
    }["HomePage.useEffect"], []);
    // Request Notification Permission and Save Token
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const requestNotificationToken = {
                "HomePage.useEffect.requestNotificationToken": async ()=>{
                    if (("TURBOPACK compile-time value", "object") !== "undefined" && "Notification" in window && __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messaging"]) {
                        try {
                            const permission = await Notification.requestPermission();
                            if (permission === "granted") {
                                // NOTE: Replace with your actual Firebase Cloud Messaging VAPID public key if generated in console
                                const token = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$messaging$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["getToken"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["messaging"], {
                                    vapidKey: "YOUR_PUBLIC_VAPID_KEY_HERE"
                                });
                                if (token) {
                                    console.log("FCM Device Token:", token);
                                    // Send token to backend database if user is logged in or anonymously
                                    await fetch("/api/save-token", {
                                        method: "POST",
                                        headers: {
                                            "Content-Type": "application/json"
                                        },
                                        body: JSON.stringify({
                                            token,
                                            email: user?.email || "guest"
                                        })
                                    });
                                }
                            }
                        } catch (error) {
                            console.error("Error saving notification token:", error);
                        }
                    }
                }
            }["HomePage.useEffect.requestNotificationToken"];
            if (!isCheckingAuth) {
                requestNotificationToken();
            }
        }
    }["HomePage.useEffect"], [
        isCheckingAuth,
        user
    ]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            const fetchData = {
                "HomePage.useEffect.fetchData": async ()=>{
                    try {
                        const [prodRes, catRes] = await Promise.all([
                            fetch("/api/products"),
                            fetch("/api/categories")
                        ]);
                        const prodData = await prodRes.json();
                        const catData = await catRes.json();
                        if (prodData.success) {
                            setProducts(prodData.data);
                            setFilteredProducts(prodData.data);
                        }
                        if (catData.success) {
                            const mainCats = catData.data.filter({
                                "HomePage.useEffect.fetchData.mainCats": (c)=>c.type === "category"
                            }["HomePage.useEffect.fetchData.mainCats"]);
                            setCategories(mainCats);
                        }
                    } catch (err) {
                        console.error("Error fetching data:", err);
                    } finally{
                        setLoading(false);
                    }
                }
            }["HomePage.useEffect.fetchData"];
            fetchData();
        }
    }["HomePage.useEffect"], []);
    const [allCategoriesList, setAllCategoriesList] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])([]);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            fetch("/api/categories").then({
                "HomePage.useEffect": (res)=>res.json()
            }["HomePage.useEffect"]).then({
                "HomePage.useEffect": (data)=>{
                    if (data.success) setAllCategoriesList(data.data);
                }
            }["HomePage.useEffect"]).catch({
                "HomePage.useEffect": (err)=>console.error(err)
            }["HomePage.useEffect"]);
        }
    }["HomePage.useEffect"], []);
    const subCategories = allCategoriesList.filter((c)=>c.type === "subcategory" && c.parentCategory === selectedCategory);
    (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useEffect"])({
        "HomePage.useEffect": ()=>{
            let result = products;
            if (search.trim() !== "") {
                result = result.filter({
                    "HomePage.useEffect": (p)=>p.title.toLowerCase().includes(search.toLowerCase())
                }["HomePage.useEffect"]);
            }
            if (selectedCategory !== "All") {
                result = result.filter({
                    "HomePage.useEffect": (p)=>p.category === selectedCategory
                }["HomePage.useEffect"]);
            }
            if (selectedSubCategory !== "All") {
                result = result.filter({
                    "HomePage.useEffect": (p)=>p.subCategory === selectedSubCategory
                }["HomePage.useEffect"]);
            }
            setFilteredProducts(result);
        }
    }["HomePage.useEffect"], [
        search,
        selectedCategory,
        selectedSubCategory,
        products
    ]);
    // Google Login Handler
    const handleGoogleLogin = async ()=>{
        try {
            const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__f__as__GoogleAuthProvider$3e$__["GoogleAuthProvider"]();
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ai__as__signInWithPopup$3e$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
            const loggedUser = result.user;
            const userData = {
                name: loggedUser.displayName,
                email: loggedUser.email,
                photo: loggedUser.photoURL
            };
            setUser(userData);
            localStorage.setItem("customer_user", JSON.stringify(userData));
        } catch (error) {
            console.error("Login Error:", error);
        }
    };
    const handleQuickShare = async (e, p)=>{
        e.preventDefault();
        e.stopPropagation();
        const productUrl = `${window.location.origin}/product/${p._id}`;
        const shareData = {
            title: p.title,
            text: `Check out this amazing product: ${p.title}`,
            url: productUrl
        };
        if (navigator.share) {
            try {
                await navigator.share(shareData);
            } catch (err) {
                console.log("Error sharing:", err);
            }
        } else {
            navigator.clipboard.writeText(productUrl);
            setShareCopiedId(p._id);
            setTimeout(()=>setShareCopiedId(null), 2000);
        }
    };
    if (isCheckingAuth) {
        return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
            style: {
                padding: "60px",
                textAlign: "center",
                fontSize: "16px",
                fontWeight: "600",
                color: "#4b5563"
            },
            children: "Loading ZentoBazaar..."
        }, void 0, false, {
            fileName: "[project]/src/app/(customer)/page.js",
            lineNumber: 186,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontFamily: "system-ui, -apple-system, sans-serif",
            backgroundColor: "#f8fafc",
            minHeight: "100vh",
            paddingBottom: "60px",
            position: "relative"
        },
        children: [
            !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    bottom: "20px",
                    left: "50%",
                    transform: "translateX(-50%)",
                    backgroundColor: "#ffffff",
                    padding: "16px 24px",
                    borderRadius: "20px",
                    boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                    zIndex: 1000,
                    border: "1px solid #e2e8f0",
                    width: "90%",
                    maxWidth: "500px",
                    justifyContent: "space-between"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                style: {
                                    margin: "0 0 4px 0",
                                    fontSize: "14px",
                                    fontWeight: "800",
                                    color: "#0f172a"
                                },
                                children: "Welcome to ZENTROBAZAAR! 👋"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 216,
                                columnNumber: 13
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                style: {
                                    margin: 0,
                                    fontSize: "12px",
                                    color: "#64748b"
                                },
                                children: "Sign in quickly with Google to manage your orders."
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 217,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 215,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                        onClick: handleGoogleLogin,
                        style: {
                            backgroundColor: "#6366f1",
                            color: "#fff",
                            border: "none",
                            padding: "10px 18px",
                            borderRadius: "12px",
                            fontWeight: "700",
                            fontSize: "13px",
                            cursor: "pointer",
                            whiteSpace: "nowrap",
                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                        },
                        children: "Login with Google"
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 219,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 197,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: "1280px",
                    margin: "20px auto",
                    padding: "0 20px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)",
                        borderRadius: "28px",
                        padding: "50px 40px",
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        flexWrap: "wrap",
                        gap: "30px",
                        border: "1px solid #e2e8f0"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: "1",
                                minWidth: "280px"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                    style: {
                                        backgroundColor: "#dbeafe",
                                        color: "#1e40af",
                                        padding: "6px 14px",
                                        borderRadius: "20px",
                                        fontSize: "12px",
                                        fontWeight: "800",
                                        textTransform: "uppercase"
                                    },
                                    children: "Welcome to ZENTROBAZAAR"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 253,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h1", {
                                    style: {
                                        fontSize: "42px",
                                        fontWeight: "900",
                                        color: "#0f172a",
                                        margin: "16px 0",
                                        lineHeight: "1.2"
                                    },
                                    children: [
                                        "Everything You Need, ",
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("br", {}, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 257,
                                            columnNumber: 36
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                            style: {
                                                color: "#6366f1"
                                            },
                                            children: "All in One Place."
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 258,
                                            columnNumber: 15
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 256,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                    style: {
                                        fontSize: "15px",
                                        color: "#475569",
                                        marginBottom: "24px",
                                        lineHeight: "1.6"
                                    },
                                    children: "Discover top quality products at best prices. Fast delivery, secure payments & hassle-free returns."
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 260,
                                    columnNumber: 13
                                }, this),
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                    onClick: ()=>window.scrollTo({
                                            top: 600,
                                            behavior: "smooth"
                                        }),
                                    style: {
                                        backgroundColor: "#6366f1",
                                        color: "#fff",
                                        border: "none",
                                        padding: "14px 28px",
                                        borderRadius: "14px",
                                        fontWeight: "700",
                                        fontSize: "15px",
                                        cursor: "pointer",
                                        boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
                                    },
                                    children: "Shop Now →"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 263,
                                    columnNumber: 13
                                }, this)
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 252,
                            columnNumber: 11
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                flex: "1",
                                textAlign: "center",
                                minWidth: "280px"
                            },
                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    fontSize: "80px"
                                },
                                children: "🛍️✨"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 281,
                                columnNumber: 13
                            }, this)
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 280,
                            columnNumber: 11
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(customer)/page.js",
                    lineNumber: 241,
                    columnNumber: 9
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 240,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    maxWidth: "1280px",
                    margin: "0 auto",
                    padding: "0 20px"
                },
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "20px",
                            margin: "30px 0",
                            backgroundColor: "#fff",
                            padding: "24px",
                            borderRadius: "20px",
                            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)",
                            border: "1px solid #f1f5f9"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#eef2ff",
                                            padding: "12px",
                                            borderRadius: "14px",
                                            fontSize: "18px"
                                        },
                                        children: "🛡️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 304,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 2px 0",
                                                    fontSize: "13px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "100% Secure"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 306,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "11px",
                                                    color: "#64748b"
                                                },
                                                children: "Your payments are safe"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 307,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 305,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 303,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#f0fdf4",
                                            padding: "12px",
                                            borderRadius: "14px",
                                            fontSize: "18px"
                                        },
                                        children: "🚚"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 312,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 2px 0",
                                                    fontSize: "13px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Fast Delivery"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 314,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "11px",
                                                    color: "#64748b"
                                                },
                                                children: "Delivered quickly"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 315,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 313,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 311,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#fff7ed",
                                            padding: "12px",
                                            borderRadius: "14px",
                                            fontSize: "18px"
                                        },
                                        children: "📦"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 320,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 2px 0",
                                                    fontSize: "13px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Easy Returns"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 322,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "11px",
                                                    color: "#64748b"
                                                },
                                                children: "7 days return policy"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 323,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 321,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 319,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "16px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        style: {
                                            background: "#f0f9ff",
                                            padding: "12px",
                                            borderRadius: "14px",
                                            fontSize: "18px"
                                        },
                                        children: "🎧"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 328,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 2px 0",
                                                    fontSize: "13px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "24/7 Support"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 330,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "11px",
                                                    color: "#64748b"
                                                },
                                                children: "Dedicated help"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 331,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 329,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 327,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 290,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            margin: "40px 0 20px 0"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    marginBottom: "20px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                    style: {
                                        fontSize: "20px",
                                        fontWeight: "800",
                                        color: "#0f172a",
                                        margin: 0
                                    },
                                    children: "Shop By Categories"
                                }, void 0, false, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 339,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 338,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "grid",
                                    gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))",
                                    gap: "16px"
                                },
                                children: categories.map((cat)=>{
                                    const catImg = cat.image && cat.image.trim() !== "" ? cat.image : cat.imageUrl;
                                    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        onClick: ()=>{
                                            setSelectedCategory(cat.name);
                                            setSelectedSubCategory("All");
                                            window.scrollTo({
                                                top: 600,
                                                behavior: "smooth"
                                            });
                                        },
                                        style: {
                                            backgroundColor: "#fff",
                                            border: selectedCategory === cat.name ? "2px solid #6366f1" : "1px solid #f1f5f9",
                                            borderRadius: "20px",
                                            padding: "20px",
                                            textAlign: "center",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                                            transition: "all 0.2s ease"
                                        },
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    width: "70px",
                                                    height: "70px",
                                                    margin: "0 auto 12px auto",
                                                    borderRadius: "50%",
                                                    backgroundColor: "#f8fafc",
                                                    overflow: "hidden",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    border: "1px solid #e2e8f0"
                                                },
                                                children: catImg ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                    src: catImg,
                                                    alt: cat.name,
                                                    style: {
                                                        width: "100%",
                                                        height: "100%",
                                                        objectFit: "cover"
                                                    },
                                                    onError: (e)=>{
                                                        e.target.style.display = 'none';
                                                    }
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 367,
                                                    columnNumber: 23
                                                }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                    style: {
                                                        fontSize: "24px"
                                                    },
                                                    children: "🏷️"
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 376,
                                                    columnNumber: 23
                                                }, this)
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 365,
                                                columnNumber: 19
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                style: {
                                                    fontSize: "14px",
                                                    fontWeight: "700",
                                                    color: "#1e293b"
                                                },
                                                children: cat.name
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 379,
                                                columnNumber: 19
                                            }, this)
                                        ]
                                    }, cat._id, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 347,
                                        columnNumber: 17
                                    }, this);
                                })
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 342,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 337,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            background: "linear-gradient(135deg, #4f46e5 0%, #3b82f6 100%)",
                            borderRadius: "24px",
                            padding: "30px 40px",
                            color: "#fff",
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            flexWrap: "wrap",
                            gap: "20px",
                            margin: "40px 0",
                            boxShadow: "0 10px 25px -5px rgba(79, 70, 229, 0.4)"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            backgroundColor: "rgba(255,255,255,0.2)",
                                            padding: "4px 12px",
                                            borderRadius: "20px",
                                            fontSize: "11px",
                                            fontWeight: "700",
                                            textTransform: "uppercase"
                                        },
                                        children: "Limited Time Offer"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 401,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                        style: {
                                            fontSize: "26px",
                                            fontWeight: "900",
                                            margin: "10px 0 6px 0"
                                        },
                                        children: "Deals of the Day"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 404,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                        style: {
                                            margin: 0,
                                            fontSize: "14px",
                                            opacity: 0.9
                                        },
                                        children: "Huge discounts on top products. Don't miss out!"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 405,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 400,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                onClick: ()=>{
                                    setSelectedCategory("All");
                                    setSelectedSubCategory("All");
                                    window.scrollTo({
                                        top: 600,
                                        behavior: "smooth"
                                    });
                                },
                                style: {
                                    backgroundColor: "#fff",
                                    color: "#4f46e5",
                                    border: "none",
                                    padding: "12px 24px",
                                    borderRadius: "14px",
                                    fontWeight: "800",
                                    fontSize: "14px",
                                    cursor: "pointer",
                                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                                },
                                children: "Explore Deals →"
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 407,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 387,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "#fff",
                            borderRadius: "20px",
                            padding: "20px",
                            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)",
                            border: "1px solid #f1f5f9",
                            marginBottom: "30px",
                            display: "flex",
                            flexDirection: "column",
                            gap: "16px"
                        },
                        children: [
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: "12px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("input", {
                                        type: "text",
                                        placeholder: "Search products...",
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value),
                                        style: {
                                            flex: 1,
                                            padding: "14px 18px",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "14px",
                                            fontSize: "14px",
                                            backgroundColor: "#fff",
                                            outline: "none"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 444,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        style: {
                                            backgroundColor: "#6366f1",
                                            color: "#fff",
                                            border: "none",
                                            padding: "0 24px",
                                            borderRadius: "14px",
                                            fontWeight: "700",
                                            fontSize: "14px",
                                            cursor: "pointer"
                                        },
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 459,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 443,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    gap: "10px",
                                    overflowX: "auto",
                                    paddingBottom: "4px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>{
                                            setSelectedCategory("All");
                                            setSelectedSubCategory("All");
                                        },
                                        style: {
                                            padding: "8px 18px",
                                            borderRadius: "12px",
                                            border: selectedCategory === "All" ? "none" : "1px solid #e2e8f0",
                                            backgroundColor: selectedCategory === "All" ? "#6366f1" : "#fff",
                                            color: selectedCategory === "All" ? "#fff" : "#475569",
                                            cursor: "pointer",
                                            fontWeight: "700",
                                            fontSize: "13px",
                                            whiteSpace: "nowrap"
                                        },
                                        children: "All Products"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 476,
                                        columnNumber: 13
                                    }, this),
                                    categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>{
                                                setSelectedCategory(cat.name);
                                                setSelectedSubCategory("All");
                                            },
                                            style: {
                                                padding: "8px 18px",
                                                borderRadius: "12px",
                                                border: selectedCategory === cat.name ? "none" : "1px solid #e2e8f0",
                                                backgroundColor: selectedCategory === cat.name ? "#6366f1" : "#fff",
                                                color: selectedCategory === cat.name ? "#fff" : "#475569",
                                                cursor: "pointer",
                                                fontWeight: "700",
                                                fontSize: "13px",
                                                whiteSpace: "nowrap"
                                            },
                                            children: cat.name
                                        }, cat._id, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 497,
                                            columnNumber: 15
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 475,
                                columnNumber: 11
                            }, this),
                            subCategories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    overflowX: "auto",
                                    backgroundColor: "#f8fafc",
                                    padding: "8px 12px",
                                    borderRadius: "12px"
                                },
                                children: [
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                        style: {
                                            fontSize: "12px",
                                            fontWeight: "700",
                                            color: "#64748b",
                                            whiteSpace: "nowrap"
                                        },
                                        children: "Sub:"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 522,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedSubCategory("All"),
                                        style: {
                                            padding: "6px 12px",
                                            borderRadius: "10px",
                                            border: "none",
                                            backgroundColor: selectedSubCategory === "All" ? "#3b82f6" : "#e2e8f0",
                                            color: selectedSubCategory === "All" ? "#fff" : "#334155",
                                            cursor: "pointer",
                                            fontWeight: "600",
                                            fontSize: "12px",
                                            whiteSpace: "nowrap"
                                        },
                                        children: "All"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 523,
                                        columnNumber: 15
                                    }, this),
                                    subCategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedSubCategory(sub.name),
                                            style: {
                                                padding: "6px 12px",
                                                borderRadius: "10px",
                                                border: "none",
                                                backgroundColor: selectedSubCategory === sub.name ? "#3b82f6" : "#e2e8f0",
                                                color: selectedSubCategory === sub.name ? "#fff" : "#334155",
                                                cursor: "pointer",
                                                fontWeight: "600",
                                                fontSize: "12px",
                                                whiteSpace: "nowrap"
                                            },
                                            children: sub.name
                                        }, sub._id, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 540,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 521,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 430,
                        columnNumber: 9
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            marginBottom: "20px"
                        },
                        children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: "20px",
                                fontWeight: "800",
                                color: "#0f172a",
                                marginBottom: "20px"
                            },
                            children: "Best Sellers"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 564,
                            columnNumber: 11
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 563,
                        columnNumber: 9
                    }, this),
                    loading ? /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            textAlign: "center",
                            padding: "60px",
                            color: "#64748b",
                            fontSize: "15px",
                            fontWeight: "600"
                        },
                        children: "Loading Products..."
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 568,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))",
                            gap: "24px"
                        },
                        children: filteredProducts.length > 0 ? filteredProducts.map((p)=>{
                            let discountPercent = 0;
                            if (p.originalPrice && p.originalPrice > p.offerPrice) {
                                discountPercent = Math.round((p.originalPrice - p.offerPrice) / p.originalPrice * 100);
                            }
                            return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$client$2f$app$2d$dir$2f$link$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"], {
                                href: `/product/${p._id}`,
                                style: {
                                    textDecoration: "none"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                    style: {
                                        backgroundColor: "#fff",
                                        border: "1px solid #f1f5f9",
                                        borderRadius: "20px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: "100%",
                                        boxShadow: "0 4px 15px -3px rgba(0,0,0,0.04)",
                                        transition: "all 0.3s ease",
                                        position: "relative"
                                    },
                                    children: [
                                        discountPercent > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: "absolute",
                                                top: "16px",
                                                left: "16px",
                                                zIndex: 2,
                                                background: "#ef4444",
                                                color: "#fff",
                                                borderRadius: "6px",
                                                padding: "3px 8px",
                                                fontSize: "11px",
                                                fontWeight: "800"
                                            },
                                            children: [
                                                discountPercent,
                                                "% OFF"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 596,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            onClick: (e)=>handleQuickShare(e, p),
                                            style: {
                                                position: "absolute",
                                                top: "16px",
                                                right: "16px",
                                                zIndex: 2,
                                                background: "#fff",
                                                borderRadius: "50%",
                                                width: "36px",
                                                height: "36px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                                                cursor: "pointer",
                                                border: "1px solid #f1f5f9"
                                            },
                                            title: shareCopiedId === p._id ? "Link Copied!" : "Share Product",
                                            children: "🔗"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 602,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        backgroundColor: "#f8fafc",
                                                        height: "200px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "20px"
                                                    },
                                                    children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("img", {
                                                        src: p.images && p.images.length > 0 ? p.images[0] : p.imageUrl || "https://via.placeholder.com/150",
                                                        alt: p.title,
                                                        style: {
                                                            maxWidth: "100%",
                                                            maxHeight: "100%",
                                                            objectFit: "contain",
                                                            mixBlendMode: "multiply"
                                                        }
                                                    }, void 0, false, {
                                                        fileName: "[project]/src/app/(customer)/page.js",
                                                        lineNumber: 627,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 626,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: "20px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "11px",
                                                                color: "#6366f1",
                                                                fontWeight: "700",
                                                                textTransform: "uppercase"
                                                            },
                                                            children: p.category
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 635,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h3", {
                                                            style: {
                                                                fontSize: "15px",
                                                                fontWeight: "800",
                                                                color: "#0f172a",
                                                                margin: "6px 0 10px 0",
                                                                lineHeight: "1.4",
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden"
                                                            },
                                                            children: p.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 638,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: "flex",
                                                                alignItems: "baseline",
                                                                gap: "8px"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "18px",
                                                                        fontWeight: "900",
                                                                        color: "#059669"
                                                                    },
                                                                    children: [
                                                                        "₹",
                                                                        p.offerPrice
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                                    lineNumber: 643,
                                                                    columnNumber: 29
                                                                }, this),
                                                                p.originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "13px",
                                                                        color: "#94a3b8",
                                                                        textDecoration: "line-through",
                                                                        fontWeight: "600"
                                                                    },
                                                                    children: [
                                                                        "₹",
                                                                        p.originalPrice
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                                    lineNumber: 645,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 642,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 634,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 625,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: "0 20px 20px 20px"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    width: "100%",
                                                    backgroundColor: "#6366f1",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "12px",
                                                    borderRadius: "12px",
                                                    fontWeight: "700",
                                                    fontSize: "13px",
                                                    cursor: "pointer",
                                                    boxShadow: "0 4px 12px rgba(99, 102, 241, 0.2)"
                                                },
                                                children: "View details"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 654,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 653,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 580,
                                    columnNumber: 21
                                }, this)
                            }, p._id, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 579,
                                columnNumber: 19
                            }, this);
                        }) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                gridColumn: "1 / -1",
                                textAlign: "center",
                                padding: "60px",
                                color: "#64748b",
                                fontSize: "15px"
                            },
                            children: "No products found!"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 676,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 570,
                        columnNumber: 11
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 287,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(customer)/page.js",
        lineNumber: 193,
        columnNumber: 5
    }, this);
}
_s(HomePage, "baisSc+7kGNs945R6Iw70AGCef8=");
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/db.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "connectDB",
    ()=>connectDB,
    "dbConnect",
    ()=>dbConnect,
    "default",
    ()=>__TURBOPACK__default__export__
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = /*#__PURE__*/ __turbopack_context__.i("[project]/node_modules/next/dist/build/polyfills/process.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mongoose$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/mongoose/index.js [app-client] (ecmascript)");
;
const MONGODB_URI = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$build$2f$polyfills$2f$process$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].env.MONGODB_URI;
if (!MONGODB_URI) {
    throw new Error("MONGODB_URI .env file me defined nahi hai");
}
let cached = /*TURBOPACK member replacement*/ __turbopack_context__.g.mongoose || {
    conn: null,
    promise: null
};
async function connectDB() {
    if (cached.conn) return cached.conn;
    if (!cached.promise) {
        cached.promise = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$mongoose$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"].connect(MONGODB_URI).then((mongoose)=>mongoose);
    }
    cached.conn = await cached.promise;
    return cached.conn;
}
async function dbConnect() {
    return connectDB();
}
const __TURBOPACK__default__export__ = connectDB;
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
// src/app/api/save-token/route.js
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-client] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.js [app-client] (ecmascript)");
;
;
async function POST(req) {
    try {
        const { token, email } = await req.json();
        if (!token) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
                success: false,
                message: "Token is required"
            }, {
                status: 400
            });
        }
        const client = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["default"];
        const db = client.db("zentrobazaar");
        // Token ko database mein save ya update karein taaki duplicate entries na ho
        await db.collection("userTokens").updateOne({
            token: token
        }, {
            $set: {
                token,
                email: email || "guest",
                updatedAt: new Date()
            }
        }, {
            upsert: true
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: true,
            message: "Token saved successfully"
        });
    } catch (error) {
        console.error("Error saving token:", error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["NextResponse"].json({
            success: false,
            error: error.message
        }, {
            status: 500
        });
    }
}
_c = POST;
var _c;
__turbopack_context__.k.register(_c, "POST");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_1qcxtjy._.js.map