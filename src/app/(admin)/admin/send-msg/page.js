// src/app/(admin)/admin/send-msg/page.js
"use client";
import { useState } from "react";

export default function SendMessagePage() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSend = async (e) => {
    e.preventDefault();
    setLoading(type => true);

    try {
      const res = await fetch("/api/send-broadcast", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, body }),
      });

      const rawText = await res.text();
      let data;
      try {
        data = JSON.parse(rawText);
      } catch {
        throw new Error(`Server HTML/Text Error (Status ${res.status}): ${rawText.slice(0, 150)}...`);
      }

      if (res.ok && data.success) {
        alert(`Notification sent successfully to ${data.successCount} devices!`);
        setTitle("");
        setBody("");
      } else {
        alert("Failed: " + (data.message || data.error || "Unknown error"));
      }
    } catch (err) {
      console.error("Client Broadcast Error:", err);
      alert("Error Details: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "system-ui, sans-serif", padding: "40px 20px", maxWidth: "700px", margin: "0 auto" }}>
      <div style={{ background: "#fff", padding: "30px", borderRadius: "20px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)", border: "1px solid #e2e8f0" }}>
        <h2 style={{ fontSize: "22px", fontWeight: "900", marginBottom: "8px", color: "#0f172a" }}>Send Push Notification</h2>
        <p style={{ fontSize: "14px", color: "#64748b", marginBottom: "24px" }}>Broadcast real-time messages to all registered PWA users.</p>
        
        <form onSubmit={handleSend} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Notification Title</label>
            <input
              type="text"
              placeholder="e.g. Mega Sale Live! 🎉"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px" }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: "700", marginBottom: "8px", color: "#334155" }}>Message Body</label>
            <textarea
              placeholder="e.g. Get flat 50% off on all items today."
              value={body}
              onChange={(e) => setBody(e.target.value)}
              required
              rows={4}
              style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1px solid #cbd5e1", outline: "none", fontSize: "14px", resize: "vertical" }}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#6366f1", color: "#fff", border: "none", padding: "14px", borderRadius: "12px", fontWeight: "700", fontSize: "15px", cursor: "pointer", boxShadow: "0 4px 12px rgba(99, 102, 241, 0.3)" }}
          >
            {loading ? "Sending Broadcast..." : "Send Broadcast Now"}
          </button>
        </form>
      </div>
    </div>
  );
}