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
;
var _s = __turbopack_context__.k.signature();
"use client";
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
    const [authLoading, setAuthLoading] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])(false);
    const [authError, setAuthError] = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$index$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["useState"])("");
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
    const handleGoogleLogin = async ()=>{
        setAuthError("");
        setAuthLoading(true);
        const provider = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__f__as__GoogleAuthProvider$3e$__["GoogleAuthProvider"]();
        try {
            const result = await (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__ai__as__signInWithPopup$3e$__["signInWithPopup"])(__TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$firebase$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["auth"], provider);
            const loggedUser = {
                name: result.user.displayName,
                email: result.user.email,
                photo: result.user.photoURL
            };
            setUser(loggedUser);
            localStorage.setItem("customer_user", JSON.stringify(loggedUser));
            window.location.reload();
        } catch (error) {
            console.error("Login Error:", error);
            setAuthError("Login fail ho gaya! Firebase Console me Google Provider check karein.");
        } finally{
            setAuthLoading(false);
        }
    };
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
            lineNumber: 134,
            columnNumber: 7
        }, this);
    }
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        style: {
            fontFamily: "system-ui, -apple-system, sans-serif"
        },
        children: [
            !user && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                style: {
                    position: "fixed",
                    top: 0,
                    left: 0,
                    width: "100vw",
                    height: "100vh",
                    backgroundColor: "rgba(0,0,0,0.75)",
                    backdropFilter: "blur(6px)",
                    zIndex: 99999,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px"
                },
                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                    style: {
                        backgroundColor: "#fff",
                        width: "100%",
                        maxWidth: "400px",
                        borderRadius: "24px",
                        padding: "32px 24px",
                        textAlign: "center",
                        boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
                        border: "1px solid #f1f5f9"
                    },
                    children: [
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                fontSize: "44px",
                                marginBottom: "14px"
                            },
                            children: "🛍️"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 173,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                            style: {
                                fontSize: "24px",
                                fontWeight: "800",
                                color: "#0f172a",
                                margin: "0 0 8px 0"
                            },
                            children: "Welcome to ZENTROBAZAAR"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 174,
                            columnNumber: 13
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                            style: {
                                fontSize: "14px",
                                color: "#64748b",
                                marginBottom: "24px"
                            },
                            children: "Shopping start karne ke liye Google account se login karein."
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 177,
                            columnNumber: 13
                        }, this),
                        authError && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                            style: {
                                backgroundColor: "#fef2f2",
                                color: "#dc2626",
                                fontSize: "12px",
                                padding: "10px",
                                borderRadius: "10px",
                                marginBottom: "16px",
                                border: "1px solid #fecaca"
                            },
                            children: authError
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 182,
                            columnNumber: 15
                        }, this),
                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                            onClick: handleGoogleLogin,
                            disabled: authLoading,
                            style: {
                                width: "100%",
                                backgroundColor: "#fff",
                                border: "2px solid #e2e8f0",
                                color: "#1e293b",
                                fontWeight: "700",
                                padding: "12px 16px",
                                borderRadius: "14px",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                gap: "12px",
                                cursor: "pointer",
                                fontSize: "15px",
                                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                                transition: "background-color 0.2s"
                            },
                            children: [
                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("svg", {
                                    style: {
                                        width: "20px",
                                        height: "20px"
                                    },
                                    viewBox: "0 0 24 24",
                                    children: [
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#4285F4",
                                            d: "M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 209,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#34A853",
                                            d: "M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 210,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#FBBC05",
                                            d: "M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 211,
                                            columnNumber: 17
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("path", {
                                            fill: "#EA4335",
                                            d: "M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 212,
                                            columnNumber: 17
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 208,
                                    columnNumber: 15
                                }, this),
                                authLoading ? "Logging in..." : "Continue with Google"
                            ]
                        }, void 0, true, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 187,
                            columnNumber: 13
                        }, this)
                    ]
                }, void 0, true, {
                    fileName: "[project]/src/app/(customer)/page.js",
                    lineNumber: 161,
                    columnNumber: 11
                }, this)
            }, void 0, false, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 145,
                columnNumber: 9
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                children: [
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            backgroundColor: "#fff",
                            borderRadius: "24px",
                            padding: "20px",
                            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)",
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
                                        placeholder: "Search premium products...",
                                        value: search,
                                        onChange: (e)=>setSearch(e.target.value),
                                        style: {
                                            flex: 1,
                                            padding: "16px 20px",
                                            border: "1px solid #e2e8f0",
                                            borderRadius: "16px",
                                            fontSize: "15px",
                                            backgroundColor: "#fff",
                                            outline: "none",
                                            boxSizing: "border-box"
                                        }
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 239,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        style: {
                                            backgroundColor: "#6366f1",
                                            color: "#fff",
                                            border: "none",
                                            padding: "0 28px",
                                            borderRadius: "16px",
                                            fontWeight: "700",
                                            fontSize: "15px",
                                            cursor: "pointer",
                                            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
                                        },
                                        children: "Search"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 255,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 238,
                                columnNumber: 11
                            }, this),
                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    justifyContent: "space-between",
                                    alignItems: "center",
                                    flexWrap: "wrap",
                                    gap: "12px"
                                },
                                children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
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
                                                padding: "10px 22px",
                                                borderRadius: "14px",
                                                border: selectedCategory === "All" ? "none" : "1px solid #e2e8f0",
                                                backgroundColor: selectedCategory === "All" ? "#6366f1" : "#fff",
                                                color: selectedCategory === "All" ? "#fff" : "#475569",
                                                cursor: "pointer",
                                                fontWeight: "700",
                                                fontSize: "13px",
                                                whiteSpace: "nowrap",
                                                boxShadow: selectedCategory === "All" ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none"
                                            },
                                            children: "All Products"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 275,
                                            columnNumber: 15
                                        }, this),
                                        categories.map((cat)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                onClick: ()=>{
                                                    setSelectedCategory(cat.name);
                                                    setSelectedSubCategory("All");
                                                },
                                                style: {
                                                    padding: "10px 22px",
                                                    borderRadius: "14px",
                                                    border: selectedCategory === cat.name ? "none" : "1px solid #e2e8f0",
                                                    backgroundColor: selectedCategory === cat.name ? "#6366f1" : "#fff",
                                                    color: selectedCategory === cat.name ? "#fff" : "#475569",
                                                    cursor: "pointer",
                                                    fontWeight: "700",
                                                    fontSize: "13px",
                                                    whiteSpace: "nowrap",
                                                    boxShadow: selectedCategory === cat.name ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none"
                                                },
                                                children: cat.name
                                            }, cat._id, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 297,
                                                columnNumber: 17
                                            }, this))
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 274,
                                    columnNumber: 13
                                }, this)
                            }, void 0, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 273,
                                columnNumber: 11
                            }, this),
                            subCategories.length > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                style: {
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "8px",
                                    overflowX: "auto",
                                    backgroundColor: "#f8fafc",
                                    padding: "10px 14px",
                                    borderRadius: "14px"
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
                                        lineNumber: 325,
                                        columnNumber: 15
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                        onClick: ()=>setSelectedSubCategory("All"),
                                        style: {
                                            padding: "6px 14px",
                                            borderRadius: "12px",
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
                                        lineNumber: 326,
                                        columnNumber: 15
                                    }, this),
                                    subCategories.map((sub)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                            onClick: ()=>setSelectedSubCategory(sub.name),
                                            style: {
                                                padding: "6px 14px",
                                                borderRadius: "12px",
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
                                            lineNumber: 343,
                                            columnNumber: 17
                                        }, this))
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 324,
                                columnNumber: 13
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 224,
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
                        lineNumber: 367,
                        columnNumber: 11
                    }, this) : /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))",
                            gap: "24px"
                        },
                        children: filteredProducts.length > 0 ? filteredProducts.map((p)=>{
                            // Discount Percentage Calculation
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
                                        borderRadius: "24px",
                                        overflow: "hidden",
                                        display: "flex",
                                        flexDirection: "column",
                                        justifyContent: "space-between",
                                        height: "100%",
                                        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
                                        transition: "all 0.3s ease",
                                        position: "relative"
                                    },
                                    children: [
                                        discountPercent > 0 && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: "absolute",
                                                top: "20px",
                                                left: "20px",
                                                zIndex: 2,
                                                background: "#ef4444",
                                                color: "#fff",
                                                borderRadius: "8px",
                                                padding: "4px 10px",
                                                fontSize: "11px",
                                                fontWeight: "800",
                                                boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)"
                                            },
                                            children: [
                                                discountPercent,
                                                "% OFF"
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 397,
                                            columnNumber: 25
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                position: "absolute",
                                                top: "20px",
                                                right: "20px",
                                                zIndex: 2,
                                                background: "#fff",
                                                borderRadius: "50%",
                                                width: "36px",
                                                height: "36px",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                                boxShadow: "0 4px 10px rgba(0,0,0,0.06)",
                                                cursor: "pointer"
                                            },
                                            children: "🤍"
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 403,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            children: [
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        backgroundColor: "#f8fafc",
                                                        height: "220px",
                                                        display: "flex",
                                                        alignItems: "center",
                                                        justifyContent: "center",
                                                        padding: "20px",
                                                        position: "relative"
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
                                                        lineNumber: 409,
                                                        columnNumber: 27
                                                    }, this)
                                                }, void 0, false, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 408,
                                                    columnNumber: 25
                                                }, this),
                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                    style: {
                                                        padding: "24px"
                                                    },
                                                    children: [
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                            style: {
                                                                fontSize: "12px",
                                                                color: "#6366f1",
                                                                fontWeight: "700",
                                                                textTransform: "uppercase",
                                                                letterSpacing: "0.5px"
                                                            },
                                                            children: [
                                                                p.category,
                                                                " ",
                                                                p.subCategory ? `> ${p.subCategory}` : ""
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 417,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h2", {
                                                            style: {
                                                                fontSize: "17px",
                                                                fontWeight: "800",
                                                                color: "#0f172a",
                                                                margin: "8px 0 12px 0",
                                                                lineHeight: "1.4",
                                                                display: "-webkit-box",
                                                                WebkitLineClamp: 2,
                                                                WebkitBoxOrient: "vertical",
                                                                overflow: "hidden"
                                                            },
                                                            children: p.title
                                                        }, void 0, false, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 420,
                                                            columnNumber: 27
                                                        }, this),
                                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                                            style: {
                                                                display: "flex",
                                                                alignItems: "baseline",
                                                                gap: "10px",
                                                                marginTop: "16px"
                                                            },
                                                            children: [
                                                                /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "22px",
                                                                        fontWeight: "900",
                                                                        color: "#059669"
                                                                    },
                                                                    children: [
                                                                        "₹",
                                                                        p.offerPrice
                                                                    ]
                                                                }, void 0, true, {
                                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                                    lineNumber: 425,
                                                                    columnNumber: 29
                                                                }, this),
                                                                p.originalPrice && /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("span", {
                                                                    style: {
                                                                        fontSize: "14px",
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
                                                                    lineNumber: 427,
                                                                    columnNumber: 31
                                                                }, this)
                                                            ]
                                                        }, void 0, true, {
                                                            fileName: "[project]/src/app/(customer)/page.js",
                                                            lineNumber: 424,
                                                            columnNumber: 27
                                                        }, this)
                                                    ]
                                                }, void 0, true, {
                                                    fileName: "[project]/src/app/(customer)/page.js",
                                                    lineNumber: 416,
                                                    columnNumber: 25
                                                }, this)
                                            ]
                                        }, void 0, true, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 407,
                                            columnNumber: 23
                                        }, this),
                                        /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                            style: {
                                                padding: "0 24px 24px 24px"
                                            },
                                            children: /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("button", {
                                                style: {
                                                    width: "100%",
                                                    backgroundColor: "#6366f1",
                                                    color: "#fff",
                                                    border: "none",
                                                    padding: "14px",
                                                    borderRadius: "14px",
                                                    fontWeight: "700",
                                                    fontSize: "14px",
                                                    cursor: "pointer",
                                                    boxShadow: "0 4px 14px rgba(99, 102, 241, 0.3)",
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    gap: "8px"
                                                },
                                                children: "View Details →"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 436,
                                                columnNumber: 25
                                            }, this)
                                        }, void 0, false, {
                                            fileName: "[project]/src/app/(customer)/page.js",
                                            lineNumber: 435,
                                            columnNumber: 23
                                        }, this)
                                    ]
                                }, void 0, true, {
                                    fileName: "[project]/src/app/(customer)/page.js",
                                    lineNumber: 380,
                                    columnNumber: 21
                                }, this)
                            }, p._id, false, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 379,
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
                            children: "Is category me koi product nahi mila!"
                        }, void 0, false, {
                            fileName: "[project]/src/app/(customer)/page.js",
                            lineNumber: 462,
                            columnNumber: 15
                        }, this)
                    }, void 0, false, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 369,
                        columnNumber: 11
                    }, this),
                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                        style: {
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
                            gap: "20px",
                            marginTop: "60px",
                            backgroundColor: "#fff",
                            padding: "30px",
                            borderRadius: "24px",
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
                                            padding: "14px",
                                            borderRadius: "16px",
                                            fontSize: "20px"
                                        },
                                        children: "🛡️"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 484,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Secure Shopping"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 486,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "12px",
                                                    color: "#64748b"
                                                },
                                                children: "100% secure payments"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 487,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 485,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 483,
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
                                            padding: "14px",
                                            borderRadius: "16px",
                                            fontSize: "20px"
                                        },
                                        children: "🚚"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 492,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Fast Delivery"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 494,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "12px",
                                                    color: "#64748b"
                                                },
                                                children: "Quick delivery at your door"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 495,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 493,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 491,
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
                                            padding: "14px",
                                            borderRadius: "16px",
                                            fontSize: "20px"
                                        },
                                        children: "⭐"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 500,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "Best Quality"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 502,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "12px",
                                                    color: "#64748b"
                                                },
                                                children: "Genuine & trusted products"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 503,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 501,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 499,
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
                                            padding: "14px",
                                            borderRadius: "16px",
                                            fontSize: "20px"
                                        },
                                        children: "🎧"
                                    }, void 0, false, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 508,
                                        columnNumber: 13
                                    }, this),
                                    /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                                        children: [
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("h4", {
                                                style: {
                                                    margin: "0 0 4px 0",
                                                    fontSize: "14px",
                                                    fontWeight: "800",
                                                    color: "#0f172a"
                                                },
                                                children: "24/7 Support"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 510,
                                                columnNumber: 15
                                            }, this),
                                            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$compiled$2f$react$2f$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__["jsxDEV"])("p", {
                                                style: {
                                                    margin: 0,
                                                    fontSize: "12px",
                                                    color: "#64748b"
                                                },
                                                children: "We're here to help"
                                            }, void 0, false, {
                                                fileName: "[project]/src/app/(customer)/page.js",
                                                lineNumber: 511,
                                                columnNumber: 15
                                            }, this)
                                        ]
                                    }, void 0, true, {
                                        fileName: "[project]/src/app/(customer)/page.js",
                                        lineNumber: 509,
                                        columnNumber: 13
                                    }, this)
                                ]
                            }, void 0, true, {
                                fileName: "[project]/src/app/(customer)/page.js",
                                lineNumber: 507,
                                columnNumber: 11
                            }, this)
                        ]
                    }, void 0, true, {
                        fileName: "[project]/src/app/(customer)/page.js",
                        lineNumber: 470,
                        columnNumber: 9
                    }, this)
                ]
            }, void 0, true, {
                fileName: "[project]/src/app/(customer)/page.js",
                lineNumber: 221,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/app/(customer)/page.js",
        lineNumber: 141,
        columnNumber: 5
    }, this);
}
_s(HomePage, "RM003wwZMbRnQWog5rqc2PAVh6o=");
_c = HomePage;
var _c;
__turbopack_context__.k.register(_c, "HomePage");
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
"[project]/src/lib/firebase.js [app-client] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "auth",
    ()=>auth
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/app/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$firebase$2f$auth$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__ = __turbopack_context__.i("[project]/node_modules/firebase/auth/dist/esm/index.esm.js [app-client] (ecmascript) <locals>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__getAuth$3e$__ = __turbopack_context__.i("[project]/node_modules/@firebase/auth/dist/esm/index-CvXU3_1x.js [app-client] (ecmascript) <export D as getAuth>");
;
;
const firebaseConfig = {
    apiKey: "AIzaSyAhdnLaR9p2ObTHz9gBilH94qrT2tNDzsk",
    authDomain: "guru-723c2.firebaseapp.com",
    projectId: "guru-723c2",
    storageBucket: "guru-723c2.firebasestorage.app",
    messagingSenderId: "29654072562",
    appId: "1:29654072562:web:4c1ed12c4d022950eaa46b",
    measurementId: "G-LX2N3HL804"
};
// Next.js (SSR) safety check for Firebase initialization
const app = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApps"])().length > 0 ? (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["getApp"])() : (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$app$2f$dist$2f$esm$2f$index$2e$esm$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$locals$3e$__["initializeApp"])(firebaseConfig);
const auth = (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f40$firebase$2f$auth$2f$dist$2f$esm$2f$index$2d$CvXU3_1x$2e$js__$5b$app$2d$client$5d$__$28$ecmascript$29$__$3c$export__D__as__getAuth$3e$__["getAuth"])(app);
if (typeof globalThis.$RefreshHelpers$ === 'object' && globalThis.$RefreshHelpers !== null) {
    __turbopack_context__.k.registerExports(__turbopack_context__.m, globalThis.$RefreshHelpers$);
}
}),
]);

//# sourceMappingURL=src_19x6q2w._.js.map