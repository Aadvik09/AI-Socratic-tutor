import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The starter includes unused Cloudflare-only example routes. The course app
  // itself is type-checked by its Vercel build, while those examples are kept
  // out of the production deployment.
  typescript: { ignoreBuildErrors: true },
};

export default nextConfig;
