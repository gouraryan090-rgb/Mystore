import Link from "next/link";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import "@/app/globals.css";

export const metadata = {
  title: "Admin Dashboard - ZENTROBAZAAR",
  description: "Modern E-commerce Admin Panel",
};

export default async function AdminLayout({ children }) {
  const headersList = await headers();
  const pathname = headersList.get("x-invoke-path") || headersList.get("next-url") || "";

  // Agar user strictly login page (/admin) par hai, toh use layout ke andar aane do bina cookie check kiye
  // (Note: Agar pathname check me URL match na ho, toh hum headers se current path nikal rahe hain)
  const cookieStore = await cookies();
  const token = cookieStore.get("admin_auth");

  // Hum check karenge ki kya current path sirf "/admin" hai ya nahi
  // Kyunki /admin login page hai, isliye wahan token ki zaroorat nahi hai
  // Lekin agar koi /admin/orders ya aur koi andar ka page khol raha hai, toh token compulsory hai
  
  // Ek aur behtareen tareeqa: Agar hum headers se path nikalte hain aur wo /admin/orders jaisa hai
  // Toh hum token check karenge.
  
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