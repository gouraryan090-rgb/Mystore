// src/app/profile/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

// Status translation function (matching orders page)
const getCustomerStatus = (dbStatus) => {
  switch (dbStatus) {
    case "Pending": return "Placed";
    case "Processing": return "Order in Preparation";
    case "In Transit": return "Order in Transit";
    case "Delivered": return "Delivered";
    case "Cancelled": return "Cancelled";
    default: return dbStatus || "Placed";
  }
};

export default function UserProfilePage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const fileInputRef = useRef(null);

  useEffect(() => {
    async function fetchProfileData() {
      try {
        // 1. Fetch Logged-in User Data
        const savedUser = localStorage.getItem("customer_user");
        if (savedUser) {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);

          const userEmail = parsedUser?.email;

          // 2. Fetch Real Orders from Backend API with Email Filter
          if (userEmail) {
            const orderRes = await fetch(`/api/orders/my-orders?email=${encodeURIComponent(userEmail)}`);
            const orderData = await orderRes.json();
            if (orderData.success) {
              setOrders(orderData.data || []);
            } else {
              setOrders([]);
            }

            // 3. Fetch Real Addresses specific to this user's email from localStorage
            const savedAddresses = localStorage.getItem(`customer_addresses_${userEmail}`);
            if (savedAddresses) {
              setAddresses(JSON.parse(savedAddresses));
            } else {
              // Default fallback address only if none exists for this specific user
              const defaultAddr = [
                { id: 1, title: "Home", tag: "Default", name: parsedUser?.name || "User", street1: "242, Ram Laxman Colony", city: "Nawa City", pincode: "341509", phone: parsedUser?.phone || "7378200781", active: true }
              ];
              setAddresses(defaultAddr);
              localStorage.setItem(`customer_addresses_${userEmail}`, JSON.stringify(defaultAddr));
            }
          }
        } else {
          router.push("/login");
          return;
        }

      } catch (e) {
        console.error("Profile fetch error:", e);
      }
    }

    fetchProfileData();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("customer_user");
    router.push("/");
  };

  // Handle Profile Image Upload
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert("Image size should be less than 2MB");
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result;
        const updatedUser = { ...user, photo: base64Image };
        setUser(updatedUser);
        localStorage.setItem("customer_user", JSON.stringify(updatedUser));
        alert("Profile picture updated successfully!");
      };
      reader.readAsDataURL(file);
    }
  };

  if (!user) {
    return <div style={{ padding: "60px", textAlign: "center", fontSize: "16px", color: "#64748b" }}>Loading profile...</div>;
  }

  return (
    <div style={{ padding: "20px 0", fontFamily: "Arial, sans-serif", backgroundColor: "#f8fafc", minHeight: "100vh" }}>
      <div style={{ maxWidth: "1280px", margin: "0 auto", display: "grid", gridTemplateColumns: "260px 1fr", gap: "24px", alignItems: "start" }}>
        
        {/* ================= LEFT SIDEBAR ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "12px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
            <SidebarItem icon="👤" label="My Profile" active={true} href="/profile" />
            <SidebarItem icon="📦" label="My Orders" href="/orders" />
            <SidebarItem icon="📍" label="Addresses" href="/edit-address" />
            <SidebarItem icon="❓" label="Help & Support" href="/contact-us" />
            <div onClick={handleLogout} style={{ cursor: "pointer" }}>
              <SidebarItem icon="🚪" label="Logout" color="#dc2626" />
            </div>
          </div>

          <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", borderRadius: "16px", padding: "20px", color: "#fff", textAlign: "left" }}>
            <div style={{ fontSize: "22px", marginBottom: "8px" }}>👑</div>
            <h3 style={{ fontSize: "15px", fontWeight: "700", margin: "0 0 6px 0" }}>Exclusive Member</h3>
            <p style={{ fontSize: "12px", opacity: 0.9, margin: "0 0 14px 0", lineHeight: "1.4" }}>You are enjoying exclusive benefits and offers.</p>
            <Link href="/deals" style={{ display: "inline-block", backgroundColor: "#fff", color: "#4f46e5", padding: "8px 14px", borderRadius: "8px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
              Explore Deals →
            </Link>
          </div>

          <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "20px", textAlign: "center" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>🎧</div>
            <h4 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px 0" }}>Need Help?</h4>
            <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 12px 0" }}>We're here to help you 24/7</p>
            <Link href="/contact-us" style={{ display: "block", border: "1px solid #cbd5e1", color: "#0f172a", padding: "8px", borderRadius: "8px", fontSize: "12px", fontWeight: "600", textDecoration: "none" }}>
              Contact Support
            </Link>
          </div>

        </div>

        {/* ================= RIGHT MAIN CONTENT ================= */}
        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          
          {/* 1. Profile Banner with Image Update Support */}
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "30px", display: "flex", justifyContent: "space-between", alignItems: "center", boxShadow: "0 1px 3px rgba(0,0,0,0.02)", flexWrap: "wrap", gap: "20px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ position: "relative", cursor: "pointer" }} onClick={() => fileInputRef.current?.click()} title="Click to change profile picture">
                <div style={{ width: "80px", height: "80px", borderRadius: "50%", backgroundColor: "#0f766e", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", fontWeight: "bold", overflow: "hidden" }}>
                  {user.photo ? (
                    <img src={user.photo} alt={user.name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                  ) : (
                    user.name ? user.name.charAt(0).toUpperCase() : "U"
                  )}
                </div>
                <div style={{ position: "absolute", bottom: 0, right: 0, background: "#6366f1", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontSize: "11px", border: "2px solid #fff" }}>
                  ✏️
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleImageChange} 
                  accept="image/*" 
                  style={{ display: "none" }} 
                />
              </div>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                  <h1 style={{ fontSize: "22px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{user.name}</h1>
                  <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "11px", fontWeight: "700", padding: "2px 8px", borderRadius: "20px" }}>Verified</span>
                </div>
                <p style={{ color: "#64748b", fontSize: "13px", margin: "0 0 4px 0" }}>{user.email}</p>
                <p style={{ color: "#0f172a", fontSize: "13px", fontWeight: "600", margin: 0 }}>📱 {user.phone || user.phoneNumber || "N/A"}</p>
              </div>
            </div>
            <div>
              <img src="https://cdni.iconscout.com/illustration/premium/thumb/user-verification-illustration-download-in-svg-png-gif-file-formats--id-card-profile-security-shield-pack-people-illustrations-4848834.png" alt="security" style={{ width: "120px", height: "auto" }} />
            </div>
          </div>

          {/* 2. Quick Count Dynamic Cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
            <StatCard icon="🛍️" count={orders.length} label="Total Orders" link="/orders" />
            <StatCard icon="📍" count={addresses.length} label="Addresses" link="/edit-address" />
          </div>

          {/* 3. Account Information & Recent Orders Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1.2fr 1fr", gap: "24px" }}>
            
            {/* Account Information Card */}
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Account Information</h2>
                <Link href="/edit-profile" style={{ color: "#6366f1", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>✏️ Edit</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                <InfoRow label="Full Name" value={user.name} />
                <InfoRow label="Email Address" value={user.email} verified={true} />
                <InfoRow label="Phone Number" value={user.phone || user.phoneNumber || "N/A"} verified={true} />
                <InfoRow label="Account Status" value="Active" statusColor="#16a34a" />
              </div>
            </div>

            {/* Recent Orders Card */}
            <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Recent Orders</h2>
                <Link href="/orders" style={{ color: "#6366f1", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>View All Orders →</Link>
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
                {orders.length > 0 ? (
                  orders.slice(0, 3).map((order, idx) => {
                    const firstItem = order.items?.[0] || {};
                    const isCancelled = order.orderStatus === "Cancelled" || order.status === "Cancelled";
                    const formattedDate = order.createdAt ? new Date(order.createdAt).toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }) : "Recent";
                    const statusText = getCustomerStatus(order.status || order.orderStatus);

                    return (
                      <OrderRow 
                        key={order._id || idx} 
                        title={firstItem.title || "Product Item"} 
                        id={order._id ? order._id.slice(-6) : `ZB12${idx}`} 
                        date={formattedDate} 
                        price={`₹${order.totalAmount || firstItem.offerPrice || 0}`} 
                        status={statusText} 
                        statusColor={isCancelled ? "#dc2626" : "#16a34a"} 
                        statusBg={isCancelled ? "#fee2e2" : "#dcfce7"} 
                      />
                    );
                  })
                ) : (
                  <p style={{ fontSize: "13px", color: "#64748b", textAlign: "center" }}>No recent orders found.</p>
                )}
              </div>
            </div>

          </div>

          {/* 4. Saved Addresses Section */}
          <div style={{ backgroundColor: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Saved Addresses</h2>
              <Link href="/edit-address" style={{ color: "#6366f1", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>Manage Addresses →</Link>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "10px" }}>
              {addresses.length > 0 ? (
                addresses.slice(0, 3).map((addr, idx) => {
                  const fullFormattedAddress = addr.address || `${addr.street1 || ''}${addr.street2 ? ', ' + addr.street2 : ''}${addr.city ? ', ' + addr.city : ''} - ${addr.pincode || ''}`;
                  
                  return (
                    <AddressBox 
                      key={addr.id || idx} 
                      title={addr.title || (idx === 0 ? "Home" : `Address ${idx + 1}`)} 
                      tag={addr.tag || (idx === 0 ? "Default" : "")} 
                      name={addr.name || user.name} 
                      address={fullFormattedAddress} 
                      phone={addr.phone || user.phone || "N/A"} 
                      active={addr.active || idx === 0} 
                    />
                  );
                })
              ) : (
                <p style={{ fontSize: "13px", color: "#64748b" }}>No saved addresses found.</p>
              )}
            </div>
          </div>

          {/* 5. Bottom Banner */}
          <div style={{ background: "linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)", borderRadius: "16px", padding: "24px 30px", display: "flex", justifyContent: "space-between", alignItems: "center", color: "#fff", flexWrap: "wrap", gap: "16px" }}>
            <div>
              <h3 style={{ fontSize: "18px", fontWeight: "800", margin: "0 0 6px 0" }}>Special for You!</h3>
              <p style={{ fontSize: "13px", opacity: 0.9, margin: 0 }}>Get exclusive offers, early access to deals and much more.</p>
            </div>
            <Link href="/deals" style={{ backgroundColor: "#fff", color: "#4f46e5", padding: "10px 20px", borderRadius: "8px", fontSize: "13px", fontWeight: "700", textDecoration: "none" }}>
              Explore Deals →
            </Link>
          </div>

        </div>

      </div>
    </div>
  );
}

// Sub-components
function SidebarItem({ icon, label, active, href, color = "#334155" }) {
  return (
    <Link href={href || "#"} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "8px", backgroundColor: active ? "#eef2ff" : "transparent", color: active ? "#6366f1" : color, fontSize: "13px", fontWeight: active ? "700" : "600", textDecoration: "none", marginBottom: "2px" }}>
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function StatCard({ icon, count, label, link }) {
  return (
    <Link href={link} style={{ backgroundColor: "#fff", border: "1px solid #e2e8f0", borderRadius: "16px", padding: "18px", textDecoration: "none", display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 1px 3px rgba(0,0,0,0.02)" }}>
      <div style={{ width: "36px", height: "36px", borderRadius: "10px", backgroundColor: "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "16px" }}>{icon}</div>
      <div>
        <div style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a" }}>{count}</div>
        <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>{label}</div>
      </div>
    </Link>
  );
}

function InfoRow({ label, value, verified, icon, statusColor }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", borderBottom: "1px solid #f1f5f9", paddingBottom: "10px" }}>
      <span style={{ fontSize: "12px", color: "#64748b" }}>{label}</span>
      <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
        {icon && <span>{icon}</span>}
        <span style={{ fontSize: "13px", fontWeight: "700", color: statusColor || "#0f172a" }}>{value}</span>
        {verified && <span style={{ backgroundColor: "#dcfce7", color: "#15803d", fontSize: "10px", fontWeight: "700", padding: "1px 6px", borderRadius: "10px" }}>Verified</span>}
      </div>
    </div>
  );
}

function OrderRow({ title, id, date, price, status, statusColor, statusBg }) {
  return (
    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", border: "1px solid #f1f5f9", padding: "10px", borderRadius: "10px" }}>
      <div>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{title}</div>
        <div style={{ fontSize: "11px", color: "#64748b" }}>ID: #{id} • {date}</div>
      </div>
      <div style={{ textAlign: "right" }}>
        <div style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a" }}>{price}</div>
        <span style={{ backgroundColor: statusBg, color: statusColor, fontSize: "10px", fontWeight: "700", padding: "2px 6px", borderRadius: "4px" }}>{status}</span>
      </div>
    </div>
  );
}

function AddressBox({ title, tag, name, address, phone, active }) {
  return (
    <div style={{ border: active ? "2px solid #6366f1" : "1px solid #e2e8f0", borderRadius: "12px", padding: "12px", backgroundColor: "#f8fafc", position: "relative" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
        <span style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a" }}>{title}</span>
        {tag && <span style={{ backgroundColor: "#eef2ff", color: "#6366f1", fontSize: "9px", fontWeight: "700", padding: "1px 4px", borderRadius: "4px" }}>{tag}</span>}
      </div>
      <div style={{ fontSize: "11px", color: "#334155", fontWeight: "700", marginBottom: "2px" }}>{name}</div>
      <div style={{ fontSize: "10px", color: "#64748b", lineHeight: "1.3", marginBottom: "6px" }}>{address}</div>
      <div style={{ fontSize: "10px", color: "#475569" }}>📱 {phone}</div>
    </div>
  );
}