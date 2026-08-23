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

  useEffect(() => {
    const saved = localStorage.getItem("customer_addresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
    }

    const fetchProduct = async () => {
      try {
        const res = await fetch(`/api/products/${productId}`);
        const data = await res.json();
        if (data.success) setProduct(data.data);
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

  const handleBuyNowClick = () => {
    if (addresses.length === 0) {
      alert("Pehle 'Edit Address' section me jaakar kam se kam 1 address save karein!");
      router.push("/edit-address");
      return;
    }
    setShowAddressModal(true);
  };

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleProceedToCheckout = () => {
    if (!selectedAddressId) return;

    const selectedAddr = addresses.find((a) => a.id === selectedAddressId);
    const checkoutPayload = {
      product: product,
      deliveryAddress: selectedAddr,
      totalBill: product.offerPrice,
    };

    localStorage.setItem("checkout_data", JSON.stringify(checkoutPayload));
    router.push("/checkout");
  };

  if (loading) return <div style={{ padding: "60px", textAlign: "center", color: "#6b7280", fontWeight: "600" }}>Loading Product Details...</div>;
  if (!product) return <div style={{ padding: "60px", textAlign: "center", color: "#6b7280", fontWeight: "600" }}>Product Nahi Mila!</div>;

  const productImages = product.images?.length > 0 
    ? product.images 
    : [product.imageUrl || "https://via.placeholder.com/300"];

  const currentMainImage = productImages[selectedImageIndex] || productImages[0];

  return (
    <div style={{ maxWidth: "1000px", margin: "40px auto", padding: "0 20px", fontFamily: "system-ui, -apple-system, sans-serif" }}>
      <button 
        onClick={() => router.back()} 
        style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "700", fontSize: "15px", marginBottom: "20px", display: "flex", alignItems: "center", gap: "6px" }}
      >
        ← Back to products
      </button>

      <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "20px", border: "1px solid #e5e7eb", display: "flex", gap: "36px", flexWrap: "wrap", boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)" }}>
        
        {/* --- LEFT SIDE: Thumbnails + Modern Main Image Container --- */}
        <div style={{ display: "flex", gap: "16px", flex: "1 1 400px" }}>
          {productImages.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxHeight: "380px", overflowY: "auto", paddingRight: "4px" }}>
              {productImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    width: "64px",
                    height: "64px",
                    objectFit: "cover",
                    borderRadius: "10px",
                    cursor: "pointer",
                    border: selectedImageIndex === index ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    opacity: selectedImageIndex === index ? 1 : 0.6,
                    transition: "all 0.2s ease"
                  }}
                />
              ))}
            </div>
          )}

          <div style={{ flex: 1, backgroundColor: "#f3f4f6", height: "380px", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", padding: "16px", position: "relative" }}>
            <img
              src={currentMainImage}
              alt={product.title}
              style={{ maxWidth: "100%", maxHeight: "100%", objectFit: "contain", mixBlendMode: "multiply" }}
            />
          </div>
        </div>

        {/* --- RIGHT SIDE: Product Info & Actions --- */}
        <div style={{ flex: "1 1 350px", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            {/* Category & Sub-Category displayed at the top */}
            <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.5px" }}>
              {product.category} {product.subCategory ? `> ${product.subCategory}` : ""}
            </span>
            <h1 style={{ fontSize: "24px", fontWeight: "800", margin: "10px 0 12px 0", color: "#111827", lineHeight: "1.3" }}>
              {product.title}
            </h1>
            <p style={{ fontSize: "14px", color: "#6b7280", lineHeight: "1.6", marginBottom: "20px" }}>
              {product.description}
            </p>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px", marginBottom: "24px" }}>
              <span style={{ fontSize: "28px", fontWeight: "900", color: "#059669" }}>₹{product.offerPrice}</span>
              {product.originalPrice && (
                <span style={{ fontSize: "16px", color: "#9ca3af", textDecoration: "line-through", fontWeight: "500" }}>
                  ₹{product.originalPrice}
                </span>
              )}
            </div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            <button
              onClick={handleBuyNowClick}
              style={{ width: "100%", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", fontSize: "16px", cursor: "pointer", boxShadow: "0 4px 12px rgba(37,99,235,0.2)", transition: "background 0.2s" }}
            >
              ⚡ Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                backgroundColor: added ? "#059669" : "#fff",
                color: added ? "#fff" : "#111827",
                border: "2px solid #111827",
                padding: "13px",
                borderRadius: "12px",
                fontWeight: "700",
                fontSize: "15px",
                cursor: "pointer",
                transition: "all 0.2s",
              }}
            >
              {added ? "✓ Added to Cart!" : "🛒 Add to Cart"}
            </button>
          </div>
        </div>
      </div>

      {/* Address Selection Modal */}
      {showAddressModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.7)", backdropFilter: "blur(4px)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "480px", borderRadius: "20px", padding: "28px", boxShadow: "0 25px 50px -12px rgba(0,0,0,0.25)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "800", color: "#111827", margin: 0 }}>Select Delivery Address</h2>
              <button onClick={() => setShowAddressModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#6b7280" }}>✕</button>
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "260px", overflowY: "auto", marginBottom: "20px" }}>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "14px",
                    borderRadius: "12px",
                    border: `2px solid ${selectedAddressId === addr.id ? "#2563eb" : "#e5e7eb"}`,
                    backgroundColor: selectedAddressId === addr.id ? "#eff6ff" : "#fff",
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
                  <div style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5" }}>
                    <strong>{addr.name}</strong> ({addr.phone})<br />
                    {addr.street1}, {addr.city} - <strong>{addr.pincode}</strong>
                  </div>
                </label>
              ))}
            </div>

            <div style={{ padding: "14px", backgroundColor: "#f9fafb", borderRadius: "12px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px", border: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Total Bill:</span>
              <span style={{ fontSize: "20px", fontWeight: "900", color: "#059669" }}>₹{product.offerPrice}</span>
            </div>

            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedAddressId}
              style={{
                width: "100%",
                backgroundColor: selectedAddressId ? "#059669" : "#9ca3af",
                color: "#fff",
                border: "none",
                padding: "14px",
                borderRadius: "12px",
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