import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    domains: ['i.imgur.com'], // Add imgur.com as an allowed domain
  },
  /* other config options here */
};

export default nextConfig;
