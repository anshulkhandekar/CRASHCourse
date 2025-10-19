/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Ensure proper handling of JSON files
  webpack: (config) => {
    config.module.rules.push({
      test: /\.json$/,
      type: 'json',
    });
    return config;
  },
};

module.exports = nextConfig;

