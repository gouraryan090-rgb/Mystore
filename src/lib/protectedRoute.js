"use client";
import { useState, useEffect } from "react";

export function useAdminProtect() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [pinInput, setPinInput] = useState("");
  const [passInput, setPassInput] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleAuthSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/admin/verify-pages", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ pinInput, passInput }),
});

      const data = await response.json();

      if (data.success) {
        sessionStorage.setItem("admin_auth", "true");
        setIsAuthenticated(true);
      } else {
        setError(data.message || "Verification fail ho gaya!");
      }
    } catch (err) {
      console.error("Verification error:", err);
      setError("Network error. Dobara koshish karein.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return null;

  if (!isAuthenticated) {
    return (
      <div style={{
        position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
        backgroundColor: "rgba(15, 23, 42, 0.95)", zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center", padding: "20px"
      }}>
        <div style={{
          backgroundColor: "#1e293b", padding: "32px", borderRadius: "16px",
          width: "100%", maxWidth: "400px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "12px" }}>🔐</div>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", marginBottom: "8px" }}>
            Admin Security Portal
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
            Secure access ke liye apna PIN aur Password dono darj karein.
          </p>

          <form onSubmit={handleAuthSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {/* PIN Input */}
            <input
              type="password"
              placeholder="Enter PIN"
              value={pinInput}
              onChange={(e) => setPinInput(e.target.value)}
              style={{
                padding: "12px", borderRadius: "8px", border: "1px solid #475569",
                backgroundColor: "#0f172a", color: "#fff", fontSize: "16px", outline: "none", textAlign: "center", letterSpacing: "2px"
              }}
              required
              autoFocus
            />

            {/* Password Input */}
            <input
              type="password"
              placeholder="Enter Password"
              value={passInput}
              onChange={(e) => setPassInput(e.target.value)}
              style={{
                padding: "12px", borderRadius: "8px", border: "1px solid #475569",
                backgroundColor: "#0f172a", color: "#fff", fontSize: "16px", outline: "none", textAlign: "center"
              }}
              required
            />

            <button
              type="submit"
              disabled={isSubmitting}
              style={{
                backgroundColor: "#2563eb", color: "#fff", border: "none",
                padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "15px", cursor: "pointer",
                opacity: isSubmitting ? 0.7 : 1, marginTop: "4px"
              }}
            >
              {isSubmitting ? "Verifying..." : "Verify & Unlock"}
            </button>
          </form>

          {error && (
            <p style={{ color: "#f87171", fontSize: "13px", marginTop: "12px", backgroundColor: "#7f1d1d", padding: "8px", borderRadius: "6px" }}>
              {error}
            </p>
          )}
        </div>
      </div>
    );
  }

  return null;
}