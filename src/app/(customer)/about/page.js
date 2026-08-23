"use client";

import { useRouter } from "next/navigation";

export default function AboutUsPage() {
  const router = useRouter();

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", paddingBottom: "60px", color: "#0f172a" }}>
      
      {/* --- HERO SECTION --- */}
      <div 
        style={{ 
          backgroundColor: "#f8fafc", 
          borderRadius: "28px", 
          border: "1px solid #f1f5f9", 
          padding: "50px 40px",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          gap: "40px",
          alignItems: "center",
          marginBottom: "40px"
        }}
      >
        <div>
          <span style={{ fontSize: "12px", fontWeight: "800", color: "#6366f1", backgroundColor: "#eef2ff", padding: "6px 14px", borderRadius: "20px", textTransform: "uppercase", letterSpacing: "0.5px" }}>
            About ZentroBazaar
          </span>
          <h1 style={{ fontSize: "42px", fontWeight: "900", color: "#0f172a", margin: "16px 0", lineHeight: "1.2" }}>
            Shopping, Made <span style={{ color: "#6366f1" }}>Simple.</span>
          </h1>
          <p style={{ fontSize: "16px", color: "#475569", lineHeight: "1.7", marginBottom: "24px" }}>
            At ZENTROBAZAAR, we believe online shopping should be easy, secure and enjoyable for everyone. We bring you a wide range of quality products at fair prices, right at your doorstep.
          </p>
          <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "14px", color: "#334155" }}>
              <span style={{ color: "#6366f1" }}>🛡️</span> Trusted
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "14px", color: "#334155" }}>
              <span style={{ color: "#6366f1" }}>✨</span> Transparent
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "8px", fontWeight: "700", fontSize: "14px", color: "#334155" }}>
              <span style={{ color: "#6366f1" }}>🔒</span> Secure
            </div>
          </div>
        </div>

        <div style={{ backgroundColor: "#fff", borderRadius: "20px", padding: "30px", border: "1px solid #e2e8f0", textAlign: "center", boxShadow: "0 10px 30px rgba(0,0,0,0.03)" }}>
          <div style={{ fontSize: "60px", marginBottom: "15px" }}>🛍️</div>
          <h3 style={{ fontSize: "20px", fontWeight: "800", margin: "0 0 10px 0" }}>Your Direct Marketplace</h3>
          <p style={{ fontSize: "14px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>
            Curated collections, quality checked items, and a smooth checkout experience built just for you.
          </p>
        </div>
      </div>

      {/* --- WHO WE ARE & GENUINE HIGHLIGHTS --- */}
      <div 
        style={{ 
          display: "grid", 
          gridTemplateColumns: "1.1fr 2fr", 
          gap: "30px", 
          marginBottom: "40px",
          alignItems: "stretch"
        }}
      >
        <div style={{ backgroundColor: "#fff", padding: "32px", borderRadius: "24px", border: "1px solid #f1f5f9", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
          <h3 style={{ fontSize: "20px", fontWeight: "900", margin: "0 0 16px 0", color: "#0f172a" }}>Who We Are</h3>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: "0 0 16px 0" }}>
            ZENTROBAZAAR is a modern online marketplace dedicated to offering standard products across multiple categories. Our mission is to deliver an exceptional shopping experience with quality you can trust and service you can rely on.
          </p>
          <p style={{ fontSize: "14px", color: "#475569", lineHeight: "1.7", margin: 0 }}>
            From everyday essentials to the latest trends, we’ve got everything you need in one place.
          </p>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>📦</div>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 6px 0" }}>Quality Products</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>Handpicked items across multiple useful categories.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>🤝</div>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 6px 0" }}>Customer Trust</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>Dedicated support to assist you at every single step.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "24px", border: "1px solid #f1f5f9", textAlign: "center", boxShadow: "0 4px 20px rgba(0,0,0,0.02)" }}>
            <div style={{ fontSize: "28px", marginBottom: "10px" }}>⚡</div>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "0 0 6px 0" }}>Fast Processing</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>Swift order preparation and reliable delivery system.</p>
          </div>
        </div>
      </div>

      {/* --- WHY CHOOSE US --- */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "24px" }}>Why Choose ZENTROBAZAAR?</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))", gap: "20px" }}>
          
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9", textAlign: "left" }}>
            <div style={{ background: "#eef2ff", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>🛡️</div>
            <h4 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 6px 0" }}>Authentic Products</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>All products are carefully selected and verified for quality standards.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9", textAlign: "left" }}>
            <div style={{ background: "#f0fdf4", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>🏷️</div>
            <h4 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 6px 0" }}>Best Prices</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>We offer competitive prices with genuine deals every single day.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9", textAlign: "left" }}>
            <div style={{ background: "#fff7ed", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>🚚</div>
            <h4 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 6px 0" }}>Fast Delivery</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>Quick and reliable shipping directly to your doorstep.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9", textAlign: "left" }}>
            <div style={{ background: "#f0f9ff", width: "40px", height: "40px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "14px" }}>🔄</div>
            <h4 style={{ fontSize: "15px", fontWeight: "800", margin: "0 0 6px 0" }}>Easy Returns</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>Hassle-free support and simple return options when needed.</p>
          </div>

        </div>
      </div>

      {/* --- OUR MISSION BANNER --- */}
      <div 
        style={{ 
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)", 
          borderRadius: "24px", 
          padding: "40px", 
          color: "#fff", 
          textAlign: "center",
          marginBottom: "40px",
          boxShadow: "0 10px 30px rgba(99, 102, 241, 0.3)"
        }}
      >
        <div style={{ fontSize: "36px", marginBottom: "10px" }}>🎯</div>
        <span style={{ fontSize: "12px", fontWeight: "800", textTransform: "uppercase", letterSpacing: "1px", opacity: 0.9 }}>Our Mission</span>
        <h2 style={{ fontSize: "24px", fontWeight: "900", margin: "10px 0 14px 0" }}>
          Making online shopping easier, safer and more accessible for everyone.
        </h2>
        <p style={{ fontSize: "14px", maxWidth: "600px", margin: "0 auto", opacity: 0.9, lineHeight: "1.6" }}>
          We continuously work to improve our platform, expand our product range, and provide outstanding customer service every step of the way.
        </p>
      </div>

      {/* --- HOW WE WORK --- */}
      <div style={{ marginBottom: "40px", textAlign: "center" }}>
        <h2 style={{ fontSize: "24px", fontWeight: "900", marginBottom: "24px" }}>How We Work</h2>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "20px" }}>
          
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
            <span style={{ background: "#eef2ff", color: "#6366f1", fontWeight: "900", padding: "4px 10px", borderRadius: "8px", fontSize: "12px" }}>1</span>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "14px 0 6px 0" }}>Discover</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>Browse products across categories and find what you love.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
            <span style={{ background: "#eef2ff", color: "#6366f1", fontWeight: "900", padding: "4px 10px", borderRadius: "8px", fontSize: "12px" }}>2</span>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "14px 0 6px 0" }}>Choose</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>Add to cart and place your order in just a few clicks.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
            <span style={{ background: "#eef2ff", color: "#6366f1", fontWeight: "900", padding: "4px 10px", borderRadius: "8px", fontSize: "12px" }}>3</span>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "14px 0 6px 0" }}>Order</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>We pack your order with care and ship it fast.</p>
          </div>

          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "20px", border: "1px solid #f1f5f9" }}>
            <span style={{ background: "#eef2ff", color: "#6366f1", fontWeight: "900", padding: "4px 10px", borderRadius: "8px", fontSize: "12px" }}>4</span>
            <h4 style={{ fontSize: "16px", fontWeight: "800", margin: "14px 0 6px 0" }}>Enjoy</h4>
            <p style={{ fontSize: "13px", color: "#64748b", margin: 0, lineHeight: "1.4" }}>Receive your order and enjoy a smooth shopping experience.</p>
          </div>

        </div>
      </div>

      {/* --- READY TO EXPLORE FOOTER BANNER --- */}
      <div 
        style={{ 
          backgroundColor: "#0f172a", 
          borderRadius: "24px", 
          padding: "40px", 
          color: "#fff", 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          flexWrap: "wrap",
          gap: "20px"
        }}
      >
        <div>
          <h3 style={{ fontSize: "22px", fontWeight: "900", margin: "0 0 6px 0" }}>Ready to explore?</h3>
          <p style={{ fontSize: "14px", color: "#94a3b8", margin: 0 }}>Shop from our curated selection of quality items today.</p>
        </div>
        <button
          onClick={() => router.push("/")}
          style={{
            backgroundColor: "#6366f1",
            color: "#fff",
            border: "none",
            padding: "12px 24px",
            borderRadius: "14px",
            fontWeight: "800",
            fontSize: "14px",
            cursor: "pointer",
            boxShadow: "0 4px 12px rgba(99, 102, 241, 0.4)"
          }}
        >
          Shop Now →
        </button>
      </div>

    </div>
  );
}