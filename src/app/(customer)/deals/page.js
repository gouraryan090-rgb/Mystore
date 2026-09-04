
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function DealsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  
  // Filters state
  const [selectedDiscount, setSelectedDiscount] = useState("All");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [loading, setLoading] = useState(true);

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

    // Background refresh every 2 seconds
    const interval = setInterval(async () => {
      try {
        const prodRes = await fetch("/api/products");
        const prodData = await prodRes.json();
        if (prodData.success) {
          setProducts(prodData.data);
        }
      } catch (err) {
        console.error("Background sync error:", err);
      }
    }, 2000);

    return () => clearInterval(interval);
  }, []);

  // Corrected Filter logic for "Up to X% off" ranges
  useEffect(() => {
    let result = products;

    if (selectedDiscount !== "All") {
      const upperLimit = parseInt(selectedDiscount); // e.g., 10, 20, 30...
      const lowerLimit = upperLimit - 10; // e.g., for 20, lower limit is 10 (so range is 11-20 or 0-20)

      result = result.filter((p) => {
        if (!p.originalPrice || p.originalPrice <= p.offerPrice) return false;
        const disc = Math.round(((p.originalPrice - p.offerPrice) / p.originalPrice) * 100);
        
        if (upperLimit === 10) {
          return disc >= 0 && disc <= 10;
        } else {
          return disc > lowerLimit && disc <= upperLimit;
        }
      });
    }

    // Category Filter Logic
    if (selectedCategory !== "All") {
      result = result.filter((p) => p.category === selectedCategory);
    }

    setFilteredProducts(result);
  }, [selectedDiscount, selectedCategory, products]);

  // Discount options array from 10% to 90%
  const discountOptions = [10, 20, 30, 40, 50, 60, 70, 80, 90];

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "60px", color: "#64748b", fontSize: "16px", fontWeight: "600" }}>
        Loading Hot Deals...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
          🔥 Hot Deals & Discounts
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Select your preferred discount and category to grab the best offers!
        </p>
      </div>

      {/* Filters Box */}
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
        {/* Discount Filter Options (10% to 90%) */}
        <div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Filter by Discount:
          </span>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            <button
              onClick={() => setSelectedDiscount("All")}
              style={{
                padding: "8px 16px",
                borderRadius: "12px",
                border: selectedDiscount === "All" ? "none" : "1px solid #e2e8f0",
                backgroundColor: selectedDiscount === "All" ? "#ef4444" : "#fff",
                color: selectedDiscount === "All" ? "#fff" : "#475569",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
                whiteSpace: "nowrap",
                boxShadow: selectedDiscount === "All" ? "0 4px 12px rgba(239, 68, 68, 0.25)" : "none"
              }}
            >
              All Discounts
            </button>

            {discountOptions.map((disc) => (
              <button
                key={disc}
                onClick={() => setSelectedDiscount(`${disc}`)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "12px",
                  border: selectedDiscount === `${disc}` ? "none" : "1px solid #e2e8f0",
                  backgroundColor: selectedDiscount === `${disc}` ? "#ef4444" : "#fff",
                  color: selectedDiscount === `${disc}` ? "#fff" : "#475569",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  boxShadow: selectedDiscount === `${disc}` ? "0 4px 12px rgba(239, 68, 68, 0.25)" : "none"
                }}
              >
                Up to {disc}% off
              </button>
            ))}
          </div>
        </div>

        {/* Categories Options */}
        <div>
          <span style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "8px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            Filter by Category:
          </span>
          <div style={{ display: "flex", gap: "8px", overflowX: "auto", paddingBottom: "4px" }}>
            <button
              onClick={() => setSelectedCategory("All")}
              style={{
                padding: "8px 16px",
                borderRadius: "12px",
                border: selectedCategory === "All" ? "none" : "1px solid #e2e8f0",
                backgroundColor: selectedCategory === "All" ? "#6366f1" : "#fff",
                color: selectedCategory === "All" ? "#fff" : "#475569",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
                whiteSpace: "nowrap",
                boxShadow: selectedCategory === "All" ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none"
              }}
            >
              All Categories
            </button>

            {categories.map((cat) => (
              <button
                key={cat._id}
                onClick={() => setSelectedCategory(cat.name)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "12px",
                  border: selectedCategory === cat.name ? "none" : "1px solid #e2e8f0",
                  backgroundColor: selectedCategory === cat.name ? "#6366f1" : "#fff",
                  color: selectedCategory === cat.name ? "#fff" : "#475569",
                  cursor: "pointer",
                  fontWeight: "700",
                  fontSize: "13px",
                  whiteSpace: "nowrap",
                  boxShadow: selectedCategory === cat.name ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none"
                }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: "24px" }}>
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
                    borderRadius: "24px",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    height: "100%",
                    boxShadow: "0 10px 30px -5px rgba(0,0,0,0.04)",
                    position: "relative",
                  }}
                >
                  {discountPercent > 0 && (
                    <div style={{ position: "absolute", top: "20px", left: "20px", zIndex: 2, background: "#ef4444", color: "#fff", borderRadius: "8px", padding: "4px 10px", fontSize: "11px", fontWeight: "800", boxShadow: "0 4px 10px rgba(239, 68, 68, 0.3)" }}>
                      {discountPercent}% OFF
                    </div>
                  )}

                  <div style={{ position: "absolute", top: "20px", right: "20px", zIndex: 2, background: "#fff", borderRadius: "50%", width: "36px", height: "36px", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 10px rgba(0,0,0,0.06)", cursor: "pointer" }}>
                    🤍
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
                      <span style={{ fontSize: "12px", color: "#6366f1", fontWeight: "700", textTransform: "uppercase" }}>
                        {p.category}
                      </span>
                      <h2 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "6px 0 10px 0", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
                        {p.title}
                      </h2>
                      
                      <div style={{ display: "flex", alignItems: "baseline", gap: "10px", marginTop: "12px" }}>
                        <span style={{ fontSize: "20px", fontWeight: "900", color: "#059669" }}>₹{p.offerPrice}</span>
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
                        backgroundColor: "#ef4444",
                        color: "#fff",
                        border: "none",
                        padding: "12px",
                        borderRadius: "14px",
                        fontWeight: "700",
                        fontSize: "14px",
                        cursor: "pointer",
                        boxShadow: "0 4px 14px rgba(239, 68, 68, 0.3)",
                      }}
                    >
                      Grab Deal →
                    </button>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div style={{ gridColumn: "1 / -1", textAlign: "center", padding: "60px", color: "#64748b", fontSize: "15px", backgroundColor: "#fff", borderRadius: "24px", border: "1px solid #f1f5f9" }}>
            No deals available in this range or category!
          </div>
        )}
      </div>

    </div>
  );
}