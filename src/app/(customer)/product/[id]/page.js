"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "../../context/CartContext";

export default function ProductDetailPage({ params }) {
  // Promise ko unwrap karein
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

  // Selected Main Image State for Thumbnail Slider
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    // Saved Addresses fetch karein
    const saved = localStorage.getItem("customer_addresses");
    if (saved) {
      setAddresses(JSON.parse(saved));
    }

    // Product Data Fetch using unwrapped productId
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

  if (loading) return <div style={{ padding: "40px", textAlign: "center" }}>Loading Product...</div>;
  if (!product) return <div style={{ padding: "40px", textAlign: "center" }}>Product Nahi Mila!</div>;

  // Images Array handle karne ke liye (agar multiple images hain ya single imageUrl)
  const productImages = product.images?.length > 0 
    ? product.images 
    : [product.imageUrl || "https://via.placeholder.com/300"];

  const currentMainImage = productImages[selectedImageIndex] || productImages[0];

  return (
    <div style={{ maxWidth: "800px", margin: "32px auto", padding: "0 20px" }}>
      <button onClick={() => router.back()} style={{ background: "none", border: "none", color: "#2563eb", cursor: "pointer", fontWeight: "bold", marginBottom: "16px" }}>
        ← Back
      </button>

      <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", display: "flex", gap: "24px", flexWrap: "wrap" }}>
        
        {/* --- LEFT SIDE: Vertical Thumbnails + Main Image Layout --- */}
        <div style={{ display: "flex", gap: "12px" }}>
          {/* Vertical Thumbnails List */}
          {productImages.length > 1 && (
            <div style={{ display: "flex", flexDirection: "column", gap: "8px", maxHeight: "300px", overflowY: "auto", paddingRight: "4px" }}>
              {productImages.map((imgUrl, index) => (
                <img
                  key={index}
                  src={imgUrl}
                  alt={`Thumbnail ${index + 1}`}
                  onClick={() => setSelectedImageIndex(index)}
                  style={{
                    width: "55px",
                    height: "55px",
                    objectFit: "cover",
                    borderRadius: "8px",
                    cursor: "pointer",
                    border: selectedImageIndex === index ? "2px solid #2563eb" : "1px solid #e5e7eb",
                    opacity: selectedImageIndex === index ? 1 : 0.7,
                    transition: "all 0.2s ease"
                  }}
                />
              ))}
            </div>
          )}

          {/* Main Big Image View */}
          <img
            src={currentMainImage}
            alt={product.title}
            style={{ width: "280px", height: "300px", objectFit: "cover", borderRadius: "12px", border: "1px solid #f3f4f6" }}
          />
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
          <div>
            <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: "bold", textTransform: "uppercase" }}>{product.category}</span>
            <h1 style={{ fontSize: "22px", fontWeight: "bold", margin: "8px 0", color: "#111827" }}>{product.title}</h1>
            <p style={{ fontSize: "14px", color: "#6b7280" }}>{product.description}</p>
            <div style={{ fontSize: "24px", fontWeight: "bold", color: "#16a34a", margin: "16px 0" }}>₹{product.offerPrice}</div>
          </div>

          {/* Action Buttons */}
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <button
              onClick={handleBuyNowClick}
              style={{ width: "100%", backgroundColor: "#2563eb", color: "#fff", border: "none", padding: "14px", borderRadius: "10px", fontWeight: "bold", fontSize: "16px", cursor: "pointer" }}
            >
              ⚡ Buy Now
            </button>

            <button
              onClick={handleAddToCart}
              style={{
                width: "100%",
                backgroundColor: added ? "#16a34a" : "#fff",
                color: added ? "#fff" : "#374151",
                border: "2px solid #374151",
                padding: "12px",
                borderRadius: "10px",
                fontWeight: "bold",
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
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.6)", zIndex: 1000, display: "flex", justifyContent: "center", alignItems: "center", padding: "20px" }}>
          <div style={{ backgroundColor: "#fff", width: "100%", maxWidth: "500px", borderRadius: "16px", padding: "24px", boxShadow: "0 20px 25px -5px rgba(0,0,0,0.1)" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: "bold", margin: 0 }}>Select Delivery Address</h2>
              <button onClick={() => setShowAddressModal(false)} style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer" }}>✕</button>
            </div>

            {/* Address Options */}
            <div style={{ display: "flex", flexDirection: "column", gap: "12px", maxHeight: "250px", overflowY: "auto", marginBottom: "16px" }}>
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  style={{
                    display: "flex",
                    gap: "12px",
                    padding: "12px",
                    borderRadius: "8px",
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
                  <div style={{ fontSize: "13px", color: "#374151" }}>
                    <strong>{addr.name}</strong> ({addr.phone})<br />
                    {addr.street1}, {addr.city} - <strong>{addr.pincode}</strong>
                  </div>
                </label>
              ))}
            </div>

            {/* Total Bill Box */}
            <div style={{ padding: "12px", backgroundColor: "#f9fafb", borderRadius: "8px", display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px", border: "1px solid #e5e7eb" }}>
              <span style={{ fontSize: "14px", fontWeight: "600", color: "#374151" }}>Total Bill:</span>
              <span style={{ fontSize: "18px", fontWeight: "bold", color: "#16a34a" }}>₹{product.offerPrice}</span>
            </div>

            {/* Proceed Button */}
            <button
              onClick={handleProceedToCheckout}
              disabled={!selectedAddressId}
              style={{
                width: "100%",
                backgroundColor: selectedAddressId ? "#16a34a" : "#9ca3af",
                color: "#fff",
                border: "none",
                padding: "12px",
                borderRadius: "8px",
                fontWeight: "bold",
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