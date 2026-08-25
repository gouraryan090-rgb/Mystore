"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminMessagesPage() {
  const lockScreen = useAdminProtect();
  const router = useRouter();

  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(null);

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      if (data.success) {
        setMessages(data.data);
      }
    } catch (err) {
      console.error("Failed to fetch messages", err);
    } finally {
      setLoading(false);
    }
  };

  // Delete all queries for a specific email
  const handleDeleteGroup = async (e, email) => {
    e.stopPropagation(); // Prevent card click navigation
    if (!window.confirm(`Are you sure you want to delete all messages from ${email}?`)) {
      return;
    }

    setActionLoading(email);
    try {
      const res = await fetch(`/api/contact?email=${encodeURIComponent(email)}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        setMessages((prev) => prev.filter((msg) => msg.email !== email));
      } else {
        alert(data.message || "Failed to delete messages.");
      }
    } catch (err) {
      console.error("Error deleting messages:", err);
      alert("Something went wrong while deleting.");
    } finally {
      setActionLoading(null);
    }
  };

  // Group messages by email
  const groupedMessages = messages.reduce((acc, msg) => {
    if (!acc[msg.email]) {
      acc[msg.email] = {
        name: msg.name,
        email: msg.email,
        phone: msg.phone || "N/A", // 📱 Storing phone number per group
        queries: [],
      };
    }
    // Update phone if previously N/A and found in later message
    if ((!acc[msg.email].phone || acc[msg.email].phone === "N/A") && msg.phone) {
      acc[msg.email].phone = msg.phone;
    }
    acc[msg.email].queries.push(msg);
    return acc;
  }, {});

  const uniqueEmailList = Object.values(groupedMessages);

  if (lockScreen) return lockScreen;

  return (
    <div style={{ padding: "40px 20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1000px", margin: "0 auto" }}>
        
        {/* Back Link */}
        <Link href="/admin" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", fontSize: "14px", display: "inline-block", marginBottom: "20px" }}>
          ← Back to Dashboard
        </Link>

        <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#111827", marginBottom: "6px" }}>
          📬 Customer Messages & Complaints
        </h1>
        <p style={{ color: "#6b7280", fontSize: "14px", marginBottom: "24px" }}>
          Unique customer emails and mobile numbers are listed below. Click on any card to view queries, or delete them.
        </p>

        {loading ? (
          <p>Loading messages...</p>
        ) : uniqueEmailList.length === 0 ? (
          <div style={{ backgroundColor: "#fff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#6b7280", margin: 0 }}>No customer messages found yet.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {uniqueEmailList.map((group) => {
              // Pehli query ki ID ya group identification ke liye use karein
              const firstQueryId = group.queries[0]?._id;

              return (
                <div
                  key={group.email}
                  onClick={() => {
                    if (firstQueryId) {
                      router.push(`/admin/messages/${firstQueryId}`);
                    }
                  }}
                  style={{
                    backgroundColor: "#fff",
                    borderRadius: "12px",
                    border: "1px solid #e5e7eb",
                    padding: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    cursor: "pointer",
                    boxShadow: "0 1px 3px rgba(0,0,0,0.02)",
                    transition: "all 0.2s ease",
                    flexWrap: "wrap",
                    gap: "15px"
                  }}
                >
                  <div style={{ flex: "1", minWidth: "250px" }}>
                    <h3 style={{ margin: "0 0 4px 0", fontSize: "16px", color: "#111827" }}>{group.name}</h3>
                    <div style={{ display: "flex", gap: "15px", flexWrap: "wrap", alignItems: "center", marginTop: "4px" }}>
                      <span style={{ fontSize: "13px", color: "#4f46e5", fontWeight: "600" }}>
                        ✉️ {group.email}
                      </span>
                      <span style={{ fontSize: "13px", color: "#374151", fontWeight: "600" }}>
                        📱 {group.phone}
                      </span>
                    </div>
                  </div>
                  
                  <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                    <span style={{ backgroundColor: "#e0e7ff", color: "#4338ca", padding: "6px 12px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold" }}>
                      {group.queries.length} {group.queries.length === 1 ? "Query" : "Queries"}
                    </span>

                    {/* Delete Button */}
                    <button
                      onClick={(e) => handleDeleteGroup(e, group.email)}
                      disabled={actionLoading === group.email}
                      style={{
                        backgroundColor: "#fee2e2",
                        color: "#dc2626",
                        border: "none",
                        padding: "6px 12px",
                        borderRadius: "8px",
                        fontSize: "12px",
                        fontWeight: "bold",
                        cursor: "pointer"
                      }}
                    >
                      {actionLoading === group.email ? "Deleting..." : "🗑️ Delete"}
                    </button>

                    <span style={{ fontSize: "16px", color: "#6b7280", fontWeight: "bold" }}>
                      →
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}