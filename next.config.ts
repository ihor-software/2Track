import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '/2Track', 
  assetPrefix: '/_next/',
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
