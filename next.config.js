/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: {
    outputFileTracingIncludes: {
      '/api/file': ['./data/**/*', './private/**/*'],
    },
  },
};

module.exports = nextConfig;
