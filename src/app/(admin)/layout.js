import Link from "next/link";
import "@/app/globals.css";

export const metadata = {
  title: "Admin Dashboard - My Store",
  description: "Modern E-commerce Admin Panel",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body 
        style={{ 
          margin: 0, 
          padding: 0, 
          fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif", 
          backgroundColor: "#f8fafc", 
          color: "#0f172a",
          minHeight: "100vh" 
        }}
      >
        {/* Modern Sleek Glassmorphism Top Bar */}
        <header
          style={{
            backgroundColor: "#ffffff",
            color: "#0f172a",
            padding: "16px 32px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid #e2e8f0",
            boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.02), 0 2px 4px -1px rgba(0, 0, 0, 0.01)",
            position: "sticky",
            top: 0,
            zIndex: 50,
          }}
        >
          <Link
            href="/admin"
            style={{
              color: "#0f172a",
              textDecoration: "none",
              fontSize: "18px",
              fontWeight: "700",
              letterSpacing: "-0.5px",
              display: "flex",
              alignItems: "center",
              gap: "8px",
            }}
          >
            ⚡ Admin Panel
          </Link>

          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "12px",
                backgroundColor: "#f0fdf4",
                color: "#16a34a",
                padding: "6px 12px",
                borderRadius: "20px",
                fontWeight: "600",
                border: "1px solid #bbf7d0",
              }}
            >
              Secure & Connected
            </span>
          </div>
        </header>

        {/* Main Content Container with Premium Spacing */}
        <main
          style={{
            maxWidth: "1280px",
            margin: "0 auto",
            padding: "32px 24px",
          }}
        >
          {children}
        </main>
      </body>
    </html>
  );
}