import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  api: {
    bodyParser: {
      sizeLimit: "20mb", // 요청 본문 크기 제한을 20MB로 설정
    },
  },
  async rewrites() {
    return [
      {
        source: "/api/:path*",
        destination: "http://52.78.134.101:5000/:path*", // 백엔드 서버 주소
      },
    ];
  },
};

export default nextConfig;
