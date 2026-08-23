"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedSubCategory, setSelectedSubCategory] = useState("All");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, prodRes] = await Promise.all([
          fetch("/api/categories"),
          fetch("/api/products")
        ]);
        const catData = await catRes.json();
        const prodData = await prodRes.json();

        if (catData.success) setCategories(catData.data);
        if (prodData.success) setProducts(prodData.data);
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mainCategories = categories.filter((c) => c.type === "category");
  const subCategories = categories.filter(
    (c) => c.type === "subcategory" && (selectedCategory === "All" || c.parentCategory === selectedCategory)
  );

  // Filter products based on selected category and subcategory
  const filteredProducts = products.filter((p) => {
    if (selectedCategory !== "All" && p.category !== selectedCategory) return false;
    if (selectedSubCategory !== "All" && p.subCategory !== selectedSubCategory) return false;
    return true;
  });

  if (loading) {
    return (
      <div style={{ textAlign: "center", padding: "80px", color: "#64748b", fontSize: "16px", fontWeight: "600" }}>
        Loading Categories & Products...
      </div>
    );
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "80px" }}>
      
      {/* Header Banner */}
      <div style={{ marginBottom: "24px" }}>
        <h1 style={{ fontSize: "28px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
          Shop by Category
        </h1>
        <p style={{ fontSize: "14px", color: "#64748b", margin: 0 }}>
          Categories aur sub-categories select karke apne pasandida products turant dekhein.
        </p>
      </div>

      {/* Main Categories Selector Bar */}
      <div style={{ display: "flex", gap: "10px", overflowX: "auto", paddingBottom: "12px", marginBottom: "16px" }}>
        <button
          onClick={() => {
            setSelectedCategory("All");
            setSelectedSubCategory("All");
          }}
          style={{
            padding: "10px 20px",
            borderRadius: "14px",
            border: selectedCategory === "All" ? "none" : "1px solid #e2e8f0",
            backgroundColor: selectedCategory === "All" ? "#6366f1" : "#fff",
            color: selectedCategory === "All" ? "#fff" : "#475569",
            cursor: "pointer",
            fontWeight: "700",
            fontSize: "14px",
            whiteSpace: "nowrap",
            boxShadow: selectedCategory === "All" ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
            transition: "all 0.2s"
          }}
        >
          🔥 All Categories
        </button>

        {mainCategories.map((cat) => (
          <button
            key={cat._id}
            onClick={() => {
              setSelectedCategory(cat.name);
              setSelectedSubCategory("All"); // Reset subcategory on main change
            }}
            style={{
              padding: "10px 20px",
              borderRadius: "14px",
              border: selectedCategory === cat.name ? "none" : "1px solid #e2e8f0",
              backgroundColor: selectedCategory === cat.name ? "#6366f1" : "#fff",
              color: selectedCategory === cat.name ? "#fff" : "#475569",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "14px",
              whiteSpace: "nowrap",
              boxShadow: selectedCategory === cat.name ? "0 4px 12px rgba(99, 102, 241, 0.25)" : "none",
              transition: "all 0.2s"
            }}
          >
            {cat.name}
          </button>
        ))}
      </div>

      {/* Sub-Categories Bar (Appears dynamically based on Main Category) */}
      {selectedCategory !== "All" && subCategories.length > 0 && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", overflowX: "auto", backgroundColor: "#fff", padding: "14px 18px", borderRadius: "18px", border: "1px solid #f1f5f9", marginBottom: "30px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)" }}>
          <span style={{ fontSize: "13px", fontWeight: "800", color: "#6366f1", whiteSpace: "nowrap", marginRight: "6px" }}>
            Sub-Categories:
          </span>
          
          <button
            onClick={() => setSelectedSubCategory("All")}
            style={{
              padding: "6px 16px",
              borderRadius: "10px",
              border: "none",
              backgroundColor: selectedSubCategory === "All" ? "#0f172a" : "#f1f5f9",
              color: selectedSubCategory === "All" ? "#fff" : "#475569",
              cursor: "pointer",
              fontWeight: "700",
              fontSize: "13px",
              whiteSpace: "nowrap",
            }}
          >
            All {selectedCategory}
          </button>

          {subCategories.map((sub) => (
            <button
              key={sub._id}
              onClick={() => setSelectedSubCategory(sub.name)}
              style={{
                padding: "6px 16px",
                borderRadius: "10px",
                border: "none",
                backgroundColor: selectedSubCategory === sub.name ? "#0f172a" : "#f1f5f9",
                color: selectedSubCategory === sub.name ? "#fff" : "#475569",
                cursor: "pointer",
                fontWeight: "700",
                fontSize: "13px",
                whiteSpace: "nowrap",
              }}
            >
              {sub.name}
            </button>
          ))}
        </div>
      )}

      {/* Products Display Section */}
      <div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>
            {selectedSubCategory !== "All" ? selectedSubCategory : selectedCategory !== "All" ? selectedCategory : "All Products"} 
            <span style={{ fontSize: "14px", fontWeight: "600", color: "#64748b", marginLeft: "8px" }}>
              ({filteredProducts.length} items found)
            </span>
          </h2>
        </div>

        {filteredProducts.length > 0 ? (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
            {filteredProducts.map((p) => (
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
                    boxShadow: "0 4px 20px -4px rgba(0,0,0,0.04)",
                    transition: "all 0.2s ease",
                  }}
                >
                  <div style={{ backgroundColor: "#f8fafc", height: "180px", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}>
                    <img
                      src={p.images && p.images.length > 0 ? p.images[0] : p.imageUrl || "https://via.placeholder.com/150"}
                      alt={p.title}
                      style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
                    />
                  </div>

                  <div style={{ padding: "18px" }}>
                    <span style={{ fontSize: "11px", color: "#6366f1", fontWeight: "700", textTransform: "uppercase" }}>
                      {p.category} {p.subCategory ? `> ${p.subCategory}` : ""}
                    </span>
                    <h3 style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: "6px 0 10px 0", lineHeight: "1.3", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
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
              </Link>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: "center", padding: "50px", backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #f1f5f9", color: "#64748b" }}>
            <p style={{ fontSize: "16px", fontWeight: "700", margin: "0 0 6px 0" }}>Koi product nahi mila!</p>
            <p style={{ fontSize: "13px", margin: 0 }}>Is category ya sub-category ke andar abhi koi items added nahi hain.</p>
          </div>
        )}
      </div>

    </div>
  );
}