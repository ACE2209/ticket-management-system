/** @type {import('next').NextConfig} */
const nextConfig = {
    output: "standalone",
    images: {
        remotePatterns: [
            {
                protocol: "https",
                hostname: "images.unsplash.com",
                pathname: "/**",
            },
            {
                protocol: "https",
                hostname: "randomuser.me",
                pathname: "/**",
            },
            {
                protocol: "http",
                hostname: "localhost",
                port: "8080",
                pathname: "/images/**",
            },
        ],
    },
};

export default nextConfig;