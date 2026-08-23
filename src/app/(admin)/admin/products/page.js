"use client";
import { useState, useEffect } from "react";
import Link from "next/link";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categoriesList, setCategoriesList] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(false);

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

  return (
    <div style={{ maxWidth: "1100px", margin: "32px auto", padding: "0 20px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <h1 style={{ fontSize: "24px", fontWeight: "bold", margin: 0 }}>📦 Manage Products</h1>
        <Link href="/admin" style={{ backgroundColor: "#1f2937", color: "#fff", padding: "8px 16px", borderRadius: "8px", textDecoration: "none", fontWeight: "bold", fontSize: "14px" }}>
          ← Back to Dashboard
        </Link>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "12px", border: "1px solid #e5e7eb", marginBottom: "32px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", boxShadow: "0 1px 3px rgba(0,0,0,0.05)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "bold", gridColumn: "span 2", margin: "0 0 4px 0", color: "#374151", textTransform: "uppercase" }}>Add New Product</h2>
        
        <input name="title" placeholder="Product Title" value={formData.title} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }} required />
        
        <select name="category" value={formData.category} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none", backgroundColor: "#fff" }} required>
          <option value="">-- Select Main Category --</option>
          {mainCategories.map((cat) => (
            <option key={cat._id} value={cat.name}>{cat.name}</option>
          ))}
        </select>

        <select name="subCategory" value={formData.subCategory} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none", backgroundColor: "#fff" }} disabled={!formData.category}>
          <option value="">-- Select Sub-Category (Optional) --</option>
          {availableSubCategories.map((sub) => (
            <option key={sub._id} value={sub.name}>{sub.name}</option>
          ))}
        </select>

        <input name="originalPrice" type="number" placeholder="Original Price / M.R.P" value={formData.originalPrice} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }} required />
        <input name="offerPrice" type="number" placeholder="Offer Price" value={formData.offerPrice} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none" }} required />
        
        <textarea name="images" placeholder="Image URLs (Comma separated: url1, url2)" value={formData.images} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none", gridColumn: "span 2", minHeight: "60px" }} required />

        <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
            <span style={{ fontSize: "12px", fontWeight: "bold", color: "#4b5563" }}>Formatting:</span>
            <button type="button" onClick={() => handleFormatText("bold")} style={{ padding: "2px 8px", fontWeight: "bold", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>B</button>
            <button type="button" onClick={() => handleFormatText("italic")} style={{ padding: "2px 8px", fontStyle: "italic", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>I</button>
            <button type="button" onClick={() => handleFormatText("underline")} style={{ padding: "2px 8px", textDecoration: "underline", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>U</button>
            <button type="button" onClick={() => handleFormatText("strike")} style={{ padding: "2px 8px", textDecoration: "line-through", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>S</button>
          </div>
          <textarea name="description" placeholder="Description" value={formData.description} onChange={handleChange} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "14px", outline: "none", minHeight: "100px" }} required />
        </div>
        
        <button type="submit" disabled={loading} style={{ backgroundColor: "#2563eb", color: "#fff", padding: "12px", borderRadius: "8px", border: "none", fontWeight: "bold", fontSize: "15px", cursor: "pointer", gridColumn: "span 2" }}>
          {loading ? "Adding Product..." : "Add Product"}
        </button>
      </form>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "20px" }}>
        {products.map((p) => (
          <div 
            key={p._id} 
            onClick={() => setSelectedProduct(p)} 
            style={{ backgroundColor: "#fff", padding: "16px", borderRadius: "12px", border: "1px solid #e5e7eb", cursor: "pointer", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}
          >
            <div>
              <img src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/200"} alt={p.title} style={{ width: "100%", height: "160px", objectFit: "cover", borderRadius: "8px", marginBottom: "12px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: "bold", margin: "0 0 4px 0", color: "#111827" }}>{p.title}</h3>
              <p style={{ color: "#6b7280", fontSize: "13px", margin: "0 0 12px 0" }}>
                {p.category} {p.subCategory ? `> ${p.subCategory}` : ""}
              </p>
              
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <span style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a" }}>₹{p.offerPrice}</span>
                {p.originalPrice && <span style={{ fontSize: "13px", color: "#9ca3af", textDecoration: "line-through" }}>₹{p.originalPrice}</span>}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              <button 
                onClick={(e) => handleEditClick(e, p)} 
                style={{ backgroundColor: "#eab308", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
              >
                Edit
              </button>
              <button 
                onClick={(e) => handleDelete(e, p._id)} 
                style={{ backgroundColor: "#ef4444", color: "#fff", border: "none", padding: "8px", borderRadius: "6px", fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      {editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "600px", borderRadius: "16px", padding: "24px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setEditingProduct(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", position: "absolute", top: "20px", right: "20px" }}>✕</button>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "16px" }}>Edit Product Details</h2>
            <form onSubmit={handleUpdateSubmit} style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              <input name="title" value={editingProduct.title} onChange={(e) => setEditingProduct({ ...editingProduct, title: e.target.value })} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }} required />
              
              <select 
                name="category" 
                value={editingProduct.category} 
                onChange={(e) => setEditingProduct({ ...editingProduct, category: e.target.value, subCategory: "" })} 
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#fff" }} 
                required
              >
                <option value="">-- Select Main Category --</option>
                {mainCategories.map((cat) => (
                  <option key={cat._id} value={cat.name}>{cat.name}</option>
                ))}
              </select>

              <select 
                name="subCategory" 
                value={editingProduct.subCategory} 
                onChange={(e) => setEditingProduct({ ...editingProduct, subCategory: e.target.value })} 
                style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", backgroundColor: "#fff" }}
                disabled={!editingProduct.category}
              >
                <option value="">-- Select Sub-Category (Optional) --</option>
                {editingSubCategories.map((sub) => (
                  <option key={sub._id} value={sub.name}>{sub.name}</option>
                ))}
              </select>

              <input name="originalPrice" type="number" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }} required />
              <input name="offerPrice" type="number" value={editingProduct.offerPrice} onChange={(e) => setEditingProduct({ ...editingProduct, offerPrice: e.target.value })} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db" }} required />
              
              <textarea name="images" value={editingProduct.images} onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value })} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", gridColumn: "span 2", minHeight: "60px" }} required />
              
              <div style={{ gridColumn: "span 2", display: "flex", flexDirection: "column", gap: "6px" }}>
                <div style={{ display: "flex", gap: "6px", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "bold", color: "#4b5563" }}>Formatting:</span>
                  <button type="button" onClick={() => handleFormatText("bold", true)} style={{ padding: "2px 8px", fontWeight: "bold", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>B</button>
                  <button type="button" onClick={() => handleFormatText("italic", true)} style={{ padding: "2px 8px", fontStyle: "italic", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>I</button>
                  <button type="button" onClick={() => handleFormatText("underline", true)} style={{ padding: "2px 8px", textDecoration: "underline", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>U</button>
                  <button type="button" onClick={() => handleFormatText("strike", true)} style={{ padding: "2px 8px", textDecoration: "line-through", background: "#f3f4f6", border: "1px solid #d1d5db", borderRadius: "4px", cursor: "pointer" }}>S</button>
                </div>
                <textarea name="description" value={editingProduct.description} onChange={(e) => setEditingProduct({ ...editingProduct, description: e.target.value })} style={{ padding: "10px", borderRadius: "8px", border: "1px solid #d1d5db", minHeight: "100px" }} required />
              </div>
              
              <button type="submit" style={{ backgroundColor: "#16a34a", color: "#fff", border: "none", padding: "12px", borderRadius: "8px", fontWeight: "bold", cursor: "pointer", gridColumn: "span 2" }}>
                Update Product
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && !editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "600px", borderRadius: "16px", padding: "24px", position: "relative", maxHeight: "90vh", overflowY: "auto" }}>
            <button onClick={() => setSelectedProduct(null)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", position: "absolute", top: "20px", right: "20px" }}>✕</button>
            <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>{selectedProduct.title}</h2>
            <div dangerouslySetInnerHTML={{ __html: selectedProduct.description }} style={{ color: "#6b7280", fontSize: "14px", marginBottom: "16px" }} />
            <h4 style={{ fontSize: "14px", fontWeight: "bold", marginBottom: "12px", textTransform: "uppercase" }}>All Product Images:</h4>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
              {(selectedProduct.images || [selectedProduct.imageUrl]).map((img, idx) => (
                <img key={idx} src={img} alt="" style={{ width: "100%", height: "140px", objectFit: "cover", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}