import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export', 
  basePath: '/2Track', 
  assetPrefix: '',
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
