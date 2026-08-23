"use client";
import { useState } from "react";

export default function AdminLockModal({ onSuccess }) {
  const [password, setPassword] = useState("");
  const [pin, setPin] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleVerify = async (e) => {
    e.preventDefault();
    setError("");

    if (!password || !pin) {
      setError("Password aur 6-digit PIN dono dalna zaroori hai!");
      return;
    }

    if (pin.length !== 6) {
      setError("PIN strictly 6 digits ka hona chahiye!");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/admin/verify-pages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, pin }),
      });

      const data = await res.json();

      if (data.success) {
        if (onSuccess) onSuccess();
        else window.location.reload(); // Page reload hote hi cookie mil jayegi aur page khul jayega
      } else {
        setError(data.error || "Galat Password ya PIN!");
      }
    } catch (err) {
      console.error(err);
      setError("Server error ho gaya.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{
      position: "fixed",
      top: 0,
      left: 0,
      width: "100vw",
      height: "100vh",
      backgroundColor: "rgba(15, 23, 42, 0.75)",
      backdropFilter: "blur(4px)",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 9999,
      fontFamily: "system-ui, sans-serif"
    }}>
      <div style={{
        backgroundColor: "#ffffff",
        padding: "32px",
        borderRadius: "16px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
        boxSizing: "border-box"
      }}>
        <h2 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", marginBottom: "8px", textAlign: "center" }}>
          🔒 Admin Pages Locked
        </h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px", textAlign: "center" }}>
          Is page ko access karne ke liye Password aur 6-digit PIN enter karein.
        </p>

        {error && (
          <div style={{ backgroundColor: "#fef2f2", color: "#dc2626", padding: "10px 14px", borderRadius: "8px", marginBottom: "16px", fontSize: "13px", border: "1px solid #fecaca" }}>
            {error}
          </div>
        )}

        <form onSubmit={handleVerify} style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "750", color: "#334155", marginBottom: "6px" }}>
              Password:
            </label>
            <input
              type="password"
              placeholder="Enter Admin Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", boxSizing: "border-box" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "750", color: "#334155", marginBottom: "6px" }}>
              6-Digit PIN:
            </label>
            <input
              type="password"
              maxLength={6}
              placeholder="123456"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              style={{ width: "100%", padding: "12px", borderRadius: "8px", border: "1px solid #cbd5e1", fontSize: "14px", letterSpacing: "4px", textAlign: "center", fontWeight: "bold", boxSizing: "border-box" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{
              backgroundColor: "#2563eb",
              color: "#fff",
              border: "none",
              padding: "12px",
              borderRadius: "8px",
              fontWeight: "bold",
              fontSize: "15px",
              cursor: "pointer",
              marginTop: "8px"
            }}
          >
            {loading ? "Verifying..." : "Unlock Page"}
          </button>
        </form>
      </div>
    </div>
  );
}