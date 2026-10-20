import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // The Encore SDK loads a native runtime library, so Next.js leaves it to
  // Node to load at run time instead of bundling it.
  serverExternalPackages: ["@encore.dev/sdk"],
};

export default nextConfig;
