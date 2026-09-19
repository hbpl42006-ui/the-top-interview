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

const isFrontendDeployment =
  process.env.APP_DEPLOY_TARGET === "frontend";

const nextConfig: NextConfig = {
  async rewrites() {
    // Vercel frontend proxies selected API routes to OCI.
    // OCI backend must serve its own local API routes and must never
    // proxy them back to api.thetopinterview.com.
    if (!isFrontendDeployment) {
      return [];
    }

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
      // Instagram image URLs can resolve through this crawler/CDN host.
      { protocol: "https", hostname: "lookaside.instagram.com" },
    ],
  },
};

export default nextConfig;
