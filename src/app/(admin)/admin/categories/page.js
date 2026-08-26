"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminCategoriesPage() {
  const lockScreen = useAdminProtect();

  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    type: "category",
    parentCategory: "",
    image: ""
  });
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

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

  const mainCategories = categories.filter((cat) => cat.type === "category");

  // Image Upload handler (Local file to base64)
  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({ ...prev, image: reader.result }));
      };
      reader.readAsDataURL(file);
    }
  };

  // Create or Update Handler (Ab yeh single /api/categories route par bhejega sath me ID)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!formData.name.trim()) {
      setError("Naam dalna zaroori hai!");
      return;
    }

    if (formData.type === "subcategory" && !formData.parentCategory) {
      setError("Kripya parent category select karein!");
      return;
    }

    setLoading(true);

    try {
      const method = editingId ? "PUT" : "POST";

      const res = await fetch("/api/categories", {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingId, // Update ke liye ID body me jayegi
          ...formData
        }),
      });

      const data = await res.json();

      if (data.success) {
        setMessage(editingId ? "Successfully updated!" : "Successfully created!");
        setFormData({ name: "", type: "category", parentCategory: "", image: "" });
        setEditingId(null);
        fetchCategories();
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

  // Edit Button Click Handler
  const handleEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      type: cat.type || "category",
      parentCategory: cat.parentCategory || "",
      image: cat.image || ""
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // Delete Handler (Ab yeh bhi single /api/categories route par ID bhejega)
  const handleDelete = async (id) => {
    if (!confirm("Kya aap sach mein is category ko delete karna chahte hain?")) return;

    try {
      const res = await fetch("/api/categories", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });
      const data = await res.json();

      if (data.success) {
        setMessage("Successfully deleted!");
        fetchCategories();
      } else {
        setError(data.error || "Delete nahi ho paya!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error ho gaya.");
    }
  };

  if (lockScreen) return lockScreen;

  return (
    <div style={{ maxWidth: "800px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, sans-serif" }}>
      <Link href="/admin" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
        ← Back to Admin Dashboard
      </Link>

      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "16px", border: "1px solid #e5e7eb", marginTop: "20px", boxShadow: "0 4px 6px -1px rgba(0,0,0,0.05)" }}>
        <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "8px" }}>
          {editingId ? "Edit Category / Sub-Category" : "Create Category / Sub-Category"}
        </h1>
        <p style={{ fontSize: "14px", color: "#6b7280", marginBottom: "24px" }}>
          Nayi categories add karein ya purani categories ko manage karein.
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
          
          {/* Select Type */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              Create Type:
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, parentCategory: "" })}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", backgroundColor: "#fff" }}
            >
              <option value="category">Main Category</option>
              <option value="subcategory">Sub-Category</option>
            </select>
          </div>

          {/* Parent Category if Sub-Category */}
          {formData.type === "subcategory" && (
            <div>
              <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
                Select Parent Category:
              </label>
              <select
                value={formData.parentCategory}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
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
              {formData.type === "category" ? "Category Name:" : "Sub-Category Name:"}
            </label>
            <input
              type="text"
              placeholder={formData.type === "category" ? "jaise: Electronics" : "jaise: Smartphones"}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          {/* Image Input (URL + File Upload) */}
          <div>
            <label style={{ display: "block", fontSize: "14px", fontWeight: "700", color: "#374151", marginBottom: "8px" }}>
              Category Image:
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Paste Image URL here..."
                value={formData.image && !formData.image.startsWith("data:") ? formData.image : ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                style={{ flex: 1, padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <span style={{ fontSize: "12px", color: "#64748b" }}>Or Upload File:</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "12px" }} />
            </div>

            {formData.image && (
              <div style={{ marginTop: "10px", width: "50px", height: "50px", borderRadius: "8px", overflow: "hidden", border: "1px solid #cbd5e1" }}>
                <img src={formData.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "10px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
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
              {loading ? "Saving..." : editingId ? "Update Category" : "Create Now"}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={() => {
                  setEditingId(null);
                  setFormData({ name: "", type: "category", parentCategory: "", image: "" });
                }}
                style={{
                  backgroundColor: "#6b7280",
                  color: "#fff",
                  border: "none",
                  padding: "14px 20px",
                  borderRadius: "8px",
                  fontWeight: "bold",
                  fontSize: "15px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Existing Categories List with Edit & Delete */}
        <div style={{ marginTop: "40px" }}>
          <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
            Existing Categories & Sub-Categories
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "300px", overflowY: "auto" }}>
            {categories.map((item) => (
              <div key={item._id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#f9fafb", borderRadius: "8px", border: "1px solid #e5e7eb", fontSize: "14px" }}>
                
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "36px", height: "36px", borderRadius: "6px", backgroundColor: "#e2e8f0", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    {item.image ? (
                      <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                    ) : (
                      <span>📦</span>
                    )}
                  </div>
                  <div>
                    <div style={{ fontWeight: "600", color: "#1f2937" }}>{item.name}</div>
                    <div style={{ fontSize: "11px", color: item.type === "category" ? "#2563eb" : "#059669", fontWeight: "bold" }}>
                      {item.type === "category" ? "Main Category" : `Sub of: ${item.parentCategory}`}
                    </div>
                  </div>
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleEdit(item)}
                    style={{ backgroundColor: "#fef3c7", color: "#d97706", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(item._id)}
                    style={{ backgroundColor: "#fee2e2", color: "#dc2626", border: "none", padding: "6px 12px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold", cursor: "pointer" }}
                  >
                    Delete
                  </button>
                </div>

              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}