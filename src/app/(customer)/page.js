"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

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
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState("");

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

  const handleGoogleLogin = async () => {
    setAuthError("");
    setAuthLoading(true);
    const provider = new GoogleAuthProvider();

    try {
      const result = await signInWithPopup(auth, provider);
      const loggedUser = {
        name: result.user.displayName,
        email: result.user.email,
        photo: result.user.photoURL,
      };

      setUser(loggedUser);
      localStorage.setItem("customer_user", JSON.stringify(loggedUser));
      window.location.reload();
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError("Login fail ho gaya! Firebase Console me Google Provider check karein.");
    } finally {
      setAuthLoading(false);
    }
  };

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

  if (isCheckingAuth) {
    return (
      <div style={{ padding: "60px", textAlign: "center", fontSize: "16px", fontWeight: "600", color: "#4b5563" }}>
        Loading ZentoBazaar...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}>
      
      {/* MANDATORY LOGIN POPUP */}
      {!user && (
        <div
          style={{
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
            padding: "16px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "24px",
              padding: "32px 24px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid #f1f5f9",
            }}
          >
            <div style={{ fontSize: "44px", marginBottom: "14px" }}>🛍️</div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px 0" }}>
              Welcome to ZENTROBAZAAR
            </h2>
            <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>
              Shopping start karne ke liye Google account se login karein.
            </p>

            {authError && (
              <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "12px", padding: "10px", borderRadius: "10px", marginBottom: "16px", border: "1px solid #fecaca" }}>
                {authError}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              style={{
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
                transition: "background-color 0.2s",
              }}
            >
              <svg style={{ width: "20px", height: "20px" }} viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              {authLoading ? "Logging in..." : "Continue with Google"}
            </button>
          </div>
        </div>
      )}

      {/* Main Container */}
      <div>
        
        {/* Search & Filter Bar Box */}
        <div 
          style={{ 
            backgroundColor: "#fff", 
            borderRadius: "24px", 
            padding: "20px", 
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.05)", 
            border: "1px solid #f1f5f9",
            marginBottom: "30px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          {/* Search Bar with Search Button inside */}
          <div style={{ display: "flex", gap: "12px" }}>
            <input
              type="text"
              placeholder="Search premium products..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{
                flex: 1,
                padding: "16px 20px",
                border: "1px solid #e2e8f0",
                borderRadius: "16px",
                fontSize: "15px",
                backgroundColor: "#fff",
                outline: "none",
                boxSizing: "border-box",
              }}
            />
            <button
              style={{
                backgroundColor: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "0 28px",
                borderRadius: "16px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)"
              }}
            >
              Search
            </button>
          </div>

          {/* Categories Pill Buttons */}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "12px" }}>
            <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "4px" }}>
              <button
                onClick={() => {
                  setSelectedCategory("All");
                  setSelectedSubCategory("All");
                }}
                style={{
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
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Sub-Categories Filter */}
          {subCategories.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "14px" }}>
              <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", whiteSpace: "nowrap" }}>Sub:</span>
              <button
                onClick={() => setSelectedSubCategory("All")}
                style={{
                  padding: "6px 14px",
                  borderRadius: "12px",
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
                    padding: "6px 14px",
                    borderRadius: "12px",
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

        {/* Products Grid */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: "15px", fontWeight: "600" }}>Loading Products...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(340px, 1fr))", gap: "24px" }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => {
                // Discount Percentage Calculation
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
                        borderRadius: "24px",
                        overflow: "hidden",
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "space-between",
                        height: "100%",
                        boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
                        transition: "all 0.3s ease",
                        position: "relative",
                      }}
                    >
                      {/* Discount Badge */}
                      {discountPercent > 0 && (
                        <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2, background: "#ef4444", color: "#fff", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "800", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)" }}>
                          {discountPercent}% OFF
                        </div>
                      )}

                      {/* Wishlist Heart Icon */}
                      <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2, background: "#fff", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                        🤍
                      </div>

                      <div>
                        <div style={{ backgroundColor: "#f8fafc", height: "220px", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px", position: "relative" }}>
                          <img
                            src={p.images && p.images.length > 0 ? p.images[0] : p.imageUrl || "https://via.placeholder.com/150"}
                            alt={p.title}
                            style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                          />
                        </div>

                        <div style={{ padding: "24px" }}>
                          <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                            {p.category} {p.subCategory ? `> ${p.subCategory}` : ""}
                          </span>
                          <h2 style={{ fontSize: "17px", fontWeight: "800", color: "#0f172a", margin: "8px 0 12px 0", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                            {p.title}
                          </h2>
                          
                          <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "16px" }}>
                            <span style={{ fontSize: "22px", fontWeight: "900", color: "#059669" }}>₹{p.offerPrice}</span>
                            {p.originalPrice && (
                              <span style={{ fontSize: "14px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "600" }}>
                                ₹{p.originalPrice}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>

                      <div style={{ padding: "0 24px 24px 24px" }}>
                        <button
                          style={{
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
                          }}
                        >
                          View Details →
                        </button>
                      </div>
                    </div>
                  </Link>
                );
              })
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#64748b", fontSize: "15px" }}>
                Is category me koi product nahi mila!
              </div>
            )}
          </div>
        )}

        {/* Trust Badges Footer */}
        <div 
          style={{ 
            display: "grid", 
            gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", 
            gap: "20px", 
            marginTop: "60px",
            backgroundColor: "#fff",
            padding: "30px",
            borderRadius: "24px",
            boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)",
            border: "1px solid #f1f5f9"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#eef2ff", padding: "14px", borderRadius: "16px", fontSize: "20px" }}>🛡️</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Secure Shopping</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>100% secure payments</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#f0fdf4", padding: "14px", borderRadius: "16px", fontSize: "20px" }}>🚚</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Fast Delivery</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Quick delivery at your door</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#fff7ed", padding: "14px", borderRadius: "16px", fontSize: "20px" }}>⭐</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>Best Quality</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>Genuine & trusted products</p>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ background: "#f0f9ff", padding: "14px", borderRadius: "16px", fontSize: "20px" }}>🎧</div>
            <div>
              <h4 style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "800", color: "#0f172a" }}>24/7 Support</h4>
              <p style={{ margin: 0, fontSize: "12px", color: "#64748b" }}>We're here to help</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}