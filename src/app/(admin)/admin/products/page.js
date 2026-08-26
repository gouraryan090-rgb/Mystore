"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function ProductsPage() {
  const lockScreen = useAdminProtect();

  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    originalPrice: "",
    offerPrice: "",
    category: "",
    subCategory: "",
    images: "",
  });

  const fetchProducts = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) setProducts(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await fetch("/api/categories");
      const data = await res.json();
      if (data.success) setCategoriesList(data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      if (name === "category") {
        return { ...prev, category: value, subCategory: "" };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleFormatText = (tag, isEdit = false) => {
    const fieldName = "description";
    const currentVal = isEdit ? editingProduct[fieldName] : formData[fieldName];
    
    let formattedText = currentVal;
    if (tag === "bold") formattedText += `<strong>Text</strong>`;
    if (tag === "underline") formattedText += `<u>Text</u>`;
    if (tag === "strike") formattedText += `<del>Text</del>`;
    if (tag === "italic") formattedText += `<em>Text</em>`;

    if (isEdit) {
      setEditingProduct({ ...editingProduct, [fieldName]: formattedText });
    } else {
      setFormData({ ...formData, [fieldName]: formattedText });
    }
  };

  const mainCategories = categoriesList.filter((c) => c.type === "category");
  const availableSubCategories = categoriesList.filter(
    (c) => c.type === "subcategory" && c.parentCategory === formData.category
  );

  const filteredProducts = products.filter((p) =>
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (p.category && p.category.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const imageArray = formData.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, images: imageArray }),
      });

      if (res.ok) {
        setFormData({
          title: "",
          description: "",
          originalPrice: "",
          offerPrice: "",
          category: "",
          subCategory: "",
          images: "",
        });
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (e, product) => {
    e.stopPropagation();
    setEditingProduct({
      ...product,
      category: product.category || "",
      subCategory: product.subCategory || "",
      images: Array.isArray(product.images) ? product.images.join(", ") : product.imageUrl || "",
    });
  };

  const editingSubCategories = categoriesList.filter(
    (c) => c.type === "subcategory" && c.parentCategory === editingProduct?.category
  );

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    const imageArray = editingProduct.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    try {
      const res = await fetch("/api/products", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: editingProduct._id,
          title: editingProduct.title,
          description: editingProduct.description,
          originalPrice: editingProduct.originalPrice,
          offerPrice: editingProduct.offerPrice,
          category: editingProduct.category,
          subCategory: editingProduct.subCategory,
          images: imageArray,
        }),
      });

      if (res.ok) {
        setEditingProduct(null);
        fetchProducts();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (confirm("Kya aap is product ko delete karna chahte hain?")) {
      try {
        const res = await fetch(`/api/products?id=${id}`, {
          method: "DELETE",
        });
        if (res.ok) {
          fetchProducts();
        }
      } catch (err) {
        console.error(err);
      }
    }
  };

  if (lockScreen) return lockScreen;

  return (
    <div style={{ maxWidth: "1050px", margin: "30px auto", padding: "0 20px", fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      
      {/* Top Navigation */}
      <button
        onClick={() => window.history.back()}
        style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "12px", color: "#0f172a", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", marginBottom: "20px" }}
      >
        ← Back to Dashboard
      </button>

      {/* Header Info */}
      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: "32px" }}>
        <span style={{ fontSize: "11px", fontWeight: "900", color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px" }}>Catalog Management</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0 0" }}>📦 Manage Products</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0", fontWeight: "600" }}>Naye products add karein aur existing products ki pricing aur details manage karein.</p>
      </div>

      {/* Add Product Form Card */}
      <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0", marginBottom: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", gridColumn: "span 2", margin: "0 0 4px 0", color: "#0f172a" }}>Add New Product</h2>
        
        <div style={{ gridColumn: "span 1" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Product Title:</label>
          <input name="title" placeholder="e.g. Wireless Headphones" value={formData.title} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
        </div>
        
        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Main Category:</label>
          <select name="category" value={formData.category} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "700", outline: "none" }} required>
            <option value="">-- Choose Category --</option>
            {mainCategories.map((cat) => (
              <option key={cat._id} value={cat.name}>{cat.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Sub-Category:</label>
          <select name="subCategory" value={formData.subCategory} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "700", outline: "none" }} disabled={!formData.category}>
            <option value="">-- Choose Sub-Category --</option>
            {availableSubCategories.map((sub) => (
              <option key={sub._id} value={sub.name}>{sub.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Original Price / MRP (₹):</label>
          <input name="originalPrice" type="number" placeholder="e.g. 1999" value={formData.originalPrice} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Offer Price (₹):</label>
          <input name="offerPrice" type="number" placeholder="e.g. 999" value={formData.offerPrice} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
        </div>
        
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Image URLs (Comma separated):</label>
          <textarea name="images" placeholder="https://image1.jpg, https://image2.jpg" value={formData.images} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", minHeight: "60px", boxSizing: "border-box" }} required />
        </div>

        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "8px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Product Description:</label>
            <div style={{ display: "flex", gap: "6px" }}>
              <button type="button" onClick={() => handleFormatText("bold")} style={{ padding: "4px 10px", fontWeight: "800", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>B</button>
              <button type="button" onClick={() => handleFormatText("italic")} style={{ padding: "4px 10px", fontStyle: "italic", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>I</button>
              <button type="button" onClick={() => handleFormatText("underline")} style={{ padding: "4px 10px", textDecoration: "underline", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>U</button>
              <button type="button" onClick={() => handleFormatText("strike")} style={{ padding: "4px 10px", textDecoration: "line-through", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>S</button>
            </div>
          </div>
          <textarea name="description" placeholder="Write description with HTML formatting..." value={formData.description} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", minHeight: "110px", boxSizing: "border-box" }} required />
        </div>
        
        <button type="submit" disabled={loading} style={{ gridColumn: "span 2", backgroundColor: "#6366f1", color: "#fff", padding: "14px", borderRadius: "14px", border: "none", fontWeight: "800", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.25)", marginTop: "6px" }}>
          {loading ? "Publishing Product..." : "Publish Product"}
        </button>
      </form>

      {/* Products Catalog Filter Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", flexWrap: "wrap", gap: "15px" }}>
        <h2 style={{ fontSize: "18px", fontWeight: "900", color: "#0f172a", margin: 0 }}>
          All Products Catalog ({filteredProducts.length})
        </h2>
        <input
          type="text"
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          style={{ padding: "11px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", fontSize: "13px", outline: "none", backgroundColor: "#fff", fontWeight: "600", width: "250px" }}
        />
      </div>

      {/* Dynamic Products Grid */}
      {filteredProducts.length === 0 ? (
        <div style={{ textAlign: "center", padding: "50px", color: "#64748b", fontSize: "14px", fontWeight: "600", backgroundColor: "#fff", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
          Koi product nahi mila!
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "20px" }}>
          {filteredProducts.map((p) => (
            <div 
              key={p._id} 
              onClick={() => setSelectedProduct(p)} 
              style={{ backgroundColor: "#fcfcfd", padding: "16px", borderRadius: "20px", border: "1px solid #e2e8f0", cursor: "pointer", boxShadow: "0 4px 12px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between", transition: "transform 0.2s" }}
            >
              <div>
                <img src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/200"} alt={p.title} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "14px", marginBottom: "12px", border: "1px solid #e2e8f0" }} />
                <h3 style={{ fontSize: "15px", fontWeight: "900", margin: "0 0 4px 0", color: "#0f172a", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>{p.title}</h3>
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "800", margin: "0 0 12px 0", textTransform: "uppercase" }}>
                  {p.category} {p.subCategory ? `› ${p.subCategory}` : ""}
                </p>
                
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "16px" }}>
                  <span style={{ fontSize: "18px", fontWeight: "900", color: "#16a34a" }}>₹{p.offerPrice}</span>
                  {p.originalPrice && <span style={{ fontSize: "13px", color: "#94a3b8", fontWeight: "700", textDecoration: "line-through" }}>₹{p.originalPrice}</span>}
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px", borderTop: "1px solid #f1f5f9", paddingTop: "12px" }}>
                <button 
                  onClick={(e) => handleEditClick(e, p)} 
                  style={{ backgroundColor: "#fef3c7", color: "#d97706", border: "none", padding: "8px", borderRadius: "10px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                >
                  Edit
                </button>
                <button 
                  onClick={(e) => handleDelete(e, p._id)} 
                  style={{ backgroundColor: "#fee2e2", color: "#dc2626", border: "none", padding: "8px", borderRadius: "10px", fontSize: "12px", fontWeight: "800", cursor: "pointer" }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Product Modal */}
      {editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "650px", borderRadius: "24px", padding: "32px", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <button onClick={() => setEditingProduct(null)} style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "14px", fontWeight: "bold", cursor: "pointer", position: "absolute", top: "24px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "20px", color: "#0f172a" }}>Edit Product Details</h2>
            
            <form onSubmit={handleUpdateSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "14px" }}>
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Product Title:</label>
                <input name="title" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} required />
              </div>
              
              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Main Category:</label>
                <select 
                  name="category" 
                  value={editingProduct.category} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value, subCategory: "" })} 
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "700", fontSize: "13px" }} 
                  required
                >
                  <option value="">-- Choose Category --</option>
                  {mainCategories.map((cat) => (
                    <option key={cat._id} value={cat.name}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Sub-Category:</label>
                <select 
                  name="subCategory" 
                  value={editingProduct.subCategory} 
                  onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })} 
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "700", fontSize: "13px" }}
                  disabled={!editingProduct.category}
                >
                  <option value="">-- Choose Sub-Category --</option>
                  {editingSubCategories.map((sub) => (
                    <option key={sub._id} value={sub.name}>{sub.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Original Price (₹):</label>
                <input name="originalPrice" type="number" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Offer Price (₹):</label>
                <input name="offerPrice" type="number" value={editingProduct.offerPrice} onChange={(e) => setEditingProduct({ ...editingProduct, offerPrice: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} required />
              </div>
              
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Image URLs:</label>
                <textarea name="images" value={editingProduct.images} onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", gridColumn: "span 2", minHeight: "60px", boxSizing: "border-box" }} required />
              </div>
              
              <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "8px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <label style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>Description:</label>
                  <div style={{ display: "flex", gap: "6px" }}>
                    <button type="button" onClick={() => handleFormatText("bold", true)} style={{ padding: "4px 10px", fontWeight: "800", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>B</button>
                    <button type="button" onClick={() => handleFormatText("italic", true)} style={{ padding: "4px 10px", fontStyle: "italic", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>I</button>
                    <button type="button" onClick={() => handleFormatText("underline", true)} style={{ padding: "4px 10px", textDecoration: "underline", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>U</button>
                    <button type="button" onClick={() => handleFormatText("strike", true)} style={{ padding: "4px 10px", textDecoration: "line-through", background: "#f1f5f9", border: "1px solid #cbd5e1", borderRadius: "8px", cursor: "pointer", fontSize: "12px" }}>S</button>
                  </div>
                </div>
                <textarea name="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", minHeight: "100px", boxSizing: "border-box" }} required />
              </div>
              
              <button type="submit" style={{ gridColumn: "span 2", backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "14px", borderRadius: "14px", fontWeight: "800", fontSize: "14px", cursor: "pointer", boxShadow: "0 4px 12px rgba(22, 163, 74, 0.25)", marginTop: "10px" }}>
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}

      {/* View Product Details Modal */}
      {selectedProduct && !editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "650px", borderRadius: "24px", padding: "32px", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <button onClick={() => setSelectedProduct(null)} style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "14px", fontWeight: "bold", cursor: "pointer", position: "absolute", top: "24px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "6px", color: "#0f172a" }}>{selectedProduct.title}</h2>
            <p style={{ fontSize: "12px", fontWeight: "800", color: "#6366f1", marginBottom: "16px", textTransform: "uppercase" }}>{selectedProduct.category} {selectedProduct.subCategory ? `› ${selectedProduct.subCategory}` : ""}</p>
            
            <div dangerouslySetInnerHTML={{ __html: selectedProduct.description }} style={{ color: "#475569", fontSize: "13px", lineHeight: "1.6", marginBottom: "20px", padding: "14px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            
            <h4 style={{ fontSize: "13px", fontWeight: "900", marginBottom: "12px", textTransform: "uppercase", color: "#334155" }}>All Product Images:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {(selectedProduct.images || [selectedProduct.imageUrl]).map((img, idx) => (
                <img key={idx} src={img} alt="" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}