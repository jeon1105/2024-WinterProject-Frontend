import type { AppProps } from "next/app";
// import axios from "../axios"; // 사용하지 않는다면 삭제하거나 주석 처리합니다.

export default function App({ Component, pageProps }: AppProps) {
  return <Component {...pageProps} />;
}
