import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '/2Track', 
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
