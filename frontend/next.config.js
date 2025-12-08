/** @type {import('next').NextConfig} */
const nextConfig = {
  // Use SWC for minification instead of Terser
  swcMinify: true,
  // Add other Next.js 14 specific configs if needed
  // For example, if you encounter issues with images or fonts
  // images: {
  //   unoptimized: true,
  // },
};

module.exports = nextConfig;