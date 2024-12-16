import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  reactStrictMode: true,
  output: 'export',  
  eslint: {
    ignoreDuringBuilds: true, 
  },
};

export default nextConfig;
