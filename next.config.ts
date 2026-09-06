import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  images: {
    unoptimized: true,
  },
  basePath: "/nongyiba",
  assetPrefix: "/nongyiba/",
};

export default nextConfig;
