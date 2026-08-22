import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  async rewrites() {
    return [
      {
        source: "/howtopenmyadminpanel7",
        destination: "/admin",
      },
    ];
  },
};

export default nextConfig;