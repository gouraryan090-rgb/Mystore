"use client";
import { useState, useEffect } from "react";
import FaceLockModal from "@/components/FaceLockModal"; // Yahan FaceLockModal import kiya

export function useAdminProtect() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [showPinScreen, setShowPinScreen] = useState(false); // Mode switch karne ke liye (Face vs PIN)
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    // Check if already authenticated in this session
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  // 1. PIN / Password verification handler
  const handlePinSubmit = (e) => {
    e.preventDefault();
    const ADMIN_SECRET = "123456" || process.env.NEXT_PUBLIC_ADMIN_PIN; 

    if (pinInput === ADMIN_SECRET) {
      sessionStorage.setItem("admin_auth", "true");
      setIsAuthenticated(true);
      setError("");
    } else {
      setError("Galat PIN ya Password hai! Dobara koshish karein.");
    }
  };

  // Jab Face se successfully unlock ho jaye
  const handleFaceUnlock = () => {
    sessionStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
  };

  if (loading) return null;

  // Agar user authenticated nahi hai
  if (!isAuthenticated) {
    // Agar user ne "PIN se login" select kiya hai toh PIN screen dikhegi
    if (showPinScreen) {
      return (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(15, 23, 42, 0.9)", zIndex: 9999,
          display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
        }}>
          <div style={{
            backgroundColor: "#1e293b", padding: "32px", borderRadius: "16px",
            width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
          }}>
            <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔐</div>
            <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
              Admin PIN / Password
            </h2>
            <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
              Secure access ke liye apna PIN darj karein.
            </p>

            <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <input
                type="password"
                placeholder="Enter PIN (e.g. 123456)"
                value={pinInput}
                onChange={(e) => setPinInput(e.target.value)}
                style={{
                  padding: "12px", borderRadius: "8px", border: "1px solid #475569",
                  backgroundColor: "#0f172a", color: "#fff", fontSize: "16px", outline: "none", textAlign: "center", letterSpacing: "2px"
                }}
                required
              />
              <button
                type="submit"
                style={{
                  backgroundColor: "#2563eb", color: "#fff", border: "none",
                  padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: "pointer"
                }}
              >
                Verify PIN
              </button>
            </form>

            {error && (
              <p style={{ color: "#f87171", fontSize: "13px", marginTop: "12px", backgroundColor: "#7f1d1d", padding: "6px", borderRadius: "6px" }}>
                {error}
              </p>
            )}

            <button
              onClick={() => setShowPinScreen(false)}
              style={{
                marginTop: "16px", background: "none", border: "none", color: "#38bdf8",
                fontSize: "13px", cursor: "pointer", textDecoration: "underline"
              }}
            >
              ← Face Recognition par wapas jayein
            </button>
          </div>
        </div>
      );
    }

    // Default: Face Lock Modal show hoga
    return (
      <FaceLockModal 
        onUnlock={handleFaceUnlock} 
        onSwitchToPin={() => setShowPinScreen(true)} 
      />
    );
  }

  return null;
}