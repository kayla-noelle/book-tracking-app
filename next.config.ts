/** @type {import('next').NextConfig} */
const isProd = process.env.NODE_ENV === 'production';

const nextConfig = {
  output: 'export',
  basePath: isProd ? '/book-tracking-app' : '',
  assetPrefix: isProd ? '/book-tracking-app/' : '',
  images: {
    unoptimized: true,
  },
};

module.exports = nextConfig;