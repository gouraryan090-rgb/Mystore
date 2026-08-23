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
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", backgroundColor: "#f9fafb", minHeight: "100vh", paddingBottom: "40px" }}>
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
            backdropFilter: "blur(5px)",
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
              maxWidth: "380px",
              borderRadius: "20px",
              padding: "28px 20px",
              textAlign: "center",
              boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛍️</div>
            <h2 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", margin: "0 0 6px 0" }}>
              Welcome to ZENTROBAZAAR
            </h2>
            <p style={{ fontSize: "13px", color: "#6b7280", marginBottom: "20px" }}>
              Shopping start karne ke liye Google account se login karein.
            </p>

            {authError && (
              <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "12px", padding: "8px", borderRadius: "8px", marginBottom: "14px", border: "1px solid #fecaca" }}>
                {authError}
              </div>
            )}

            <button
              onClick={handleGoogleLogin}
              disabled={authLoading}
              style={{
                width: "100%",
                backgroundColor: "#fff",
                border: "2px solid #e5e7eb",
                color: "#1f2937",
                fontWeight: "bold",
                padding: "10px 14px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "10px",
                cursor: "pointer",
                fontSize: "14px",
                boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
              }}
            >
              <svg style={{ width: "18px", height: "18px" }} viewBox="0 0 24 24">
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
      <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "16px" }}>
        
        <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
          <input
            type="text"
            placeholder="Search premium products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: "14px 16px",
              border: "1px solid #d1d5db",
              borderRadius: "14px",
              fontSize: "15px",
              backgroundColor: "#fff",
              outline: "none",
              boxSizing: "border-box",
              boxShadow: "0 1px 2px rgba(0,0,0,0.05)"
            }}
          />

          {/* Main Categories Horizontal Scroll */}
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px", WebkitOverflowScrolling: "touch" }}>
            <button
              onClick={() => {
                setSelectedCategory("All");
                setSelectedSubCategory("All");
              }}
              style={{
                padding: "8px 18px",
                borderRadius: "20px",
                border: selectedCategory === "All" ? "none" : "1px solid #e5e7eb",
                backgroundColor: selectedCategory === "All" ? "#111827" : "#fff",
                color: selectedCategory === "All" ? "#fff" : "#4b5563",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              All
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
                  borderRadius: "20px",
                  border: selectedCategory === cat.name ? "none" : "1px solid #e5e7eb",
                  backgroundColor: selectedCategory === cat.name ? "#111827" : "#fff",
                  color: selectedCategory === cat.name ? "#fff" : "#4b5563",
                  cursor: "pointer",
                  fontWeight: "600",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {/* Sub-Categories Filter */}
          {subCategories.length > 0 && (
            <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", paddingBottom: "4px", backgroundColor: "#f3f4f6", padding: "8px 12px", borderRadius: "10px", WebkitOverflowScrolling: "touch" }}>
              <span style={{ fontSize: "11px", fontWeight: "700", color: "#4b5563", whiteSpace: "nowrap" }}>Sub:</span>
              <button
                onClick={() => setSelectedSubCategory("All")}
                style={{
                  padding: "5px 12px",
                  borderRadius: "16px",
                  border: "none",
                  backgroundColor: selectedSubCategory === "All" ? "#2563eb" : "#e5e7eb",
                  color: selectedSubCategory === "All" ? "#fff" : "#374151",
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
                    padding: "5px 12px",
                    borderRadius: "16px",
                    border: "none",
                    backgroundColor: selectedSubCategory === sub.name ? "#2563eb" : "#e5e7eb",
                    color: selectedSubCategory === sub.name ? "#fff" : "#374151",
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

        {/* Products Grid - Responsive for both mobile and laptop */}
        {loading ? (
          <div style={{ textAlign: "center", padding: "40px", color: "#6b7280", fontSize: "14px" }}>Loading Products...</div>
        ) : (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px" }}>
            {filteredProducts.length > 0 ? (
              filteredProducts.map((p) => (
                <Link key={p._id} href={`/product/${p._id}`} style={{ textDecoration: "none" }}>
                  <div
                    style={{
                      backgroundColor: "#fff",
                      border: "1px solid #e5e7eb",
                      borderRadius: "14px",
                      overflow: "hidden",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      height: "100%",
                      boxShadow: "0 2px 4px rgba(0,0,0,0.02)",
                      transition: "transform 0.2s ease",
                    }}
                  >
                    <div>
                      <div style={{ backgroundColor: "#f3f4f6", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", padding: "10px", position: "relative" }}>
                        <img
                          src={p.images && p.images.length > 0 ? p.images[0] : p.imageUrl || "https://via.placeholder.com/150"}
                          alt={p.title}
                          style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                        />
                      </div>

                      <div style={{ padding: "16px" }}>
                        <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "700", textTransform: "uppercase" }}>
                          {p.category} {p.subCategory ? `> ${p.subCategory}` : ""}
                        </span>
                        <h2 style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "6px 0 10px 0", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                          {p.title}
                        </h2>
                        <div style={{ display: "flex", alignItems: "baseline", gap: "8px" }}>
                          <span style={{ fontSize: "17px", fontWeight: "800", color: "#059669" }}>₹{p.offerPrice}</span>
                          {p.originalPrice && (
                            <span style={{ fontSize: "12px", color: "#9ca3af", textDecoration: "line-through", fontWeight: "500" }}>
                              ₹{p.originalPrice}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ padding: "0 16px 16px 16px" }}>
                      <button
                        style={{
                          width: "100%",
                          backgroundColor: "#111827",
                          color: "#fff",
                          border: "none",
                          padding: "10px",
                          borderRadius: "10px",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                        }}
                      >
                        View Details
                      </button>
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#6b7280", fontSize: "14px" }}>
                Is category me koi product nahi mila!
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}