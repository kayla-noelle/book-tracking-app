/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/book-tracking-app',
  assetPrefix: '/book-tracking-app/',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;