import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
        ],
      },
    ];
  },
  async redirects() {
    return [
      // Legacy analyzers -> flagship
      {
        source: "/golf-swing-analyzer",
        destination: "/free-breakdown",
        permanent: true,
      },
      {
        source: "/hitting-analyzer",
        destination: "/free-breakdown",
        permanent: true,
      },
      {
        source: "/pitching-analyzer",
        destination: "/free-breakdown",
        permanent: true,
      },
      {
        source: "/hitting-pitching-analyzer-demo",
        destination: "/free-breakdown",
        permanent: true,
      },
      {
        source: "/analyzer-product-pages",
        destination: "/free-breakdown",
        permanent: true,
      },
      {
        source: "/product-page/:slug*",
        destination: "/free-breakdown",
        permanent: true,
      },

      // Legacy Wix blog -> local post routes
      {
        source: "/blog",
        destination: "/post",
        permanent: true,
      },
      {
        source: "/blog/:slug*",
        destination: "/post/:slug*",
        permanent: true,
      },

      // Legacy pages -> homepage
      {
        source: "/freecourse",
        destination: "/",
        permanent: true,
      },
      {
        source: "/courselanding",
        destination: "/",
        permanent: true,
      },
      {
        source: "/thank-you-ad",
        destination: "/",
        permanent: true,
      },
      {
        source: "/copy-of-home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/copy-of-home-1",
        destination: "/",
        permanent: true,
      },
      {
        source: "/copy-of-analyzer-product-pages",
        destination: "/free-breakdown",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;