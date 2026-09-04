"use client";
import { useState, useEffect } from "react";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminInventoryPage() {
  const lockScreen = useAdminProtect();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);
  const [stockInputs, setStockInputs] = useState({});
  const [variantStockInputs, setVariantStockInputs] = useState({});
  const [successStatus, setSuccessStatus] = useState({});

  // Fetch products inventory
  const fetchInventory = async () => {
    try {
      const res = await fetch("/api/products");
      const data = await res.json();
      if (data.success) {
        setProducts(data.data);
        
        const initialInputs = {};
        const initialVariantInputs = {};

        data.data.forEach((p) => {
          initialVariantInputs[p._id] = {};

          let calculatedStock = p.stock ?? 10;

          // 1. Check sizeStockVariants
          if (p.sizeStockVariants && p.sizeStockVariants.length > 0) {
            let sum = 0;
            p.sizeStockVariants.forEach((v, index) => {
              const val = v.stock ?? 10;
              initialVariantInputs[p._id][`ssv-${index}`] = val;
              sum += Number(val);
            });
            calculatedStock = sum;
          }
          // 2. Check colorVariants
          else if (p.colorVariants && p.colorVariants.length > 0) {
            let sum = 0;
            p.colorVariants.forEach((cv, index) => {
              const val = cv.stock ?? 10;
              initialVariantInputs[p._id][`cv-${index}`] = val;
              sum += Number(val);
            });
            calculatedStock = sum;
          }

          initialInputs[p._id] = calculatedStock;
        });

        setStockInputs(initialInputs);
        setVariantStockInputs(initialVariantInputs);
      }
    } catch (err) {
      console.error("Error fetching inventory:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  // Handle variant input change and auto-update overall stock sum
  const handleVariantInputChange = (productId, key, value, product) => {
    const updatedVariants = {
      ...(variantStockInputs[productId] || {}),
      [key]: value,
    };

    setVariantStockInputs((prev) => ({
      ...prev,
      [productId]: updatedVariants,
    }));

    // Automatically recalculate overall stock sum based on all variants
    let newSum = 0;
    const hasSSV = product.sizeStockVariants && product.sizeStockVariants.length > 0;
    const hasCV = product.colorVariants && product.colorVariants.length > 0;

    if (hasSSV) {
      product.sizeStockVariants.forEach((_, index) => {
        const val = updatedVariants[`ssv-${index}`];
        newSum += Number(val !== undefined ? val : 0);
      });
    } else if (hasCV) {
      product.colorVariants.forEach((_, index) => {
        const val = updatedVariants[`cv-${index}`];
        newSum += Number(val !== undefined ? val : 0);
      });
    }

    setStockInputs((prev) => ({
      ...prev,
      [productId]: newSum,
    }));
  };

  const handleManualStockChange = (id, value) => {
    setStockInputs((prev) => ({ ...prev, [id]: value }));
  };

  // Update stock API call
  const handleUpdateStock = async (product) => {
    const productId = product._id;
    const newStock = Number(stockInputs[productId]);
    
    if (isNaN(newStock) || newStock < 0) {
      alert("Please enter a valid stock number.");
      return;
    }

    let updatedPayload = { stock: newStock };

    const hasSSV = product.sizeStockVariants && product.sizeStockVariants.length > 0;
    const hasCV = product.colorVariants && product.colorVariants.length > 0;

    if (hasSSV) {
      updatedPayload.sizeStockVariants = product.sizeStockVariants.map((v, index) => ({
        ...v,
        stock: Number(variantStockInputs[productId]?.[`ssv-${index}`] ?? v.stock ?? 10),
      }));
    }

    if (hasCV) {
      updatedPayload.colorVariants = product.colorVariants.map((cv, index) => ({
        ...cv,
        stock: Number(variantStockInputs[productId]?.[`cv-${index}`] ?? cv.stock ?? 10),
      }));
    }

    setUpdatingId(productId);
    try {
      const res = await fetch(`/api/products/${productId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedPayload),
      });
      const data = await res.json();

      if (res.ok) {
        // Show inline green success status instead of alert popup
        setSuccessStatus((prev) => ({ ...prev, [productId]: true }));
        setTimeout(() => {
          setSuccessStatus((prev) => ({ ...prev, [productId]: false }));
        }, 3000);
      } else {
        alert(data.message || "Failed to update stock");
      }
    } catch (err) {
      console.error("Error updating stock:", err);
      alert("Something went wrong!");
    } finally {
      setUpdatingId(null);
    }
  };

  if (lockScreen) return lockScreen;

  if (loading) {
    return (
      <div style={{ padding: "40px", textAlign: "center", fontSize: "16px", fontWeight: "600", color: "#64748b" }}>
        Loading Inventory Variants...
      </div>
    );
  }

  return (
    <div style={{ padding: "30px", maxWidth: "1300px", margin: "0 auto", fontFamily: "system-ui, sans-serif" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "24px", fontWeight: "900", color: "#0f172a", margin: "0 0 6px 0" }}>
            📦 Admin Inventory & Auto-Stock Sync
          </h1>
          <p style={{ margin: 0, fontSize: "14px", color: "#64748b" }}>
            Variant products auto-calculate total stock. Non-variant products support manual stock entry.
          </p>
        </div>
      </div>

      <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 4px 20px -2px rgba(0,0,0,0.03)" }}>
        <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
          <thead>
            <tr style={{ backgroundColor: "#f8fafc", borderBottom: "1px solid #e2e8f0", fontSize: "13px", color: "#475569" }}>
              <th style={{ padding: "16px", fontWeight: "700" }}>Product</th>
              <th style={{ padding: "16px", fontWeight: "700" }}>Category</th>
              <th style={{ padding: "16px", fontWeight: "700" }}>Price</th>
              <th style={{ padding: "16px", fontWeight: "700" }}>Variant Stock Breakdown</th>
              <th style={{ padding: "16px", fontWeight: "700" }}>Overall Stock</th>
              <th style={{ padding: "16px", fontWeight: "700" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {products.length > 0 ? (
              products.map((p) => {
                const hasSSV = p.sizeStockVariants && p.sizeStockVariants.length > 0;
                const hasCV = p.colorVariants && p.colorVariants.length > 0;
                const hasSizes = p.sizes && p.sizes.length > 0;
                const isVariantProduct = hasSSV || hasCV;

                return (
                  <tr key={p._id} style={{ borderBottom: "1px solid #f1f5f9", fontSize: "14px", verticalAlign: "top" }}>
                    
                    {/* Product Column */}
                    <td style={{ padding: "16px", display: "flex", alignItems: "center", gap: "12px" }}>
                      <div style={{ width: "40px", height: "40px", backgroundColor: "#f8fafc", borderRadius: "8px", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden", flexShrink: 0 }}>
                        <img
                          src={p.images?.[0] || p.imageUrl || "https://via.placeholder.com/40"}
                          alt={p.title}
                          style={{ width: "100%", height: "100%", objectFit: "contain" }}
                        />
                      </div>
                      <div>
                        <div style={{ fontWeight: "700", color: "#0f172a", maxWidth: "200px", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                          {p.title}
                        </div>
                      </div>
                    </td>

                    {/* Category */}
                    <td style={{ padding: "16px", color: "#64748b", fontWeight: "600" }}>{p.category || "N/A"}</td>

                    {/* Price */}
                    <td style={{ padding: "16px", fontWeight: "700", color: "#059669", whiteSpace: "nowrap" }}>₹{p.offerPrice}</td>

                    {/* Variant Breakdown Column */}
                    <td style={{ padding: "16px", minWidth: "260px" }}>
                      {hasSSV ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569" }}>Size & Color Combinations:</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {p.sizeStockVariants.map((v, index) => (
                              <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f8fafc", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#334155" }}>
                                  {v.size} {v.color ? `(${v.color})` : ""}:
                                </span>
                                <input
                                  type="number"
                                  value={variantStockInputs[p._id]?.[`ssv-${index}`] ?? ""}
                                  onChange={(e) => handleVariantInputChange(p._id, `ssv-${index}`, e.target.value, p)}
                                  style={{ width: "45px", padding: "2px 4px", fontSize: "12px", fontWeight: "700", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", outline: "none" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : hasCV ? (
                        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569" }}>Color Variants:</span>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
                            {p.colorVariants.map((cv, index) => (
                              <div key={index} style={{ display: "flex", alignItems: "center", gap: "4px", backgroundColor: "#f8fafc", padding: "4px 8px", borderRadius: "6px", border: "1px solid #cbd5e1" }}>
                                <span style={{ fontSize: "11px", fontWeight: "700", color: "#334155" }}>{cv.color || "Color"}:</span>
                                <input
                                  type="number"
                                  value={variantStockInputs[p._id]?.[`cv-${index}`] ?? ""}
                                  onChange={(e) => handleVariantInputChange(p._id, `cv-${index}`, e.target.value, p)}
                                  style={{ width: "45px", padding: "2px 4px", fontSize: "12px", fontWeight: "700", borderRadius: "4px", border: "1px solid #cbd5e1", textAlign: "center", outline: "none" }}
                                />
                              </div>
                            ))}
                          </div>
                        </div>
                      ) : hasSizes ? (
                        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                          <span style={{ fontSize: "11px", fontWeight: "800", color: "#475569" }}>Sizes:</span>
                          <span style={{ fontSize: "12px", color: "#0f172a", fontWeight: "600" }}>{p.sizes.join(", ")}</span>
                        </div>
                      ) : (
                        <span style={{ fontSize: "12px", color: "#94a3b8", fontStyle: "italic" }}>No variants (General Product)</span>
                      )}
                    </td>

                    {/* Overall Stock */}
                    <td style={{ padding: "16px", whiteSpace: "nowrap" }}>
                      <input
                        type="number"
                        value={stockInputs[p._id] ?? ""}
                        readOnly={isVariantProduct}
                        onChange={(e) => handleManualStockChange(p._id, e.target.value)}
                        style={{
                          width: "75px",
                          padding: "8px 10px",
                          borderRadius: "8px",
                          border: "1px solid #cbd5e1",
                          fontSize: "14px",
                          fontWeight: "700",
                          outline: "none",
                          backgroundColor: isVariantProduct ? "#f1f5f9" : "#fff",
                          color: isVariantProduct ? "#475569" : "#0f172a",
                          cursor: isVariantProduct ? "not-allowed" : "text"
                        }}
                        title={isVariantProduct ? "Auto-calculated from variant quantities" : "Manual stock entry"}
                      />
                      {isVariantProduct && (
                        <div style={{ fontSize: "9px", color: "#6366f1", fontWeight: "700", marginTop: "2px" }}>Auto-calculated</div>
                      )}
                    </td>

                    {/* Action & Inline Green Success Status */}
                    <td style={{ padding: "16px", whiteSpace: "nowrap" }}>
                      <button
                        onClick={() => handleUpdateStock(p)}
                        disabled={updatingId === p._id}
                        style={{
                          backgroundColor: "#6366f1",
                          color: "#fff",
                          border: "none",
                          padding: "8px 16px",
                          borderRadius: "8px",
                          fontWeight: "700",
                          fontSize: "13px",
                          cursor: "pointer",
                          opacity: updatingId === p._id ? 0.7 : 1,
                        }}
                      >
                        {updatingId === p._id ? "Saving..." : "Update"}
                      </button>
                      
                      {successStatus[p._id] && (
                        <div style={{ fontSize: "11px", fontWeight: "800", color: "#16a34a", marginTop: "6px" }}>
                          ✓ Updated Successfully
                        </div>
                      )}
                    </td>

                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ padding: "40px", textAlign: "center", color: "#64748b" }}>
                  No products found in inventory.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}