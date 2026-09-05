// src/app/(customer)/page.js
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth, messaging } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { getToken } from "firebase/messaging";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  // User & Auth State
  const [user, setUser] = useState(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [shareCopiedId, setShareCopiedId] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const queryParams = new URLSearchParams(window.location.search);
      const urlSearch = queryParams.get("search");
      if (urlSearch) {
        setSearch(urlSearch);
      }
    }
  }, []);

  useEffect(() => {
    try {
      const savedUser = localStorage.getItem("customer_user");
      if (savedUser) {
        setUser(JSON.parse(savedUser));
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsCheckingAuth(false);
    }
  }, []);

  // Request Notification Permission and Save Token
  useEffect(() => {
    const requestNotificationToken = async () => {
      if (typeof window !== "undefined" && "Notification" in window && messaging) {
        try {
          const permission = await Notification.requestPermission();
          if (permission === "granted") {
            // NOTE: Replace with your actual Firebase Cloud Messaging VAPID public key if generated in console
            const token = await getToken(messaging, {
              vapidKey: "YOUR_PUBLIC_VAPID_KEY_HERE" 
            });
            if (token) {
              console.log("FCM Device Token:", token);
              // Send token to backend database if user is logged in or anonymously
              await fetch("/api/save-token", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ token, email: user?.email || "guest" })
              });
            }
          }
        } catch (error) {
          console.error("Error saving notification token:", error);
        }
      }
    };

    if (!isCheckingAuth) {
      requestNotificationToken();
    }
  }, [isCheckingAuth, user]);

  useEffect(() => {
    const fetchData = async () => {
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
          const mainCats = catData.data.filter(c => c.type === "category");
          setCategories(mainCats);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const [allCategoriesList, setAllCategoriesList] = useState([]);
  useEffect(() => {
    fetch("/api/categories")
      .then(res => res.json())
      .then(data => {
        if(data.success) setAllCategoriesList(data.data);
      }).catch(err => console.error(err));
  }, []);

  const subCategories = allCategoriesList.filter(
    c => c.type === "subcategory" && c.parentCategory === selectedCategory
  );

  useEffect(() => {
    let result = products;

    if (search.trim() !== "") {
      result = result.filter((p) =>
        p.title.toLowerCase().includes(search.toLowerCase())
      );
    }

    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    if (selectedSubCategory !== "All") {
      result = result.filter((p) => p.subCategory === selectedSubCategory);
    }

    setFilteredProducts(result);
  }, [search, selectedCategory, selectedSubCategory, products]);

  // Google Login Handler
  const handleGoogleLogin = async () => {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
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

  const handleQuickShare = async (e, p) => {
    e.preventDefault();
    e.stopPropagation();
    const productUrl = `${window.location.origin}/product/${p._id}`;
    const shareData = {
      title: p.title,
      text: `Check out this amazing product: ${p.title}`,
      url: productUrl,
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
      setTimeout(() => setShareCopiedId(null), 2000);
    }
  };

  if (isCheckingAuth) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontSize: "16px", fontWeight: "600", color: "#4b5563" }}>
        Loading ZentoBazaar...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh", paddingBottom: "60px", position: "relative" }}>
      
      {/* Agar user logged-in nahi hai toh niche sundar Pop-up/Banner dikhega */}
      {!user && (
        <div style={{
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
        }}>
          <div>
            <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Welcome to ZENTROBAZAAR! 👋</h4>
            <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Sign in quickly with Google to manage your orders.</p>
          </div>
          <button
            onClick={handleGoogleLogin}
            style={{
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
            }}
          >
            Login with Google
          </button>
        </div>
      )}

      {/* Hero Section */}
      <div style={{ maxWidth: "1280px", margin: "20px auto", padding: "0 20px" }}>
        <div style={{ 
          background: "linear-gradient(135deg, #f0fdf4 0%, #e0f2fe 100%)", 
          borderRadius: "28px", 
          padding: "50px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "30px",
          border: "1px solid #e2e8f0"
        }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <span style={{ backgroundColor: "#dbeafe", color: "#1e40af", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "800", textTransform: "uppercase" }}>
              Welcome to ZENTROBAZAAR
            </span>
            <h1 style={{ fontSize: "42px", fontWeight: "900", color: "#0f172a", margin: "16px 0", lineHeight: "1.2" }}>
              Everything You Need, <br />
              <span style={{ color: "#6366f1" }}>All in One Place.</span>
            </h1>
            <p style={{ fontSize: "15px", color: "#475569", marginBottom: "24px", lineHeight: "1.6" }}>
              Discover top quality products at best prices. Fast delivery, secure payments & hassle-free returns.
            </p>
            <button 
              onClick={() => window.scrollTo({ top: 600, behavior: "smooth" })}
              style={{
                backgroundColor: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "14px 28px",
                borderRadius: "14px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 14px rgba(99, 102, 241, 0.4)"
              }}
            >
              Shop Now →
            </button>
          </div>
          <div style={{ flex: "1", textAlign: "center", minWidth: "280px" }}>
            <div style={{ fontSize: "80px" }}>🛍️✨</div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div style={{ maxWidth: "1280px", margin: "0 auto", padding: "0 20px" }}>
        
        {/* Trust Badges Bar */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
            gap: "20px", 
            margin: "30px 0",
            backgroundColor: "#fff",
            padding: "24px",
            borderRadius: "20px",
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#eef2ff", padding: "12px", borderRadius: "14px", fontSize: "18px" }}>🛡️</div>
            <div>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>100% Secure</h4>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Your payments are safe</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#f0fdf4", padding: "12px", borderRadius: "14px", fontSize: "18px" }}>🚚</div>
            <div>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>Fast Delivery</h4>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Delivered quickly</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#fff7ed", padding: "12px", borderRadius: "14px", fontSize: "18px" }}>📦</div>
            <div>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>Easy Returns</h4>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>7 days return policy</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#f0f9ff", padding: "12px", borderRadius: "14px", fontSize: "18px" }}>🎧</div>
            <div>
              <h4 style={{ margin: "0 0 2px 0", fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>24/7 Support</h4>
              <p style={{ margin: 0, fontSize: "11px", color: "#64748b" }}>Dedicated help</p>
            </div>
          </div>
        </div>

        {/* Shop By Categories Section */}
        <div style={{ margin: "40px 0 20px 0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Shop By Categories</h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(160px, 1fr))", gap: "16px" }}>
            {categories.map((cat) => {
              const catImg = (cat.image && cat.image.trim() !== "") ? cat.image : cat.imageUrl;

              return (
                <div
                  key={cat._id}
                  onClick={() => {
                    setSelectedCategory(cat.name);
                    setSelectedSubCategory("All");
                    window.scrollTo({ top: 600, behavior: "smooth" });
                  }}
                  style={{
                    backgroundColor: "#fff",
                    border: selectedCategory === cat.name ? "2px solid #6366f1" : "1px solid #f1f5f9",
                    borderRadius: "20px",
                    padding: "20px",
                    textAlign: "center",
                    cursor: "pointer",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
                    transition: "all 0.2s ease"
                  }}
                >
                  <div style={{ width: "70px", height: "70px", margin: "0 auto 12px auto", borderRadius: "50%", backgroundColor: "#f8fafc", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0" }}>
                    {catImg ? (
                      <img 
                        src={catImg} 
                        alt={cat.name} 
                        style={{ width: "100%", height: "100%", objectFit: "cover" }} 
                        onError={(e) => {
                          e.target.style.display = 'none';
                        }}
                      />
                    ) : (
                      <span style={{ fontSize: "24px" }}>🏷️</span>
                    )}
                  </div>
                  <div style={{ fontSize: "14px", fontWeight: "700", color: "#1e293b" }}>{cat.name}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Deals of the Day Banner */}
        <div style={{ 
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
        }}>
          <div>
            <span style={{ backgroundColor: "rgba(255,255,255,0.2)", padding: "4px 12px", borderRadius: "20px", fontSize: "11px", fontWeight: "700", textTransform: "uppercase" }}>
              Limited Time Offer
            </span>
            <h2 style={{ fontSize: "26px", fontWeight: "900", margin: "10px 0 6px 0" }}>Deals of the Day</h2>
            <p style={{ margin: 0, fontSize: "14px", opacity: 0.9 }}>Huge discounts on top products. Don't miss out!</p>
          </div>
          <button 
            onClick={() => {
              setSelectedCategory("All");
              setSelectedSubCategory("All");
              window.scrollTo({ top: 600, behavior: "smooth" });
            }}
            style={{
              backgroundColor: "#fff",
              color: "#4f46e5",
              border: "none",
              padding: "12px 24px",
              borderRadius: "14px",
              fontWeight: "800",
              fontSize: "14px",
              cursor: "pointer",
              boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
            }}
          >
            Explore Deals →
          </button>
        </div>

        {/* Search & Filter Bar */}
        <div 
          style={{ 
            backgroundColor: "#fff", 
            borderRadius: "20px", 
            padding: "20px", 
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)", 
            border: "1px solid #f1f5f9",
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              placeholder="Search products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "14px 18px",
                border: "1px solid #e2e8f0",
                borderRadius: "14px",
                fontSize: "14px",
                backgroundColor: "#fff",
                outline: "none",
              }}
            />
            <button
              style={{
                backgroundColor: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "0 24px",
                borderRadius: "14px",
                fontWeight: "700",
                fontSize: "14px",
                cursor: "pointer",
              }}
            >
              Search
            </button>
          </div>

          <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedSubCategory("All");
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "12px",
                border: selectedCategory === "All" ? "none" : "1px solid #e2e8f0",
                backgroundColor: selectedCategory === "All" ? "#6366f1" : "#fff",
                color: selectedCategory === "All" ? "#fff" : "#475569",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              All Products
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => {
                  setSelectedCategory(cat.name);
                  setSelectedSubCategory("All");
                }}
                style={{
                  padding: "8px 18px",
                  borderRadius: "12px",
                  border: selectedCategory === cat.name ? "none" : "1px solid #e2e8f0",
                  backgroundColor: selectedCategory === cat.name ? "#6366f1" : "#fff",
                  color: selectedCategory === cat.name ? "#fff" : "#475569",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {subCategories.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", backgroundColor: "#f8fafc", padding: "8px 12px", borderRadius: "12px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", whiteSpace: "nowrap" }}>Sub:</span>
              <button
                onClick={() => setSelectedSubCategory("All")}
                style={{
                  padding: "6px 12px",
                  borderRadius: "10px",
                  border: "none",
                  backgroundColor: selectedSubCategory === "All" ? "#3b82f6" : "#e2e8f0",
                  color: selectedSubCategory === "All" ? "#fff" : "#334155",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "12px",
                  whiteSpace: "nowrap",
                }}
              >
                All
              </button>
              {subCategories.map((sub) => (
                <button
                  key={sub._id}
                  onClick={() => setSelectedSubCategory(sub.name)}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "10px",
                    border: "none",
                    backgroundColor: selectedSubCategory === sub.name ? "#3b82f6" : "#e2e8f0",
                    color: selectedSubCategory === sub.name ? "#fff" : "#334155",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "12px",
                    whiteSpace: "nowrap",
                  }}
                >
                  {sub.name}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Best Sellers Section / Products Grid */}
        <div style={{ marginBottom: "20px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "20px" }}>Best Sellers</h2>
        </div>

        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: "15px", fontWeight: "600" }}>Loading Products...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "24px" }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                let discountPercent = 0;
                if (p.originalPrice && p.originalPrice > p.offerPrice) {
                  discountPercent = Math.round(((p.originalPrice - p.offerPrice) / p.originalPrice) * 100);
                }

                return (
                  <Link key={p._id} href={`/product/${p._id}`} style={{ textDecoration: "none" }}>
                    <div
                      style={{
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
                        position: "relative",
                      }}
                    >
                      {discountPercent > 0 && (
                        <div style={{ position: "absolute", top: "16px", left: "16px", zIndex: 2, background: "#ef4444", color: "#fff", borderRadius: "6px", padding: "3px 8px", fontSize: "11px", fontWeight: "800" }}>
                          {discountPercent}% OFF
                        </div>
                      )}

                      {/* Quick Share Button */}
                      <div 
                        onClick={(e) => handleQuickShare(e, p)}
                        style={{ 
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
                        }}
                        title={shareCopiedId === p._id ? "Link Copied!" : "Share Product"}
                      >
                        🔗
                      </div>

                      <div>
                        <div style={{ backgroundColor: "#f8fafc", height: "200px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
                          <img
                            src={p.images && p.images.length > 0 ? p.images[0] : p.imageUrl || "https://via.placeholder.com/150"}
                            alt={p.title}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                          />
                        </div>

                        <div style={{ padding: "20px" }}>
                          <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: "700", textTransform: "uppercase" }}>
                            {p.category}
                          </span>
                          <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "6px 0 10px 0", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.title}
                          </h3>
                          
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                            <span style={{ fontSize: "18px", fontWeight: "900", color: "#059669" }}>₹{p.offerPrice}</span>
                            {p.originalPrice && (
                              <span style={{ fontSize: "13px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "600" }}>
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: "0 20px 20px 20px" }}>
                        <button
                          style={{
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
                          }}
                        >
                          View details
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#64748b", fontSize: "15px" }}>
                No products found!
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}