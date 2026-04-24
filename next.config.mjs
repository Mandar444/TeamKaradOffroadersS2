/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  experimental: {
    workerThreads: true,
    webpackBuildWorker: false,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'www.transparenttextures.com',
        pathname: '/**',
      },
    ],
  },
};

export default nextConfig;
