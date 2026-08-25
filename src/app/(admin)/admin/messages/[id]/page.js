"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useAdminProtect } from "@/lib/protectedRoute";

export default function AdminMessageDetailPage({ params }) {
  const lockScreen = useAdminProtect();
  const router = useRouter();
  const unwrappedParams = use(params);
  const queryId = unwrappedParams.id;

  const [customerData, setCustomerData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (queryId) {
      fetchCustomerDetails();
    }
  }, [queryId]);

  const fetchCustomerDetails = async () => {
    try {
      const res = await fetch("/api/contact");
      const data = await res.json();
      
      if (data.success && data.data) {
        // Find the specific query matching the clicked ID
        const matchedQuery = data.data.find(q => q._id === queryId);

        if (matchedQuery) {
          const customerEmail = matchedQuery.email;
          // Filter all queries belonging to this customer's email
          const userQueries = data.data.filter(q => q.email === customerEmail);
          
          setCustomerData({
            name: matchedQuery.name,
            email: customerEmail,
            phone: matchedQuery.phone || "N/A",
            queries: userQueries
          });
        }
      }
    } catch (err) {
      console.error("Failed to fetch customer details", err);
    } finally {
      setLoading(false);
    }
  };

  if (lockScreen) return lockScreen;

  return (
    <div style={{ padding: "40px 20px", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto" }}>
        
        {/* Back Link */}
        <Link href="/admin/messages" style={{ color: "#2563eb", textDecoration: "none", fontWeight: "bold", fontSize: "14px", display: "inline-block", marginBottom: "20px" }}>
          ← Back to Messages
        </Link>

        {loading ? (
          <p>Loading details...</p>
        ) : !customerData ? (
          <div style={{ backgroundColor: "#fff", padding: "40px", textAlign: "center", borderRadius: "12px", border: "1px solid #e5e7eb" }}>
            <p style={{ color: "#6b7280", margin: 0 }}>Customer details not found.</p>
          </div>
        ) : (
          <div>
            {/* Customer Info Card */}
            <div style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "24px", marginBottom: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#111827", marginBottom: "12px" }}>
                👤 {customerData.name}
              </h1>
              <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
                <span style={{ fontSize: "14px", color: "#4f46e5", fontWeight: "600" }}>
                  ✉️ {customerData.email}
                </span>
                <span style={{ fontSize: "14px", color: "#374151", fontWeight: "600" }}>
                  📱 {customerData.phone}
                </span>
              </div>
            </div>

            <h2 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", marginBottom: "16px" }}>
              💬 Customer Queries & Topics ({customerData.queries.length})
            </h2>

            {/* Queries List */}
            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
              {customerData.queries.map((q, index) => (
                <div key={q._id || index} style={{ backgroundColor: "#fff", borderRadius: "12px", border: "1px solid #e5e7eb", padding: "20px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "10px", flexWrap: "wrap", gap: "10px" }}>
                    <span style={{ backgroundColor: "#e0e7ff", color: "#4338ca", padding: "4px 10px", borderRadius: "6px", fontSize: "12px", fontWeight: "bold" }}>
                      📌 Topic: {q.topic || q.subject || q.category || "General Query"}
                    </span>
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>
                      📅 {q.createdAt ? new Date(q.createdAt).toLocaleDateString() : "Recent"}
                    </span>
                  </div>
                  <p style={{ color: "#374151", fontSize: "15px", lineHeight: "1.5", margin: 0, whiteSpace: "pre-wrap" }}>
                    {q.message || q.query || q.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}