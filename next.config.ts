import type { NextConfig } from "next";

const nextConfig: NextConfig = {
    webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      canvas: false,
    };
    return config;
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "avatars.githubusercontent.com",
        pathname: "/**", // Allow all avatar paths
      },
    ],
  },
};

export default nextConfig;
