import type { NextConfig } from "next";

const isGithubActions = process.env.GITHUB_ACTIONS === 'true';
const basePath = process.env.NEXT_PUBLIC_BASE_PATH !== undefined 
  ? process.env.NEXT_PUBLIC_BASE_PATH 
  : (isGithubActions ? '/CrimeVisionAI' : '');

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  env: {
    NEXT_PUBLIC_BASE_PATH: basePath,
  },
  images: {
    unoptimized: true,
  },
  devIndicators: {
    appIsrStatus: false,
  } as any,
  async rewrites() {
    return [
      {
        source: '/api/crimevision-ai/:path*',
        destination: 'http://localhost:8090/server/crimevision-ai/api/crimevision-ai/:path*',
      },
      {
        source: '/api/crimevision-ai',
        destination: 'http://localhost:8090/server/crimevision-ai/api/crimevision-ai',
      },
    ];
  },
};

export default nextConfig;
