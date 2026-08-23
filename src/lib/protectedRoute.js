"use client";
import { useState, useEffect } from "react";
import FingerprintLockModal from "@/components/FingerprintLockModal";
import FaceLockModal from "@/components/FaceLockModal";

export function useAdminProtect() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [currentMode, setCurrentMode] = useState("select"); // "select" | "fingerprint" | "face" | "pin"
  const [pinInput, setPinInput] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    const authStatus = sessionStorage.getItem("admin_auth");
    if (authStatus === "true") {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleUnlock = () => {
    sessionStorage.setItem("admin_auth", "true");
    setIsAuthenticated(true);
    setError("");
  };

  const handlePinSubmit = (e) => {
    e.preventDefault();
    const ADMIN_SECRET = "123456" || process.env.NEXT_PUBLIC_ADMIN_PIN; 

    if (pinInput === ADMIN_SECRET) {
      handleUnlock();
    } else {
      setError("Galat PIN ya Password hai! Dobara koshish karein.");
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
          width: "100%", maxWidth: "420px", textAlign: "center", boxShadow: "0 10px 25px rgba(0,0,0,0.3)"
        }}>
          <div style={{ fontSize: "36px", marginBottom: "8px" }}>🛡️</div>
          <h2 style={{ color: "#fff", fontSize: "20px", fontWeight: "bold", marginBottom: "4px" }}>
            Admin Security Portal
          </h2>
          <p style={{ color: "#94a3b8", fontSize: "13px", marginBottom: "20px" }}>
            Kripya login karne ke liye apna tarika chunein.
          </p>

          {/* Step 1: Jab tak mode select na ho, teeno main buttons dikhenge */}
          {currentMode === "select" && (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
              <button
                onClick={() => setCurrentMode("face")}
                style={{
                  backgroundColor: "#2563eb", color: "#fff", border: "none",
                  padding: "14px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                👤 Face Recognition
              </button>

              <button
                onClick={() => setCurrentMode("pin")}
                style={{
                  backgroundColor: "#334155", color: "#fff", border: "none",
                  padding: "14px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                🔑 Enter Password & PIN
              </button>

              <button
                onClick={() => setCurrentMode("fingerprint")}
                style={{
                  backgroundColor: "#475569", color: "#fff", border: "none",
                  padding: "14px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px"
                }}
              >
                👆 Fingerprint Recognition
              </button>
            </div>
          )}

          {/* Mode 2: Face Recognition Screen */}
          {currentMode === "face" && (
            <div>
              <FaceLockModal 
                onUnlock={handleUnlock}
                onSwitchToFingerprint={() => setCurrentMode("fingerprint")}
                onSwitchToPin={() => setCurrentMode("pin")}
              />
              <button
                onClick={() => setCurrentMode("select")}
                style={{ marginTop: "16px", background: "none", border: "none", color: "#38bdf8", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
              >
                ← Sabhi Options par wapas jayein
              </button>
            </div>
          )}

          {/* Mode 3: Fingerprint Screen */}
          {currentMode === "fingerprint" && (
            <div>
              <FingerprintLockModal 
                onUnlock={handleUnlock}
                onSwitchToFace={() => setCurrentMode("face")}
                onSwitchToPin={() => setCurrentMode("pin")}
              />
              <button
                onClick={() => setCurrentMode("select")}
                style={{ marginTop: "16px", background: "none", border: "none", color: "#38bdf8", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
              >
                ← Sabhi Options par wapas jayein
              </button>
            </div>
          )}

          {/* Mode 4: PIN / Password Screen */}
          {currentMode === "pin" && (
            <div>
              <form onSubmit={handlePinSubmit} style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "16px" }}>
                <input
                  type="password"
                  placeholder="Enter PIN / Password"
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
                <p style={{ color: "#f87171", fontSize: "13px", marginBottom: "12px", backgroundColor: "#7f1d1d", padding: "6px", borderRadius: "6px" }}>
                  {error}
                </p>
              )}

              <button
                onClick={() => setCurrentMode("select")}
                style={{ background: "none", border: "none", color: "#38bdf8", fontSize: "13px", cursor: "pointer", textDecoration: "underline" }}
              >
                ← Sabhi Options par wapas jayein
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  return null;
}