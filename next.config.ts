import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  transpilePackages: ["three"],
  images: {
    remotePatterns: [
      new URL(
        "https://gravatar.com/avatar/65a2b04d5bf09d66ab59ca5a1b3c52ee253530e87ee477f78f8b7779bd8814c9"
      ),
    ],
  },
};

export default nextConfig;
