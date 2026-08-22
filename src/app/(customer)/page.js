"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { auth } from "@/lib/firebase";
import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";

export default function HomePage() {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
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
      window.location.reload(); // Refresh to update layout state
    } catch (error) {
      console.error("Login Error:", error);
      setAuthError("Login fail ho gaya! Firebase Console me Google Provider check karein.");
    } finally {
      setAuthLoading(false);
    }
  };

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const res = await fetch("/api/products");
        const data = await res.json();
        if (data.success) {
          setProducts(data.data);
          setFilteredProducts(data.data);
        }
      } catch (err) {
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

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

    setFilteredProducts(result);
  }, [search, selectedCategory, products]);

  const categories = [
    "All",
    ...new Set(products.map((p) => p.category).filter(Boolean)),
  ];

  if (isCheckingAuth) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontWeight: "bold" }}>
        Checking Login Status...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "sans-serif" }}>
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
            zIndex: 99999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            padding: "20px",
          }}
        >
          <div
            style={{
              backgroundColor: "#fff",
              width: "100%",
              maxWidth: "400px",
              borderRadius: "16px",
              padding: "32px",
              textAlign: "center",
              boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)",
              border: "1px solid #e5e7eb",
            }}
          >
            <div style={{ fontSize: "40px", marginBottom: "12px" }}>🛍️</div>
            <h2 style={{ fontSize: "24px", fontWeight: "800", color: "#111827", margin: "0 0 8px 0" }}>
              Welcome to My Store
            </h2>
            <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
              Shopping start karne ke liye Google account se login karein.
            </p>

            {authError && (
              <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", fontSize: "12px", padding: "10px", borderRadius: "8px", marginBottom: "16px", border: "1px solid #fecaca" }}>
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
                padding: "12px 16px",
                borderRadius: "12px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: "12px",
                cursor: "pointer",
                fontSize: "15px",
              }}
            >
              <svg style={{ width: "20px", height: "20px", minWidth: "20px", maxWidth: "20px" }} viewBox="0 0 24 24">
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

      {/* Search & Categories */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
        <input
          type="text"
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ flex: 1, padding: "12px", border: "1px solid #d1d5db", borderRadius: "8px", fontSize: "14px" }}
        />

        <div style={{ display: "flex", gap: "8px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              style={{
                padding: "10px 16px",
                borderRadius: "8px",
                border: "1px solid #d1d5db",
                backgroundColor: selectedCategory === cat ? "#2563eb" : "#fff",
                color: selectedCategory === cat ? "#fff" : "#374151",
                cursor: "pointer",
                fontWeight: "500",
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Products Grid */}
      {loading ? (
        <div style={{ textAlign: "center", padding: "40px", color: "#6b7280" }}>Loading Products...</div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: "20px" }}>
          {filteredProducts.length > 0 ? (
            filteredProducts.map((p) => (
              <Link key={p._id} href={`/product/${p._id}`} style={{ textDecoration: "none" }}>
                <div style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "12px", overflow: "hidden", display: "flex", flexDirection: "column", justifyContent: "space-between", height: "100%" }}>
                  <div>
                    <img
                      src={p.images && p.images.length > 0 ? p.images[0] : p.imageUrl || "https://via.placeholder.com/150"}
                      alt={p.title}
                      style={{ width: "100%", height: "180px", objectFit: "cover" }}
                    />
                    <div style={{ padding: "16px" }}>
                      <span style={{ fontSize: "11px", color: "#2563eb", fontWeight: "bold", textTransform: "uppercase" }}>{p.category}</span>
                      <h2 style={{ fontSize: "16px", fontWeight: "bold", color: "#1f2937", margin: "4px 0 12px 0" }}>{p.title}</h2>
                      <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                        <span style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a" }}>₹{p.offerPrice}</span>
                        {p.originalPrice && <span style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through" }}>₹{p.originalPrice}</span>}
                      </div>
                    </div>
                  </div>
                  <div style={{ padding: "0 16px 16px 16px" }}>
                    <button style={{ width: "100%", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "10px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer" }}>
                      View Details
                    </button>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "40px", color: "#6b7280" }}>
              Koi product nahi mila!
            </div>
          )}
        </div>
      )}
    </div>
  );
}