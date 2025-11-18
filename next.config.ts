import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'standalone',
  outputFileTracingIncludes: {
    '/api/**/*': ['./node_modules/.prisma/client/**/*'],
    '/**/*': ['./node_modules/.prisma/client/**/*'],
  },
};

export default nextConfig;
