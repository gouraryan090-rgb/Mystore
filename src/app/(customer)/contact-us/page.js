"use client";

import { useRouter } from "next/navigation";

export default function ContactUsPage() {
  const router = useRouter();

  return (
    <div style={{ maxWidth: "650px", margin: "40px auto", padding: "0 20px" }}>
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        style={{
          background: "none",
          border: "none",
          color: "#2563eb",
          cursor: "pointer",
          fontWeight: "bold",
          fontSize: "14px",
          marginBottom: "16px",
        }}
      >
        ← Back
      </button>

      <div
        style={{
          backgroundColor: "#ffffff",
          borderRadius: "16px",
          padding: "32px",
          boxShadow: "0 1px 3px rgba(0,0,0,0.1)",
          border: "1px solid #e5e7eb",
        }}
      >
        <h1
          style={{
            fontSize: "24px",
            fontWeight: "800",
            color: "#111827",
            marginTop: 0,
            marginBottom: "16px",
          }}
        >
          📞 Contact Us
        </h1>

        {/* Intro Paragraph */}
        <p
          style={{
            fontSize: "15px",
            color: "#4b5563",
            lineHeight: "1.7",
            marginBottom: "28px",
          }}
        >
          Your shopping experience is our top priority! If you have any queries about a product, need help with order tracking, face any issues regarding payments or refunds, or want to share a suggestion with us, please feel free to reach out. Our support team is always ready to assist you completely. You can connect with us directly via the email or phone number provided below, and we will try to reply to you as soon as possible.
        </p>

        <hr style={{ border: "none", borderTop: "1px solid #f3f4f6", marginBottom: "24px" }} />

        {/* Contact Details */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {/* Email */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              backgroundColor: "#f9fafb",
              borderRadius: "10px",
              border: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontSize: "20px" }}>✉️</span>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>Email Support</div>
              <a
                href="mailto:zentrobazaar.shop@gmail.com"
                style={{
                  color: "#2563eb",
                  fontWeight: "bold",
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                zentrobazaar.shop@gmail.com
              </a>
            </div>
          </div>

          {/* Phone */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "12px",
              padding: "12px 16px",
              backgroundColor: "#f9fafb",
              borderRadius: "10px",
              border: "1px solid #f3f4f6",
            }}
          >
            <span style={{ fontSize: "20px" }}>📱</span>
            <div>
              <div style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>Phone / WhatsApp</div>
              <a
                href="tel:+917378200781"
                style={{
                  color: "#2563eb",
                  fontWeight: "bold",
                  fontSize: "15px",
                  textDecoration: "none",
                }}
              >
                +91 73782 00781
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}