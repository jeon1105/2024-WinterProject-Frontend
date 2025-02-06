/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://52.78.134.101:5000/:path*", // 백엔드 서버 주소
      },
    ];
  },
};

module.exports = nextConfig;
