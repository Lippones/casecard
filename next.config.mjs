/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        hostname: 'case-card.s3.sa-east-1.amazonaws.com',
        protocol: 'https',
      },
    ],
  },
}

export default nextConfig
