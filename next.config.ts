import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "utfs.io",
      },
      {
        protocol: "https",
        hostname: "lncrml5um3.ufs.sh",
      },
      {
        protocol: "https",
        hostname: "replicate.delivery"
      },
    ],
  }
};

export default nextConfig;
