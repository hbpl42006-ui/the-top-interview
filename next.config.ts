import type { NextConfig } from "next";

const proxiedApiRoutes = [
  "ads",
  "categories",
  "comments",
  "contact",
  "ground-reports",
  "interviews",
  "locations",
  "news",
  "newsletter",
  "podcasts",
  "public-voice",
  "reporters",
  "search",
  "special-reports",
  "submissions",
  "team-members",
  "tips",
  "upload",
  "users",
  "videos",
];

const nextConfig: NextConfig = {
  async rewrites() {
    return proxiedApiRoutes.flatMap((route) => [
      {
        source: `/api/${route}`,
        destination: `https://api.thetopinterview.com/api/${route}`,
      },
      {
        source: `/api/${route}/:path*`,
        destination: `https://api.thetopinterview.com/api/${route}/:path*`,
      },
    ]);
  },

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos" },
      { protocol: "https", hostname: "i.pravatar.cc" },
      { protocol: "https", hostname: "img.youtube.com" },
      { protocol: "https", hostname: "res.cloudinary.com" },
    ],
  },
};

export default nextConfig;