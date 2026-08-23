import "./globals.css";

export const metadata = {
  title: "ZENTROBAZAAR",
  description: "E-commerce App",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body style={{ margin: 0, padding: 0, fontFamily: "sans-serif" }}>
        {children}
      </body>
    </html>
  );
}