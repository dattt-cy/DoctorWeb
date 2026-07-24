/** @type {import('next').NextConfig} */
const nextConfig = {
  // Sites expects the production build output in `dist`.
  distDir: process.env.NEXT_DIST_DIR || "dist",
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
        pathname: "/**",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
