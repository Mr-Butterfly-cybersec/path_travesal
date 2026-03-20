/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  outputFileTracingIncludes: {
    '/api/file': ['./data/**/*', './private/**/*'],
  },
};

module.exports = nextConfig;
