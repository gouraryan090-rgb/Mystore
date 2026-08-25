"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContactUsPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "", // 📱 Added phone field
    topic: "",
    customTopic: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [openFaq, setOpenFaq] = useState(null);

  // Auto-fill user email, name, and phone if logged in
  useEffect(() => {
    try {
      const storedUser = localStorage.getItem("customer_user");
      if (storedUser) {
        const userData = JSON.parse(storedUser);
        if (userData?.email) {
          setFormData((prev) => ({
            ...prev,
            email: userData.email,
            name: userData.name || userData.fullName || "",
            phone: userData.phone || userData.mobile || "",
          }));
        }
      }
    } catch (err) {
      console.error("Error reading user from localStorage", err);
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMsg("");
    setErrorMsg("");

    // 10-digit phone validation
    const phoneRegex = /^[0-9]{10}$/;
    if (!phoneRegex.test(formData.phone)) {
      setLoading(false);
      setErrorMsg("Please enter a valid 10-digit mobile number.");
      return;
    }

    // Final topic determination
    const finalTopic = formData.topic === "Others" ? formData.customTopic : formData.topic;

    const payload = {
      name: formData.name,
      email: formData.email,
      phone: formData.phone, // 📱 Included phone in payload
      topic: finalTopic,
      message: formData.message,
    };

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (data.success) {
        setLoading(false);
        setSuccessMsg("Thank you! Your message has been sent successfully.");
        setFormData((prev) => ({
          ...prev,
          phone: "",
          topic: "",
          customTopic: "",
          message: "",
        }));
        setTimeout(() => setSuccessMsg(""), 5000);
      } else {
        setLoading(false);
        setErrorMsg(data.message || "Something went wrong. Please try again.");
      }
    } catch (err) {
      setLoading(false);
      setErrorMsg("Network error. Please try again later.");
    }
  };

  const toggleFaq = (index) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const faqs = [
    {
      q: "How can I track my order?",
      a: "You can track your order by going to the 'Your Orders' section in your profile menu to view live updates.",
    },
    {
      q: "What is your return policy?",
      a: "We offer an easy return policy within 7 days of delivery for eligible items in original condition.",
    },
    {
      q: "How long does delivery take?",
      a: "Standard delivery typically takes 3-5 business days depending on your delivery location across India.",
    },
    {
      q: "Do you offer Cash on Delivery?",
      a: "Yes, Cash on Delivery (COD) is available on most items across our delivery locations.",
    },
    {
      q: "How can I cancel my order?",
      a: "You can cancel your order directly from your 'Your Orders' page within 24 hours of placement.",
    },
  ];

  return (
    <div style={{ backgroundColor: "#f8fafc", minHeight: "100vh", padding: "40px 20px", fontFamily: "Arial, sans-serif" }}>
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        
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
            marginBottom: "20px",
          }}
        >
          ← Back
        </button>

        {/* Top Hero Banner */}
        <div style={{
          background: "linear-gradient(135deg, #f0f4ff 0%, #eef2ff 100%)",
          border: "1px solid #e0e7ff",
          borderRadius: "24px",
          padding: "50px 40px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "30px",
          marginBottom: "30px"
        }}>
          <div style={{ flex: "1", minWidth: "280px" }}>
            <span style={{ backgroundColor: "#e0e7ff", color: "#4f46e5", padding: "6px 14px", borderRadius: "20px", fontSize: "12px", fontWeight: "bold", textTransform: "uppercase", letterSpacing: "1px" }}>
              Contact Us
            </span>
            <h1 style={{ fontSize: "42px", fontWeight: "800", color: "#111827", margin: "16px 0 12px 0", lineHeight: "1.2" }}>
              We're Here To <span style={{ color: "#6366f1" }}>Help You</span>
            </h1>
            <p style={{ color: "#4b5563", fontSize: "15px", lineHeight: "1.6", marginBottom: "24px" }}>
              Have a question, suggestion, or need assistance with your order? Our team is always ready to help you with the best support.
            </p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <span style={{ backgroundColor: "#fff", padding: "8px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", color: "#374151", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>⚡ Fast Response</span>
              <span style={{ backgroundColor: "#fff", padding: "8px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", color: "#374151", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>🤝 Friendly Support</span>
              <span style={{ backgroundColor: "#fff", padding: "8px 16px", borderRadius: "30px", fontSize: "13px", fontWeight: "600", color: "#374151", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>🛡️ Trusted Partner</span>
            </div>
          </div>

          <div style={{ flex: "1", minWidth: "280px", display: "flex", justifyContent: "center" }}>
            <div style={{
              width: "280px",
              height: "280px",
              background: "radial-gradient(circle, rgba(99,102,241,0.15) 0%, rgba(255,255,255,0) 70%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "90px"
            }}>
              🎧
            </div>
          </div>
        </div>

        {/* 3 Info Cards Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px", marginBottom: "30px" }}>
          
          {/* Email Card */}
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ backgroundColor: "#ede9fe", color: "#7c3aed", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              ✉️
            </div>
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Email Us</h3>
              <a href="mailto:zentrobazaar.shop@gmail.com" style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#4f46e5", textDecoration: "none", display: "block" }}>zentrobazaar.shop@gmail.com</a>
              <p style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}>We reply within 24 hours</p>
            </div>
          </div>

          {/* Call Card */}
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ backgroundColor: "#dcfce7", color: "#16a34a", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              📞
            </div>
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Call Us</h3>
              <a href="tel:+917378200781" style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#16a34a", textDecoration: "none", display: "block" }}>+91 73782 00781</a>
              <p style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}>Mon - Sat: 9 AM to 8 PM</p>
            </div>
          </div>

          {/* Location Card */}
          <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", display: "flex", alignItems: "flex-start", gap: "16px" }}>
            <div style={{ backgroundColor: "#ffedd5", color: "#c2410c", width: "48px", height: "48px", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "22px", flexShrink: 0 }}>
              📍
            </div>
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "16px", fontWeight: "700", color: "#111827" }}>Our Location</h3>
              <p style={{ margin: "0 0 4px 0", fontSize: "14px", fontWeight: "600", color: "#374151" }}>Nawa City, Rajasthan, India</p>
              <p style={{ margin: "0", fontSize: "12px", color: "#6b7280" }}>We deliver across India</p>
            </div>
          </div>

        </div>

        {/* Form and Side Graphic Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.4fr 1fr", gap: "20px", marginBottom: "40px", alignItems: "stretch" }}>
          
          {/* Send Message Form */}
          <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.02)" }}>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700", color: "#111827" }}>✉️ Send Us a Message</h3>
            <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#6b7280" }}>Fill in the details and we'll get back to you soon.</p>

            {successMsg && (
              <div style={{ backgroundColor: "#dcfce7", color: "#166534", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>
                {successMsg}
              </div>
            )}
            {errorMsg && (
              <div style={{ backgroundColor: "#fee2e2", color: "#dc2626", padding: "12px", borderRadius: "8px", fontSize: "13px", marginBottom: "16px", fontWeight: "600" }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Your Name</label>
                  <input
                    type="text"
                    required
                    placeholder="Enter your name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Your Email</label>
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", boxSizing: "border-box", outline: "none", backgroundColor: "#f9fafb" }}
                  />
                </div>
              </div>

              {/* 📱 10-Digit Mobile Number Field */}
              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Mobile Number (10 Digits)</label>
                <input
                  type="tel"
                  required
                  maxLength="10"
                  placeholder="Enter 10-digit mobile number"
                  value={formData.phone}
                  onChange={(e) => {
                    const val = e.target.value.replace(/\D/g, "").slice(0, 10);
                    setFormData({ ...formData, phone: val });
                  }}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                />
              </div>

              <div style={{ marginBottom: "16px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Select Topic</label>
                <select
                  required
                  value={formData.topic}
                  onChange={(e) => setFormData({ ...formData, topic: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", boxSizing: "border-box", outline: "none", backgroundColor: "#fff" }}
                >
                  <option value="">Select Topic</option>
                  <option value="Order Support">Order Support</option>
                  <option value="Returns & Refunds">Returns & Refunds</option>
                  <option value="Payment Issues">Payment Issues</option>
                  <option value="General Inquiries">General Inquiries</option>
                  <option value="Others">Others</option>
                </select>
              </div>

              {/* Custom Topic Input if 'Others' is selected */}
              {formData.topic === "Others" && (
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Specify Custom Topic</label>
                  <input
                    type="text"
                    required
                    placeholder="Please specify your topic"
                    value={formData.customTopic}
                    onChange={(e) => setFormData({ ...formData, customTopic: e.target.value })}
                    style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", boxSizing: "border-box", outline: "none" }}
                  />
                </div>
              )}

              <div style={{ marginBottom: "20px" }}>
                <label style={{ display: "block", fontSize: "12px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>Your Message</label>
                <textarea
                  required
                  rows="4"
                  placeholder="Type your message here..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  style={{ width: "100%", padding: "10px 14px", borderRadius: "8px", border: "1px solid #d1d5db", fontSize: "13px", boxSizing: "border-box", outline: "none", resize: "vertical" }}
                ></textarea>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{
                  width: "100%",
                  backgroundColor: "#6366f1",
                  color: "#fff",
                  border: "none",
                  borderRadius: "8px",
                  padding: "12px",
                  fontSize: "14px",
                  fontWeight: "bold",
                  cursor: "pointer",
                }}
              >
                {loading ? "Sending..." : "🚀 Send Message"}
              </button>

              <p style={{ textAlign: "center", fontSize: "11px", color: "#9ca3af", marginTop: "12px" }}>
                🔒 Your information is secure with us.
              </p>
            </form>
          </div>

          {/* Right Side Info Box */}
          <div style={{ backgroundColor: "#fff", padding: "30px", borderRadius: "16px", border: "1px solid #e5e7eb", boxShadow: "0 2px 4px rgba(0,0,0,0.02)", display: "flex", flexDirection: "column", justifyContent: "space-between" }}>
            <div>
              <h3 style={{ margin: "0 0 6px 0", fontSize: "18px", fontWeight: "700", color: "#111827" }}>We're Just a Message Away!</h3>
              <p style={{ margin: "0 0 20px 0", fontSize: "13px", color: "#6b7280", lineHeight: "1.5" }}>
                Our support team is always ready to assist you with any queries or issues.
              </p>

              <div style={{ display: "flex", flexDirection: "column", gap: "12px", marginBottom: "20px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  <span style={{ color: "#16a34a" }}>✔</span> Order Support
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  <span style={{ color: "#16a34a" }}>✔</span> Returns & Refunds
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  <span style={{ color: "#16a34a" }}>✔</span> Payment Issues
                </div>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  <span style={{ color: "#16a34a" }}>✔</span> General Inquiries
                </div>
              </div>
            </div>

            <div style={{ textAlign: "center", padding: "10px", backgroundColor: "#f9fafb", borderRadius: "12px" }}>
              <div style={{ fontSize: "36px", marginBottom: "4px" }}>📱</div>
              <span style={{ fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>Available on Zentro Support</span>
            </div>
          </div>

        </div>

        {/* FAQ Section */}
        <div style={{ marginBottom: "40px" }}>
          <div style={{ textAlign: "center", marginBottom: "24px" }}>
            <h2 style={{ fontSize: "24px", fontWeight: "700", color: "#111827", margin: "0 0 6px 0" }}>Frequently Asked Questions</h2>
            <p style={{ color: "#6b7280", fontSize: "13px", margin: "0" }}>Questions? We've got answers.</p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 280px", gap: "20px", alignItems: "start" }}>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              {faqs.map((faq, index) => (
                <div key={index} style={{ backgroundColor: "#fff", border: "1px solid #e5e7eb", borderRadius: "10px", overflow: "hidden" }}>
                  <button
                    onClick={() => toggleFaq(index)}
                    style={{
                      width: "100%",
                      padding: "16px 20px",
                      background: "none",
                      border: "none",
                      textAlign: "left",
                      fontSize: "14px",
                      fontWeight: "600",
                      color: "#111827",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    {faq.q}
                    <span style={{ fontSize: "12px", color: "#6b7280" }}>{openFaq === index ? "▲" : "▼"}</span>
                  </button>
                  {openFaq === index && (
                    <div style={{ padding: "0 20px 16px 20px", fontSize: "13px", color: "#4b5563", lineHeight: "1.5", borderTop: "1px solid #f3f4f6" }}>
                      <p style={{ margin: "10px 0 0 0" }}>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* Still Need Help Box */}
            <div style={{ backgroundColor: "#fff", padding: "24px", borderRadius: "16px", border: "1px solid #e5e7eb", textAlign: "center" }}>
              <div style={{ width: "48px", height: "48px", backgroundColor: "#e0e7ff", color: "#4f46e5", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px", margin: "0 auto 12px auto" }}>
                🎧
              </div>
              <h4 style={{ margin: "0 0 6px 0", fontSize: "15px", fontWeight: "700", color: "#111827" }}>Still Need Help?</h4>
              <p style={{ margin: "0 0 16px 0", fontSize: "12px", color: "#6b7280", lineHeight: "1.5" }}>
                Our support team is available to assist you.
              </p>
              <a
                href="tel:+917378200781"
                style={{ display: "block", width: "100%", backgroundColor: "#fff", color: "#4f46e5", border: "1px solid #4f46e5", borderRadius: "8px", padding: "10px", fontSize: "13px", fontWeight: "bold", textDecoration: "none", boxSizing: "border-box" }}
              >
                Call Support
              </a>
            </div>

          </div>
        </div>

        {/* Bottom Banner */}
        <div style={{
          background: "linear-gradient(135deg, #4f46e5 0%, #6366f1 100%)",
          borderRadius: "20px",
          padding: "35px 30px",
          color: "#fff",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: "20px"
        }}>
          <div>
            <h3 style={{ margin: "0 0 6px 0", fontSize: "22px", fontWeight: "700" }}>Happy Shopping with ZENTROBAZAAR!</h3>
            <p style={{ margin: "0", fontSize: "13px", opacity: "0.9" }}>We're committed to providing you the best shopping experience every time.</p>
          </div>
          <a
            href="/"
            style={{
              backgroundColor: "#fff",
              color: "#4f46e5",
              padding: "10px 20px",
              borderRadius: "8px",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: "bold",
              display: "inline-block",
              boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
            }}
          >
            Explore Products →
          </a>
        </div>

      </div>
    </div>
  );
}