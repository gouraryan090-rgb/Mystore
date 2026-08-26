"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminCategoriesPage() {
  const lockScreen = useAdminProtect();

  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
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

  // Filtered categories for dynamic search
  const filteredCategories = categories.filter((cat) => 
    cat.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (cat.parentCategory && cat.parentCategory.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  // Create or Update Handler
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
          id: editingId,
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

  // Delete Handler
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
    <div style={{ maxWidth: "900px", margin: "30px auto", padding: "0 20px", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      
      {/* Top Back Action */}
      <button
        onClick={() => window.history.back()}
        style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "12px", color: "#0f172a", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", marginBottom: "20px" }}
      >
        ← Back to Dashboard
      </button>

      {/* Main Form Box Card */}
      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
        
        <div style={{ marginBottom: "24px" }}>
          <span style={{ fontSize: "11px", fontWeight: "900", color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px" }}>Inventory Catalog</span>
          <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0 0" }}>
            {editingId ? "Edit Category / Sub-Category" : "Create Category / Sub-Category"}
          </h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0", fontWeight: "600" }}>
            Nayi categories add karein ya purani categories ko manage karein.
          </p>
        </div>

        {message && (
          <div style={{ backgroundColor: "#f0fdf4", color: "#16a34a", padding: "14px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #dcfce7" }}>
            ✅ {message}
          </div>
        )}

        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "14px 18px", borderRadius: "14px", marginBottom: "20px", fontSize: "13px", fontWeight: "700", border: "1px solid #fecaca" }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          
          {/* Select Type */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
              Create Type:
            </label>
            <select
              value={formData.type}
              onChange={(e) => setFormData({ ...formData, type: e.target.value, parentCategory: "" })}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "700", color: "#0f172a", outline: "none" }}
            >
              <option value="category">Main Category</option>
              <option value="subcategory">Sub-Category</option>
            </select>
          </div>

          {/* Parent Category if Sub-Category */}
          {formData.type === "subcategory" && (
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
                Select Parent Category:
              </label>
              <select
                value={formData.parentCategory}
                onChange={(e) => setFormData({ ...formData, parentCategory: e.target.value })}
                style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "700", color: "#0f172a", outline: "none" }}
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
            <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
              {formData.type === "category" ? "Category Name:" : "Sub-Category Name:"}
            </label>
            <input
              type="text"
              placeholder={formData.type === "category" ? "jaise: Electronics" : "jaise: Smartphones"}
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", color: "#0f172a", outline: "none", boxSizing: "border-box" }}
            />
          </div>

          {/* Image Input (URL + File Upload) */}
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>
              Category Image:
            </label>
            <div style={{ display: "flex", gap: "10px", marginBottom: "10px" }}>
              <input
                type="text"
                placeholder="Paste Image URL here..."
                value={formData.image && !formData.image.startsWith("data:") ? formData.image : ""}
                onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                style={{ flex: 1, padding: "11px 14px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", outline: "none" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "12px", backgroundColor: "#f8fafc", padding: "10px 14px", borderRadius: "12px", border: "1px solid #e2e8f0" }}>
              <span style={{ fontSize: "12px", color: "#64748b", fontWeight: "700" }}>Or Upload Local File:</span>
              <input type="file" accept="image/*" onChange={handleImageUpload} style={{ fontSize: "12px", cursor: "pointer" }} />
            </div>

            {formData.image && (
              <div style={{ marginTop: "12px", width: "60px", height: "60px", borderRadius: "14px", overflow: "hidden", border: "1px solid #cbd5e1", boxShadow: "0 2px 8px rgba(0,0,0,0.05)" }}>
                <img src={formData.image} alt="Preview" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              </div>
            )}
          </div>

          <div style={{ display: "flex", gap: "12px", marginTop: "8px" }}>
            <button
              type="submit"
              disabled={loading}
              style={{
                flex: 1,
                backgroundColor: "#6366f1",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "14px",
                fontWeight: "800",
                fontSize: "14px",
                cursor: "pointer",
                boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)"
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
                  backgroundColor: "#64748b",
                  color: "#fff",
                  border: "none",
                  padding: "14px 22px",
                  borderRadius: "14px",
                  fontWeight: "800",
                  fontSize: "14px",
                  cursor: "pointer",
                }}
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        {/* Existing Categories Dynamic Grid Section */}
        <div style={{ marginTop: "40px", borderTop: "1px solid #f1f5f9", paddingTop: "30px" }}>
          
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
              Existing Categories & Sub-Categories ({filteredCategories.length})
            </h2>

            {/* Dynamic Search Filter Bar */}
            <input
              type="text"
              placeholder="Search category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ padding: "10px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#f8fafc", fontWeight: "600", width: "240px" }}
            />
          </div>

          {filteredCategories.length === 0 ? (
            <div style={{ textAlign: "center", padding: "40px", color: "#64748b", fontSize: "14px", fontWeight: "600", backgroundColor: "#f8fafc", borderRadius: "16px" }}>
              Koi category nahi mili!
            </div>
          ) : (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "16px" }}>
              {filteredCategories.map((item) => (
                <div key={item._id} style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", padding: "18px", backgroundColor: "#fcfcfd", borderRadius: "20px", border: "1px solid #e2e8f0", boxShadow: "0 4px 12px rgba(0,0,0,0.02)" }}>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "14px", marginBottom: "16px" }}>
                    <div style={{ width: "50px", height: "50px", borderRadius: "14px", backgroundColor: "#f1f5f9", overflow: "hidden", display: "flex", alignItems: "center", justifyContent: "center", border: "1px solid #e2e8f0", flexShrink: 0 }}>
                      {item.image ? (
                        <img src={item.image} alt={item.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                      ) : (
                        <span style={{ fontSize: "20px" }}>📦</span>
                      )}
                    </div>
                    <div style={{ overflow: "hidden" }}>
                      <div style={{ fontWeight: "900", color: "#0f172a", fontSize: "15px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{item.name}</div>
                      <div style={{ fontSize: "11px", color: item.type === "category" ? "#6366f1" : "#059669", fontWeight: "800", marginTop: "3px" }}>
                        {item.type === "category" ? "Main Category" : `Sub: ${item.parentCategory}`}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: "flex", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                    <button
                      onClick={() => handleEdit(item)}
                      style={{ flex: 1, backgroundColor: "#fef3c7", color: "#d97706", border: "none", padding: "8px", borderRadius: "10px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(item._id)}
                      style={{ flex: 1, backgroundColor: "#fee2e2", color: "#dc2626", border: "none", padding: "8px", borderRadius: "10px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}