/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_BASE_URL: process.env.NEXT_PUBLIC_BASE_URL || "https://getcapsadev.com/api",
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "getcapsa-dev.s3.us-east-2.amazonaws.com",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
