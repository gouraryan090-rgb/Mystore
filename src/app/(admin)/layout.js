import Link from "next/link";
import { cookies } from "next/headers";
import { headers } from "next/headers";
import "@/app/globals.css";
import dbConnect from "@/lib/db"; 
import Order from "@/models/Order";

export const metadata = {
  title: "Admin Dashboard - ZENTROBAZAAR",
  description: "Modern E-commerce Admin Panel",
};

export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth");

  // Real pending orders count with case-insensitive regex fix
  let pendingOrdersCount = 0;
  try {
    await dbConnect();
    // Using regex to match "Pending", "pending", etc. accurately
    pendingOrdersCount = await Order.countDocuments({ 
      status: { $regex: /^pending$/i } 
    });
  } catch (err) {
    console.error("Failed to fetch pending orders count:", err);
  }

  return (
    <html lang="en">
      <body 
        style={{ 
          margin: 0, 
          padding: 0, 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
          backgroundColor: "#f8fafc", 
          color: "#0f172a",
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column"
        }}
      >
        {/* Top Navigation Bar */}
        <header
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            padding: "12px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 1px 3px 0 rgba(0, 0, 0, 0.02)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
            <Link
              href="/admin"
              style={{
                color: "#0f172a",
                textDecoration: "none",
                fontSize: "20px",
                fontWeight: "900",
                letterSpacing: "-0.5px",
              }}
            >
              ZENTROBAZAAR
            </Link>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "20px" }}>
            {/* Search Box */}
            <div style={{ position: "relative", width: "320px" }}>
              <span style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>🔍</span>
              <input
                type="text"
                placeholder="Search orders, customers..."
                style={{
                  width: "100%",
                  padding: "8px 12px 8px 36px",
                  borderRadius: "10px",
                  border: "1px solid #e2e8f0",
                  backgroundColor: "#f8fafc",
                  fontSize: "13px",
                  outline: "none",
                }}
              />
            </div>

            {/* Notification Icon with Real Dynamic Pending Count */}
            <Link href="/admin/orders" style={{ textDecoration: "none" }}>
              <div style={{ position: "relative", cursor: "pointer", padding: "8px", borderRadius: "50%", backgroundColor: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center" }}>
                🔔
                {pendingOrdersCount > 0 && (
                  <span style={{ position: "absolute", top: "-2px", right: "-2px", backgroundColor: "#6366f1", color: "#fff", fontSize: "10px", fontWeight: "bold", padding: "2px 6px", borderRadius: "50%" }}>
                    {pendingOrdersCount}
                  </span>
                )}
              </div>
            </Link>

            {/* Admin Profile */}
            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
              <div style={{ width: "36px", height: "36px", borderRadius: "50%", backgroundColor: "#6366f1", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "14px" }}>
                A
              </div>
              <div style={{ textAlign: "left" }}>
                <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a" }}>Admin</div>
                <div style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>Super Admin</div>
              </div>
            </div>
          </div>
        </header>

        {/* Layout Body with Sidebar and Main Content */}
        <div style={{ display: "flex", flex: 1, minHeight: "calc(100vh - 65px)" }}>
          
          {/* Sidebar */}
          <aside
            style={{
              width: "260px",
              backgroundColor: "#ffffff",
              borderRight: "1px solid #e2e8f0",
              padding: "24px 16px",
              display: "flex",
              flexDirection: "column",
              justifyContent: "space-between",
              flexShrink: 0,
            }}
          >
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", paddingLeft: "12px", marginBottom: "4px", letterSpacing: "0.5px" }}>MAIN</span>
              <SidebarLink href="/admin" icon="📊" label="Dashboard" />

              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", paddingLeft: "12px", marginTop: "16px", marginBottom: "4px", letterSpacing: "0.5px" }}>MANAGE</span>
              <SidebarLink href="/admin/products" icon="🏷️" label="Products" />
              <SidebarLink href="/admin/categories" icon="📂" label="Categories" />
              <SidebarLink href="/admin/orders" icon="📦" label="Orders" active />
              <SidebarLink href="/admin/customers" icon="👥" label="Customers" />
              <SidebarLink href="/admin/coupons" icon="🎟️" label="Coupons" />
              <SidebarLink href="/admin/reviews" icon="⭐" label="Reviews" />
              <SidebarLink href="/admin/extra-charges" icon="⚡" label="Extra Charges" />

              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", paddingLeft: "12px", marginTop: "16px", marginBottom: "4px", letterSpacing: "0.5px" }}>ANALYTICS</span>
              <SidebarLink href="/admin/finance" icon="📈" label="Reports & Finance" />
              <SidebarLink href="/admin/messages" icon="📬" label="Customer Messages" />

              <span style={{ fontSize: "11px", fontWeight: "800", color: "#94a3b8", paddingLeft: "12px", marginTop: "16px", marginBottom: "4px", letterSpacing: "0.5px" }}>SETTINGS</span>
              <SidebarLink href="/admin/store-settings" icon="⚙️" label="Store Settings" />
              <SidebarLink href="/admin/payment-methods" icon="💳" label="Payment Methods" />
            </div>

            {/* Need Help Box */}
            <div style={{ backgroundColor: "#f8fafc", padding: "14px", borderRadius: "14px", border: "1px solid #e2e8f0", textAlign: "center" }}>
              <div style={{ fontSize: "13px", fontWeight: "800", color: "#0f172a", marginBottom: "2px" }}>Need Help?</div>
              <div style={{ fontSize: "11px", color: "#64748b", marginBottom: "10px" }}>Contact support for assistance</div>
              <button style={{ width: "100%", padding: "8px", backgroundColor: "#fff", border: "1px solid #cbd5e1", borderRadius: "10px", fontSize: "12px", fontWeight: "700", color: "#475569", cursor: "pointer" }}>
                🎧 Contact Support
              </button>
            </div>
          </aside>

          {/* Main Content Area */}
          <main style={{ flex: 1, padding: "32px", overflowY: "auto" }}>
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}

function SidebarLink({ href, icon, label, active }) {
  return (
    <Link
      href={href}
      style={{
        display: "flex",
        alignItems: "center",
        gap: "12px",
        padding: "10px 14px",
        borderRadius: "12px",
        textDecoration: "none",
        fontSize: "14px",
        fontWeight: "700",
        backgroundColor: active ? "#6366f1" : "transparent",
        color: active ? "#fff" : "#475569",
        boxShadow: active ? "0 4px 12px rgba(99, 102, 241, 0.2)" : "none",
        transition: "all 0.2s"
      }}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </Link>
  );
}