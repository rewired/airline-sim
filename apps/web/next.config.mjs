/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@airline-sim/domain', '@airline-sim/api-contract', '@airline-sim/app-state'],
};

export default nextConfig;
