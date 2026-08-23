"use client";
import React, { useState } from "react";

export default function FingerprintLockModal({ onUnlock, onSwitchToFace, onSwitchToPin }) {
  const [statusText, setStatusText] = useState("Fingerprint scan karne ke liye button dabayein...");

  const handleBiometricAuth = async () => {
    try {
      if (!window.PublicKeyCredential) {
        alert("Aapka browser biometric support nahi karta.");
        return;
      }

      setStatusText("Fingerprint scan ho raha hai...");

      const challenge = new Uint8Array([21, 31, 105, 76, 34, 15, 64, 2]);
      const publicKeyCredentialRequestOptions = {
        challenge: challenge,
        timeout: 60000,
        userVerification: "required",
      };

      // Sirf verification (get) hoga, koi naya creation/registration nahi
      const credential = await navigator.credentials.get({
        publicKey: publicKeyCredentialRequestOptions,
      });

      if (credential) {
        setStatusText("✅ Fingerprint Matched! Welcome Admin.");
        setTimeout(() => onUnlock(), 800);
      }
    } catch (err) {
      console.error("Biometric error:", err);
      setStatusText("❌ Verification fail ho gaya ya cancel kiya gaya.");
    }
  };

  return (
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "50px", marginBottom: "16px", cursor: "pointer" }} onClick={handleBiometricAuth}>
        👆
      </div>
      <button
        onClick={handleBiometricAuth}
        style={{
          width: "100%", backgroundColor: "#2563eb", color: "#fff", border: "none",
          padding: "12px", borderRadius: "8px", fontWeight: "bold", fontSize: "14px", cursor: "pointer", marginBottom: "16px"
        }}
      >
        Scan Fingerprint
      </button>

      <p style={{ color: "#38bdf8", fontSize: "13px", fontWeight: "500", marginBottom: "16px" }}>
        {statusText}
      </p>

      {/* Switch Buttons */}
      <div style={{ display: "flex", gap: "8px" }}>
        <button
          onClick={onSwitchToFace}
          style={{ flex: 1, backgroundColor: "#334155", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
        >
          👤 Face ID
        </button>
        <button
          onClick={onSwitchToPin}
          style={{ flex: 1, backgroundColor: "#334155", color: "#fff", border: "none", padding: "10px", borderRadius: "6px", cursor: "pointer", fontSize: "12px" }}
        >
          🔑 PIN
        </button>
      </div>
    </div>
  );
}