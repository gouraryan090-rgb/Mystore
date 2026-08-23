import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        // Jab user /howtoopenadminpanel7 access kare
        source: "/howtoopenadminpanel7",
        destination: "/admin",
      },
      {
        // Jab user /howtoopenadminpanel7 ke aage ka koi bhi path access kare
        source: "/howtoopenadminpanel7/:path*",
        destination: "/admin/:path*",
      },
    ];
  },
};

export default nextConfig;