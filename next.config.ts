/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  basePath: '/book-tracking-app', // Replace with your GitHub repo name
  images: {
    unoptimized: true, // Required for static export
  },
};

module.exports = nextConfig;