/** @type {import('next').NextConfig} */
const nextConfig = {
    productionBrowserSourceMaps: true,
    swcMinify: true,
    images:{
        domains: ["cdn.sanity.io"],
    },
    experimental: {
        instrumentationHook: true,
    }
};

export default nextConfig;

