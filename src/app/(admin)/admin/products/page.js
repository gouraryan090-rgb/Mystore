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
    sizes: "", // e.g., "S, M, L"
    colorVariants: [{ color: "", images: "", stock: 10 }],
    sizeStockVariants: [], // [{ size: "M", color: "Pink", stock: 5 }]
    stock: 10, // General stock for single products without sizes/colors
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

  // Helper to generate dynamic combinations of Sizes and Colors for stock tracking
  const generateSizeColorStock = (sizesStr, colorVariantsArr, existingStockVariants = []) => {
    const sizes = sizesStr.split(",").map(s => s.trim()).filter(Boolean);
    const validColors = colorVariantsArr.map(c => c.color ? c.color.trim() : "").filter(Boolean);

    const combinations = [];

    if (sizes.length > 0 && validColors.length === 0) {
      // Agar sirf Sizes hain, Colors nahi hain
      sizes.forEach(size => {
        const existing = existingStockVariants.find(e => e.size === size && !e.color);
        combinations.push({
          size,
          color: "",
          stock: existing ? existing.stock : 10
        });
      });
    } else if (sizes.length > 0 && validColors.length > 0) {
      // Agar Sizes aur Colors dono hain
      sizes.forEach(size => {
        validColors.forEach(color => {
          const existing = existingStockVariants.find(e => e.size === size && e.color === color);
          combinations.push({
            size,
            color,
            stock: existing ? existing.stock : 10
          });
        });
      });
    }
    return combinations;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const updatedFormData = { ...prev };
      if (name === "category") {
        updatedFormData.category = value;
        updatedFormData.subCategory = "";
      } else {
        updatedFormData[name] = value;
      }

      if (name === "sizes" || name === "colorVariants") {
        updatedFormData.sizeStockVariants = generateSizeColorStock(
          updatedFormData.sizes,
          updatedFormData.colorVariants,
          prev.sizeStockVariants
        );
      }

      return updatedFormData;
    });
  };

  const handleEditingChange = (field, value) => {
    setEditingProduct((prev) => {
      const updated = { ...prev, [field]: value };
      if (field === "sizes" || field === "colorVariants") {
        updated.sizeStockVariants = generateSizeColorStock(
          updated.sizes || "",
          updated.colorVariants || [],
          prev.sizeStockVariants || []
        );
      }
      return updated;
    });
  };

  const handleAddColorVariant = (isEdit = false) => {
    if (isEdit) {
      const updatedVariants = [...(editingProduct.colorVariants || []), { color: "", images: "", stock: 10 }];
      handleEditingChange("colorVariants", updatedVariants);
    } else {
      const updatedVariants = [...formData.colorVariants, { color: "", images: "", stock: 10 }];
      const newStockMatrix = generateSizeColorStock(formData.sizes, updatedVariants, formData.sizeStockVariants);
      setFormData((prev) => ({ ...prev, colorVariants: updatedVariants, sizeStockVariants: newStockMatrix }));
    }
  };

  const handleColorVariantChange = (index, field, value, isEdit = false) => {
    if (isEdit) {
      const updatedVariants = [...editingProduct.colorVariants];
      updatedVariants[index][field] = value;
      handleEditingChange("colorVariants", updatedVariants);
    } else {
      const updatedVariants = [...formData.colorVariants];
      updatedVariants[index][field] = value;
      const newStockMatrix = generateSizeColorStock(formData.sizes, updatedVariants, formData.sizeStockVariants);
      setFormData((prev) => ({ ...prev, colorVariants: updatedVariants, sizeStockVariants: newStockMatrix }));
    }
  };

  const handleStockMatrixChange = (index, value, isEdit = false) => {
    const qty = parseInt(value) || 0;
    if (isEdit) {
      const updatedMatrix = [...editingProduct.sizeStockVariants];
      updatedMatrix[index].stock = qty;
      setEditingProduct({ ...editingProduct, sizeStockVariants: updatedMatrix });
    } else {
      const updatedMatrix = [...formData.sizeStockVariants];
      updatedMatrix[index].stock = qty;
      setFormData({ ...formData, sizeStockVariants: updatedMatrix });
    }
  };

  const handleRemoveColorVariant = (index, isEdit = false) => {
    if (isEdit) {
      const updatedVariants = editingProduct.colorVariants.filter((_, i) => i !== index);
      handleEditingChange("colorVariants", updatedVariants);
    } else {
      const updatedVariants = formData.colorVariants.filter((_, i) => i !== index);
      const newStockMatrix = generateSizeColorStock(formData.sizes, updatedVariants, formData.sizeStockVariants);
      setFormData((prev) => ({ ...prev, colorVariants: updatedVariants, sizeStockVariants: newStockMatrix }));
    }
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

    const mainImageArray = formData.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    const sizesArray = formData.sizes
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    const formattedColorVariants = formData.colorVariants
      .filter((v) => v.color.trim() !== "")
      .map((v) => ({
        color: v.color.trim(),
        images: v.images.split(",").map((url) => url.trim()).filter(Boolean),
        stock: parseInt(v.stock) || 10
      }));

    try {
      const res = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          ...formData, 
          images: mainImageArray, 
          sizes: sizesArray,
          colorVariants: formattedColorVariants,
          sizeStockVariants: formData.sizeStockVariants,
          stock: parseInt(formData.stock) || 10
        }),
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
          sizes: "",
          colorVariants: [{ color: "", images: "", stock: 10 }],
          sizeStockVariants: [],
          stock: 10,
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
    
    const formattedVariants = product.colorVariants && product.colorVariants.length > 0
      ? product.colorVariants.map(v => ({ color: v.color, images: Array.isArray(v.images) ? v.images.join(", ") : v.images, stock: v.stock || 10 }))
      : [{ color: "", images: "", stock: 10 }];

    setEditingProduct({
      ...product,
      category: product.category || "",
      subCategory: product.subCategory || "",
      images: Array.isArray(product.images) ? product.images.join(", ") : product.imageUrl || "",
      sizes: Array.isArray(product.sizes) ? product.sizes.join(", ") : (product.sizes || ""),
      colorVariants: formattedVariants,
      sizeStockVariants: product.sizeStockVariants || [],
      stock: product.stock !== undefined ? product.stock : 10,
    });
  };

  const editingSubCategories = categoriesList.filter(
    (c) => c.type === "subcategory" && c.parentCategory === editingProduct?.category
  );

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    
    const mainImageArray = editingProduct.images
      .split(",")
      .map((url) => url.trim())
      .filter(Boolean);

    const sizesArray = editingProduct.sizes
      ? editingProduct.sizes.split(",").map((s) => s.trim()).filter(Boolean)
      : [];

    const formattedColorVariants = (editingProduct.colorVariants || [])
      .filter((v) => v.color && v.color.trim() !== "")
      .map((v) => ({
        color: v.color.trim(),
        images: typeof v.images === "string" 
          ? v.images.split(",").map((url) => url.trim()).filter(Boolean)
          : v.images,
        stock: parseInt(v.stock) || 10
      }));

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
          images: mainImageArray,
          sizes: sizesArray,
          colorVariants: formattedColorVariants,
          sizeStockVariants: editingProduct.sizeStockVariants || [],
          stock: parseInt(editingProduct.stock) || 10,
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
      
      <button
        onClick={() => window.history.back()}
        style={{ background: "#fff", border: "1px solid #cbd5e1", padding: "10px 18px", borderRadius: "12px", color: "#0f172a", cursor: "pointer", fontWeight: "700", fontSize: "13px", display: "inline-flex", alignItems: "center", gap: "8px", boxShadow: "0 2px 5px rgba(0,0,0,0.02)", marginBottom: "20px" }}
      >
        ← Back to Dashboard
      </button>

      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0", boxShadow: "0 10px 30px rgba(0,0,0,0.04)", marginBottom: "32px" }}>
        <span style={{ fontSize: "11px", fontWeight: "900", color: "#6366f1", textTransform: "uppercase", letterSpacing: "1px" }}>Catalog Management</span>
        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "4px 0 0 0" }}>📦 Manage Products & Stock</h1>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "4px 0 0 0", fontWeight: "600" }}>Naye products add karein aur har size/color combination ya single product ka stock manage karein.</p>
      </div>

      <form onSubmit={handleSubmit} style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid #e2e8f0", marginBottom: "40px", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "18px", boxShadow: "0 10px 30px rgba(0,0,0,0.04)" }}>
        <h2 style={{ fontSize: "16px", fontWeight: "900", gridColumn: "span 2", margin: "0 0 4px 0", color: "#0f172a" }}>Add New Product</h2>
        
        <div style={{ gridColumn: "span 1" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Product Title:</label>
          <input name="title" placeholder="e.g. Cotton Casual Shirt or Phone" value={formData.title} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
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
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Sizes (Optional, Comma separated):</label>
          <input name="sizes" placeholder="e.g. S, M, L, XL (leave blank if single product)" value={formData.sizes} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Original Price / MRP (₹):</label>
          <input name="originalPrice" type="number" placeholder="e.g. 1999" value={formData.originalPrice} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
        </div>

        <div>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Offer Price (₹):</label>
          <input name="offerPrice" type="number" placeholder="e.g. 999" value={formData.offerPrice} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} required />
        </div>

        {formData.sizeStockVariants.length === 0 && (
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Overall Stock Quantity (For Single Products):</label>
            <input name="stock" type="number" placeholder="e.g. 15" value={formData.stock} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", boxSizing: "border-box" }} min="0" />
          </div>
        )}
        
        <div style={{ gridColumn: "span 2" }}>
          <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "8px" }}>Default Main Image URLs (Comma separated):</label>
          <textarea name="images" placeholder="https://image1.jpg, https://image2.jpg" value={formData.images} onChange={handleChange} style={{ width: "100%", padding: "12px 16px", borderRadius: "14px", border: "1px solid #cbd5e1", fontSize: "13px", backgroundColor: "#f8fafc", fontWeight: "600", outline: "none", minHeight: "60px", boxSizing: "border-box" }} required />
        </div>

        <div style={{ gridColumn: "span 2", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
            <label style={{ fontSize: "13px", fontWeight: "900", color: "#334155" }}>🎨 Color Variants & Photos (Optional):</label>
            <button type="button" onClick={() => handleAddColorVariant(false)} style={{ backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>+ Add Color</button>
          </div>

          {formData.colorVariants.map((variant, index) => (
            <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
              <input 
                type="text" 
                placeholder="Color Name (e.g. Pink)" 
                value={variant.color} 
                onChange={(e) => handleColorVariantChange(index, "color", e.target.value, false)}
                style={{ flex: "1", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", fontWeight: "600" }} 
              />
              <input 
                type="text" 
                placeholder="Image URLs (Comma separated)" 
                value={variant.images} 
                onChange={(e) => handleColorVariantChange(index, "images", e.target.value, false)}
                style={{ flex: "2", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", fontWeight: "600" }} 
              />
              {formData.colorVariants.length > 1 && (
                <button type="button" onClick={() => handleRemoveColorVariant(index, false)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "10px 12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>✕</button>
              )}
            </div>
          ))}
        </div>

        {formData.sizeStockVariants.length > 0 && (
          <div style={{ gridColumn: "span 2", backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "16px", border: "1px solid #bbf7d0" }}>
            <label style={{ fontSize: "13px", fontWeight: "900", color: "#166534", display: "block", marginBottom: "12px" }}>📦 Stock Quantity for Each Size & Color Combination:</label>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
              {formData.sizeStockVariants.map((item, idx) => (
                <div key={idx} style={{ backgroundColor: "#fff", padding: "10px 14px", borderRadius: "10px", border: "1px solid #86efac", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: "12px", fontWeight: "800", color: "#14532d" }}>
                    {item.color ? `${item.color} (${item.size})` : `Size: ${item.size}`}
                  </span>
                  <input 
                    type="number" 
                    value={item.stock} 
                    onChange={(e) => handleStockMatrixChange(idx, e.target.value, false)}
                    style={{ width: "60px", padding: "6px", textAlign: "center", borderRadius: "6px", border: "1px solid #cbd5e1", fontWeight: "700", fontSize: "13px" }}
                    min="0"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

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
                <p style={{ color: "#64748b", fontSize: "11px", fontWeight: "800", margin: "0 0 6px 0", textTransform: "uppercase" }}>
                  {p.category} {p.subCategory ? `› ${p.subCategory}` : ""}
                </p>

                {p.sizes && p.sizes.length > 0 ? (
                  <p style={{ color: "#4f46e5", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0" }}>
                    Sizes: {Array.isArray(p.sizes) ? p.sizes.join(", ") : p.sizes}
                  </p>
                ) : (
                  <p style={{ color: "#16a34a", fontSize: "11px", fontWeight: "700", margin: "0 0 8px 0" }}>
                    Stock: {p.stock !== undefined ? p.stock : 10} left
                  </p>
                )}
                
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

      {editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "680px", borderRadius: "24px", padding: "32px", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <button onClick={() => setEditingProduct(null)} style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "14px", fontWeight: "bold", cursor: "pointer", position: "absolute", top: "24px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "20px", color: "#0f172a" }}>Edit Product & Stock</h2>
            
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
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Sizes (Optional, Comma separated):</label>
                <input name="sizes" value={editingProduct.sizes} onChange={(e) => handleEditingChange("sizes", e.target.value)} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Original Price (₹):</label>
                <input name="originalPrice" type="number" value={editingProduct.originalPrice} onChange={(e) => setEditingProduct({ ...editingProduct, originalPrice: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Offer Price (₹):</label>
                <input name="offerPrice" type="number" value={editingProduct.offerPrice} onChange={(e) => setEditingProduct({ ...editingProduct, offerPrice: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} required />
              </div>

              {(!editingProduct.sizeStockVariants || editingProduct.sizeStockVariants.length === 0) && (
                <div>
                  <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Overall Stock Quantity:</label>
                  <input name="stock" type="number" value={editingProduct.stock !== undefined ? editingProduct.stock : 10} onChange={(e) => setEditingProduct({ ...editingProduct, stock: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", boxSizing: "border-box" }} min="0" />
                </div>
              )}
              
              <div style={{ gridColumn: "span 2" }}>
                <label style={{ display: "block", fontSize: "13px", fontWeight: "800", color: "#334155", marginBottom: "6px" }}>Default Main Image URLs:</label>
                <textarea name="images" value={editingProduct.images} onChange={(e) => setEditingProduct({ ...editingProduct, images: e.target.value })} style={{ width: "100%", padding: "12px 16px", borderRadius: "12px", border: "1px solid #cbd5e1", backgroundColor: "#f8fafc", fontWeight: "600", fontSize: "13px", minHeight: "60px", boxSizing: "border-box" }} required />
              </div>

              <div style={{ gridColumn: "span 2", backgroundColor: "#f8fafc", padding: "16px", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                  <label style={{ fontSize: "13px", fontWeight: "900", color: "#334155" }}>🎨 Color Variants & Photos (Optional):</label>
                  <button type="button" onClick={() => handleAddColorVariant(true)} style={{ backgroundColor: "#4f46e5", color: "#fff", border: "none", padding: "6px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>+ Add Color</button>
                </div>

                {(editingProduct.colorVariants || []).map((variant, index) => (
                  <div key={index} style={{ display: "flex", gap: "10px", marginBottom: "10px", alignItems: "center" }}>
                    <input 
                      type="text" 
                      placeholder="Color Name" 
                      value={variant.color} 
                      onChange={(e) => handleColorVariantChange(index, "color", e.target.value, true)}
                      style={{ flex: "1", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", fontWeight: "600" }} 
                    />
                    <input 
                      type="text" 
                      placeholder="Image URLs" 
                      value={variant.images} 
                      onChange={(e) => handleColorVariantChange(index, "images", e.target.value, true)}
                      style={{ flex: "2", padding: "10px 14px", borderRadius: "10px", border: "1px solid #cbd5e1", fontSize: "13px", background: "#fff", fontWeight: "600" }} 
                    />
                    <button type="button" onClick={() => handleRemoveColorVariant(index, true)} style={{ background: "#fee2e2", color: "#dc2626", border: "none", padding: "10px 12px", borderRadius: "10px", fontWeight: "bold", cursor: "pointer" }}>✕</button>
                  </div>
                ))}
              </div>

              {editingProduct.sizeStockVariants && editingProduct.sizeStockVariants.length > 0 && (
                <div style={{ gridColumn: "span 2", backgroundColor: "#f0fdf4", padding: "16px", borderRadius: "16px", border: "1px solid #bbf7d0" }}>
                  <label style={{ fontSize: "13px", fontWeight: "900", color: "#166534", display: "block", marginBottom: "12px" }}>📦 Stock Quantity for Each Size & Color Combination:</label>
                  <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "10px" }}>
                    {editingProduct.sizeStockVariants.map((item, idx) => (
                      <div key={idx} style={{ backgroundColor: "#fff", padding: "10px 14px", borderRadius: "10px", border: "1px solid #86efac", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                        <span style={{ fontSize: "12px", fontWeight: "800", color: "#14532d" }}>
                          {item.color ? `${item.color} (${item.size})` : `Size: ${item.size}`}
                        </span>
                        <input 
                          type="number" 
                          value={item.stock} 
                          onChange={(e) => handleStockMatrixChange(idx, e.target.value, true)}
                          style={{ width: "60px", padding: "6px", textAlign: "center", borderRadius: "6px", border: "1px solid #cbd5e1", fontWeight: "700", fontSize: "13px" }}
                          min="0"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
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
                Update Product & Stock
              </button>
            </form>
          </div>
        </div>
      )}

      {selectedProduct && !editingProduct && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(15, 23, 42, 0.6)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "650px", borderRadius: "24px", padding: "32px", position: "relative", maxHeight: "90vh", overflowY: "auto", boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)" }}>
            <button onClick={() => setSelectedProduct(null)} style={{ background: "#f1f5f9", border: "none", width: "32px", height: "32px", borderRadius: "50%", fontSize: "14px", fontWeight: "bold", cursor: "pointer", position: "absolute", top: "24px", right: "24px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            <h2 style={{ fontSize: "20px", fontWeight: "900", marginBottom: "6px", color: "#0f172a" }}>{selectedProduct.title}</h2>
            <p style={{ fontSize: "12px", fontWeight: "800", color: "#6366f1", marginBottom: "16px", textTransform: "uppercase" }}>{selectedProduct.category} {selectedProduct.subCategory ? `› ${selectedProduct.subCategory}` : ""}</p>
            
            {selectedProduct.sizes && selectedProduct.sizes.length > 0 ? (
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "12px", color: "#334155" }}>Available Sizes: </strong>
                <span style={{ fontSize: "12px", color: "#4f46e5", fontWeight: "700" }}>{Array.isArray(selectedProduct.sizes) ? selectedProduct.sizes.join(", ") : selectedProduct.sizes}</span>
              </div>
            ) : (
              <div style={{ marginBottom: "16px" }}>
                <strong style={{ fontSize: "12px", color: "#334155" }}>Stock Available: </strong>
                <span style={{ fontSize: "12px", color: "#16a34a", fontWeight: "800" }}>{selectedProduct.stock !== undefined ? selectedProduct.stock : 10} units</span>
              </div>
            )}

            <div dangerouslySetInnerHTML={{ __html: selectedProduct.description }} style={{ color: "#475569", fontSize: "13px", lineHeight: "1.6", marginBottom: "20px", padding: "14px", backgroundColor: "#f8fafc", borderRadius: "12px", border: "1px solid #e2e8f0" }} />
            
            {selectedProduct.sizeStockVariants && selectedProduct.sizeStockVariants.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "900", marginBottom: "10px", textTransform: "uppercase", color: "#334155" }}>Stock per Combination:</h4>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))", gap: "8px" }}>
                  {selectedProduct.sizeStockVariants.map((item, i) => (
                    <div key={i} style={{ padding: "8px 12px", background: "#f0fdf4", borderRadius: "8px", border: "1px solid #bbf7d0", fontSize: "12px" }}>
                      <strong>{item.color ? `${item.color} (${item.size})` : `Size: ${item.size}`}</strong>: <span style={{ color: "#16a34a", fontWeight: "800" }}>{item.stock} left</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {selectedProduct.colorVariants && selectedProduct.colorVariants.length > 0 && (
              <div style={{ marginBottom: "20px" }}>
                <h4 style={{ fontSize: "13px", fontWeight: "900", marginBottom: "10px", textTransform: "uppercase", color: "#334155" }}>Color Variants & Photos:</h4>
                {selectedProduct.colorVariants.map((v, i) => (
                  <div key={i} style={{ marginBottom: "12px", padding: "10px", background: "#f8fafc", borderRadius: "10px", border: "1px solid #e2e8f0" }}>
                    <strong style={{ fontSize: "12px", color: "#0f172a" }}>Color: {v.color}</strong>
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))", gap: "8px", marginTop: "8px" }}>
                      {v.images?.map((img, imgIdx) => (
                        <img key={imgIdx} src={img} alt="" style={{ width: "100%", height: "80px", objectFit: "cover", borderRadius: "8px", border: "1px solid #cbd5e1" }} />
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            <h4 style={{ fontSize: "13px", fontWeight: "900", marginBottom: "12px", textTransform: "uppercase", color: "#334155" }}>Default Product Images:</h4>
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