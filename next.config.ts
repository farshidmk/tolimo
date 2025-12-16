import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "dkstatics-public.digikala.com",
      },
    ],
  },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;
