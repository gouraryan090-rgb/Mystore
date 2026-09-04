// src/components/WhatsAppButton.jsx
"use client";

import React from "react";

export default function WhatsAppButton() {
  const phoneNumber = "918233547107"; // Apna WhatsApp aur Calling number yahan daal dein
  const message = encodeURIComponent("Hello Zentrobazaar, I need some help with a product.");

  return (
    <div style={{ position: "fixed", bottom: "24px", right: "24px", zIndex: 99999, display: "flex", flexDirection: "column", gap: "12px" }}>
      {/* Call Button */}
      <a
        href={`tel:${phoneNumber}`}
        style={{
          backgroundColor: "#fff",
          width: "50px",
          height: "50px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
          textDecoration: "none",
          border: "1px solid #e2e8f0",
          overflow: "hidden"
        }}
        title="Call Us"
      >
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS831Hz-_oYTxrH5HDMI0rpLTC-tKJTWVdbiI28yJ658g&s=10" 
          alt="Call" 
          style={{ width: "26px", height: "26px", objectFit: "contain" }}
        />
      </a>

      {/* WhatsApp Chat Button */}
      <a
        href={`https://wa.me/${phoneNumber}?text=${message}`}
        target="_blank"
        rel="noopener noreferrer"
        style={{
          backgroundColor: "#fff",
          width: "55px",
          height: "55px",
          borderRadius: "50%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 6px 16px rgba(37, 211, 102, 0.3)",
          textDecoration: "none",
          border: "1px solid #e2e8f0",
          overflow: "hidden"
        }}
        title="Chat on WhatsApp"
      >
        <img 
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTS2ox5zNKfPyvwx8s3_Sy7lCBhJiBdQY-2w1WRyfyTJg&s=10" 
          alt="WhatsApp" 
          style={{ width: "32px", height: "32px", objectFit: "contain" }}
        />
      </a>
    </div>
  );
}