"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function SearchBar() {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && e.target.value.trim()) {
      router.push(`/?search=${encodeURIComponent(e.target.value.trim())}`);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("customer_user");
    window.location.href = "/";
  };

  return (
    <div style={{ display: "flex", alignItems: "center", gap: "12px", flex: "1", maxWidth: "550px" }}>
      {/* Search Input */}
      <input
        type="text"
        placeholder="Search any product..."
        onKeyDown={handleKeyDown}
        style={{
          flex: "1",
          padding: "10px 14px",
          borderRadius: "8px",
          border: "1px solid #d1d5db",
          fontSize: "14px",
          boxSizing: "border-box",
          outline: "none",
        }}
      />

      {/* Profile / Menu Icon Button */}
      <div style={{ position: "relative" }}>
        <button
          onClick={() => setShowMenu(!showMenu)}
          style={{
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            borderRadius: "50%",
            width: "40px",
            height: "40px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            cursor: "pointer",
            fontSize: "18px",
          }}
          title="User Options"
        >
          👤
        </button>

        {/* Options Dropdown */}
        {showMenu && (
          <div
            style={{
              position: "absolute",
              right: 0,
              top: "48px",
              backgroundColor: "#ffffff",
              border: "1px solid #e5e7eb",
              borderRadius: "12px",
              boxShadow: "0 10px 15px -3px rgba(0,0,0,0.1)",
              width: "180px",
              zIndex: 1000,
              overflow: "hidden",
              display: "flex",
              flexDirection: "column",
            }}
          >
            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/your-orders");
              }}
              style={{ padding: "12px 16px", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", fontSize: "14px", color: "#374151" }}
            >
              📦 Your Orders
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/edit-address");
              }}
              style={{ padding: "12px 16px", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", fontSize: "14px", color: "#374151" }}
            >
              🏠 Edit Address
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/edit-profile");
              }}
              style={{ padding: "12px 16px", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", fontSize: "14px", color: "#374151" }}
            >
              ✏️ Edit Profile
            </button>

            <button
              onClick={() => {
                setShowMenu(false);
                router.push("/contact-us");
              }}
              style={{ padding: "12px 16px", textAlign: "left", background: "none", border: "none", borderBottom: "1px solid #f3f4f6", cursor: "pointer", fontSize: "14px", color: "#374151" }}
            >
              📞 Contact Us
            </button>

            <button
              onClick={handleLogout}
              style={{ padding: "12px 16px", textAlign: "left", background: "none", border: "none", cursor: "pointer", fontSize: "14px", color: "#dc2626", fontWeight: "bold" }}
            >
              🚪 Log Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}