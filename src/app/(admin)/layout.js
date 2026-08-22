import Link from "next/link";
import "@/app/globals.css";

export const metadata = {
  title: "Admin Panel - My Store",
  description: "E-commerce Admin App",
};

export default function AdminLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif", backgroundColor: "#f3f4f6", minHeight: "100vh" }}>
        {/* Simple Minimal Top Bar */}
        <header
          style={{
            backgroundColor: "#1f2937",
            color: "#fff",
            padding: "16px 24px",
            display: "flex",
            justify: "space-between",
            alignItems: "center",
          }}
        >
          <Link
            href="/admin"
            style={{
              color: "#fff",
              textDecoration: "none",
              fontSize: "20px",
              fontWeight: "bold",
            }}
          >
            ⚙️ Admin Panel
          </Link>
        </header>

        <main>{children}</main>
      </body>
    </html>
  );
}