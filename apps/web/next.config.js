/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['@asterbook/ui', '@asterbook/utils', '@asterbook/config', '@asterbook/types'],
  images: {
    domains: ['localhost'],
  },
};

module.exports = nextConfig;
