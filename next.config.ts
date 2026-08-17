import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: "export",
  basePath: process.env.NODE_ENV === "production" ? "/craft-community-platform" : "",
  assetPrefix: process.env.NODE_ENV === "production" ? "/craft-community-platform/" : undefined,
  trailingSlash: true,
  images: { unoptimized: true },
};

export default nextConfig;
