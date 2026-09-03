"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function ProductDetailPage({ params }) {
  const resolvedParams = use(params);
  const productId = resolvedParams.id;

  const router = useRouter();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [addresses, setAddresses] = useState([]);
  const [selectedAddressId, setSelectedAddressId] = useState(null);
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [added, setAdded] = useState(false);

  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedColor, setSelectedColor] = useState(null);
  const [selectedSize, setSelectedSize] = useState(null);

  useEffect(() => {
    const saved = localStorage.getItem("customer_addresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success) {
          const prodData = data.data;
          setProduct(prodData);
          
          if (prodData.colorVariants && prodData.colorVariants.length > 0) {
            setSelectedColor(prodData.colorVariants[0].color);
          }
          if (prodData.sizes && prodData.sizes.length > 0) {
            setSelectedSize(prodData.sizes[0]);
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (productId) {
      fetchProduct();
    }
  }, [productId]);

  const getCurrentStock = () => {
    if (!product) return 0;

    if (product.sizeStockVariants && product.sizeStockVariants.length > 0) {
      const match = product.sizeStockVariants.find(
        (v) => (!v.size || v.size === selectedSize) && (!v.color || v.color === selectedColor)
      );
      if (match !== undefined) return match.stock;
    }

    if (selectedColor && product.colorVariants) {
      const colorVar = product.colorVariants.find((v) => v.color === selectedColor);
      if (colorVar && colorVar.stock !== undefined) {
        return colorVar.stock;
      }
    }

    return product.stock !== undefined ? product.stock : 10;
  };

  const currentStock = getCurrentStock();
  const isOutOfStock = currentStock <= 0;

  const handleBuyNowClick = () => {
    if (isOutOfStock) return;
    if (addresses.length === 0) {
      alert("Please go to the 'Edit Address' section and save at least one address!");
      router.push("/edit-address");
      return;
    }
    setShowAddressModal(true);
  };

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    const productWithVariants = {
      ...product,
      quantity: 1, // Explicitly set starting quantity to 1
      selectedColor,
      selectedSize,
      stock: currentStock,
    };
    addToCart(productWithVariants);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddressId || isOutOfStock) return;

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    const checkoutPayload = {
      product: {
        ...product,
        quantity: 1,
        selectedColor,
        selectedSize,
        stock: currentStock,
      },
      deliveryAddress: selectedAddr,
      totalBill: product.offerPrice,
    };

    localStorage.setItem("checkout_data", JSON.stringify(checkoutPayload));
    router.push("/checkout");
  };

  if (loading) return <div style={{ padding: "80px", textAlign: "center", color: "#64748b", fontWeight: "600" }}>Loading Product Details...</div>;
  if (!product) return <div style={{ padding: "80px", textAlign: "center", color: "#ef4444", fontWeight: "600" }}>Product Not Found!</div>;

  const activeVariant = product.colorVariants?.find((v) => v.color === selectedColor);
  const productImages = activeVariant?.images?.length > 0
    ? activeVariant.images
    : (product.images?.length > 0 ? product.images : [product.imageUrl || "https://via.placeholder.com/400"]);

  const currentMainImage = productImages[selectedImageIndex] || productImages[0];

  let discountPercent = 0;
  if (product.originalPrice && product.originalPrice > product.offerPrice) {
    discountPercent = Math.round(((product.originalPrice - product.offerPrice) / product.originalPrice) * 100);
  }

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px" }}>
      <div style={{ marginBottom: "24px" }}>
        <button 
          onClick={() => router.back()} 
          style={{ background: "none", border: "none", color: "#6366f1", cursor: "pointer", fontWeight: "700", fontSize: "14px", display: "inline-flex", alignItems: "center", gap: "6px", padding: 0 }}
        >
          ← Back to products
        </button>
      </div>

      <div 
        style={{ 
          backgroundColor: "#fff", 
          borderRadius: "28px", 
          border: "1px solid #f1f5f9", 
          boxShadow: "0 10px 40px -10px rgba(0,0,0,0.05)",
          padding: "40px",
          display: "grid",
          gridTemplateColumns: "1.1fr 1.2fr",
          gap: "40px",
          alignItems: "start"
        }}
      >
        <div style={{ display: "flex", gap: "20px" }}>
          {productImages.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", width: "80px", maxHeight: "420px", overflowY: "auto" }}>
              {productImages.map((imgUrl, index) => (
                <div
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    height: "80px",
                    borderRadius: "14px",
                    border: selectedImageIndex === index ? "2px solid #6366f1" : "1px solid #e2e8f0",
                    backgroundColor: "#f8fafc",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "6px",
                    cursor: "pointer",
                    overflow: "hidden",
                    transition: "all 0.2s"
                  }}
                >
                  <img src={imgUrl} alt="" style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }} />
                </div>
              ))}
            </div>
          )}

          <div 
            style={{ 
              flex: 1, 
              backgroundColor: "#f8fafc", 
              borderRadius: "24px", 
              height: "450px", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              padding: "30px",
              position: "relative",
              border: "1px solid #f1f5f9"
            }}
          >
            <img
              src={currentMainImage}
              alt={product.title}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#6366f1", backgroundColor: "#eef2ff", padding: "6px 14px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {product.category} {product.subCategory ? `> ${product.subCategory}` : ""}
            </span>
          </div>

          <h1 style={{ fontSize: "26px", fontWeight: "900", color: "#0f172a", margin: 0, lineHeight: "1.3" }}>
            {product.title}
          </h1>

          <div style={{ display: "flex", alignItems: "baseline", gap: "14px", marginTop: "4px" }}>
            <span style={{ fontSize: "32px", fontWeight: "900", color: "#059669" }}>₹{product.offerPrice}</span>
            {product.originalPrice && (
              <span style={{ fontSize: "18px", color: "#94a3b8", textDecoration: "line-through", fontWeight: "700" }}>
                ₹{product.originalPrice}
              </span>
            )}
            {discountPercent > 0 && (
              <span style={{ backgroundColor: "#dcfce7", color: "#16a34a", padding: "4px 10px", borderRadius: "8px", fontSize: "13px", fontWeight: "800" }}>
                {discountPercent}% OFF
              </span>
            )}
          </div>

          <div>
            {isOutOfStock ? (
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#ef4444", backgroundColor: "#fee2e2", padding: "4px 10px", borderRadius: "8px" }}>
                Out of Stock
              </span>
            ) : (
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#16a34a", backgroundColor: "#dcfce7", padding: "4px 10px", borderRadius: "8px" }}>
                Only {currentStock} left
              </span>
            )}
          </div>

          {product.colorVariants && product.colorVariants.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>
                Color: <span style={{ color: "#6366f1" }}>{selectedColor}</span>
              </span>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.colorVariants.map((variant, idx) => (
                  <button
                    key={idx}
                    onClick={() => {
                      setSelectedColor(variant.color);
                      setSelectedImageIndex(0);
                    }}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: selectedColor === variant.color ? "2px solid #6366f1" : "1px solid #cbd5e1",
                      backgroundColor: selectedColor === variant.color ? "#eef2ff" : "#fff",
                      color: "#0f172a",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer"
                    }}
                  >
                    {variant.color}
                  </button>
                ))}
              </div>
            </div>
          )}

          {product.sizes && product.sizes.length > 0 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              <span style={{ fontSize: "13px", fontWeight: "800", color: "#334155" }}>
                Size: <span style={{ color: "#6366f1" }}>{selectedSize}</span>
              </span>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                {product.sizes.map((size, idx) => (
                  <button
                    key={idx}
                    onClick={() => setSelectedSize(size)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "10px",
                      border: selectedSize === size ? "2px solid #6366f1" : "1px solid #cbd5e1",
                      backgroundColor: selectedSize === size ? "#eef2ff" : "#fff",
                      color: "#0f172a",
                      fontWeight: "700",
                      fontSize: "12px",
                      cursor: "pointer",
                      minWidth: "45px"
                    }}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div style={{ fontSize: "14px", color: "#475569", lineHeight: "1.6", backgroundColor: "#f8fafc", padding: "16px 20px", borderRadius: "16px", border: "1px solid #f1f5f9" }}>
            <strong style={{ display: "block", color: "#0f172a", marginBottom: "4px" }}>About this item:</strong>
            {product.description || "High quality standard item guaranteed."}
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginTop: "10px" }}>
            <button
              onClick={handleBuyNowClick}
              disabled={isOutOfStock}
              style={{
                width: "100%",
                backgroundColor: isOutOfStock ? "#94a3b8" : "#6366f1",
                color: "#fff",
                border: "none",
                padding: "16px",
                borderRadius: "16px",
                fontWeight: "800",
                fontSize: "16px",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              {isOutOfStock ? "Out of Stock" : "⚡ Buy Now"}
            </button>

            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock}
              style={{
                width: "100%",
                backgroundColor: isOutOfStock ? "#f1f5f9" : (added ? "#22c55e" : "#fff"),
                color: isOutOfStock ? "#94a3b8" : (added ? "#fff" : "#0f172a"),
                border: isOutOfStock ? "1px solid #cbd5e1" : (added ? "none" : "2px solid #e2e8f0"),
                padding: "16px",
                borderRadius: "16px",
                fontWeight: "800",
                fontSize: "16px",
                cursor: isOutOfStock ? "not-allowed" : "pointer",
              }}
            >
              {isOutOfStock ? "Unavailable" : (added ? "✓ Added to Cart Successfully!" : "🛒 Add to Cart")}
            </button>
          </div>
        </div>
      </div>

      {showAddressModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "480px", borderRadius: "24px", padding: "28px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Select Delivery Address</h2>
              <button onClick={() => setShowAddressModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#64748b" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "260px", overflowY: "auto", marginBottom: "20px" }}>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "14px",
                    borderRadius: "14px",
                    border: `2px solid ${selectedAddressId === addr.id ? "#6366f1" : "#e2e8f0"}`,
                    backgroundColor: selectedAddressId === addr.id ? "#eef2ff" : "#fff",
                    cursor: "pointer",
                  }}
                >
                  <input
                    type="radio"
                    name="address"
                    value={addr.id}
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <div style={{ fontSize: "13px", color: "#334155", lineHeight: "1.5" }}>
                    <strong>{addr.name}</strong> ({addr.phone})<br />
                    {addr.street1}, {addr.city} - <strong>{addr.pincode}</strong>
                  </div>
                </label>
              ))}
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedAddressId}
              style={{
                width: "100%",
                backgroundColor: selectedAddressId ? "#6366f1" : "#94a3b8",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "14px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: selectedAddressId ? "pointer" : "not-allowed",
              }}
            >
              Continue to Checkout →
            </button>
          </div>
        </div>
      )}
    </div>
  );
}