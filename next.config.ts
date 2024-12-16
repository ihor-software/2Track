import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  basePath: '/2Track', 
  assetPrefix: '/2Track',
  output: "export",
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
