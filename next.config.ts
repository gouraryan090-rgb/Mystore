import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/howtoopenadminpanel7", // Yeh naya URL aap browser mein open karenge
        destination: "/admin",    // Aapka target folder/route
      },
    ];
  },
};

export default nextConfig;