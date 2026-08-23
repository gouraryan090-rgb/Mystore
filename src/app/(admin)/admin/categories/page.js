"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminCategoriesPage() {
  // Naya page-level protect hook jo modal render karega agar cookie na ho
  const lockScreen = useAdminProtect();

  const [categories, setCategories] = useState([]);
  const [type, setType] = useState("category"); // 'category' or 'subcategory'
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  // Saari categories fetch karein taaki dropdown ke liye use ho sakein
  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) {
        setCategories(data.data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  // Sirf main categories filter karne ke liye (jo sub-category banane ke liye parent ban sakein)
  const mainCategories = categories.filter((cat) => cat.type === "category");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name.trim()) {
      setError("Naam dalna zaroori hai!");
      return;
    }

    if (type === "subcategory" && !parentCategory) {
      setError("Kripya parent category select karein!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          type,
          parentCategory: type === "subcategory" ? parentCategory : null,
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage("Successfully created!");
        setName("");
        setParentCategory("");
        fetchCategories(); // List refresh karein
      } else {
        setError(data.error || "Kuch gadbad ho gayi!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  // Agar user authenticated nahi hai, toh lock modal dikhega
  if (lockScreen) return lockScreen;

  return (
    <div style={{ maxWidth: "700px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/admin" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
        ← Back to Admin Dashboard
      </Link>

      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb", marginTop: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
          Create Category / Sub-Category
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Nayi categories ya unke andar sub-categories add karein.
        </p>

        {message && (
          <div style={{ backgroundColor: "#f0fdf4", color: "#16a34a", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", border: "1px solid #dcfce7" }}>
            {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "12px", borderRadius: "8px", marginBottom: "16px", fontSize: "14px", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Select Type: Category or Sub-category */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              Create Type:
            </label>
            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setParentCategory("");
              }}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", backgroundColor: "#fff" }}
            >
              <option value="category">Main Category</option>
              <option value="subcategory">Sub-Category</option>
            </select>
          </div>

          {/* If Sub-Category is selected, show Parent Category Dropdown */}
          {type === "subcategory" && (
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
                Select Parent Category (Jisme sub-category banani hai):
              </label>
              <select
                value={parentCategory}
                onChange={(e) => setParentCategory(e.target.value)}
                style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", backgroundColor: "#fff" }}
              >
                <option value="">-- Choose Category --</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          {/* Name Input */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              {type === "category" ? "Category Name:" : "Sub-Category Name:"}
            </label>
            <input
              type="text"
              placeholder={type === "category" ? "jaise: Electronics, Clothing" : "jaise: Smartphones, T-Shirts"}
              value={name}
              onChange={(e) => setName(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "14px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
            }}
          >
            {loading ? "Creating..." : "Create Now"}
          </button>
        </form>

        {/* Existing Categories List */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
            Existing Categories & Sub-Categories
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "250px", overflowY: "auto" }}>
            {categories.map((item) => (
              <div key={item._id} style={{ display: "flex", justifyContent: "space-between", padding: "10px 14px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px" }}>
                <span style={{ fontWeight: "600", color: "#1f2937" }}>{item.name}</span>
                <span style={{ fontSize: "12px", color: item.type === "category" ? "#2563eb" : "#059669", fontWeight: "bold" }}>
                  {item.type === "category" ? "Main Category" : `Sub of: ${item.parentCategory}`}
                </span>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}