import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true, // Enable React strict mode for highlighting potential problems
  webpack(config, { isServer }) {
    // Add a custom rule to handle SVG files using @svgr/webpack
    config.module.rules.push({
      test: /\.svg$/,
      issuer: {
        // Ensure SVGs are imported from JavaScript/TypeScript files
        and: [/\.(js|ts)x?$/],
      },
      use: ["@svgr/webpack"],
    });
    return config;
  },
};

export default nextConfig;
