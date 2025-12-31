/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'flagcdn.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn.somesite.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.ifh.cc',
        pathname: '/**',
      },
    ],
  },
}

module.exports = nextConfig
