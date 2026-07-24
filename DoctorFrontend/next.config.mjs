/** @type {import('next').NextConfig} */
const nextConfig = {
  ...(process.env.NEXT_DIST_DIR ? { distDir: process.env.NEXT_DIST_DIR } : {}),
  async rewrites() {
    const backendUrl = (
      process.env.BACKEND_API_URL ||
      process.env.NEXT_PUBLIC_API_URL ||
      ""
    ).replace(/\/$/, "");

    if (!backendUrl.startsWith("http://") && !backendUrl.startsWith("https://")) {
      return [];
    }

    return [
      {
        source: "/backend-api/:path*",
        destination: `${backendUrl}/:path*`,
      },
    ];
  },
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
