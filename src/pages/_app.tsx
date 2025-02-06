import { useEffect, useState } from "react";
import axios from "axios";
import { AppProps } from "next/app";
import { useRouter } from "next/router";

function MyApp({ Component, pageProps }: AppProps) {
  const [accessToken, setAccessToken] = useState<string | null>(
    typeof window !== "undefined" ? localStorage.getItem("access_token") : null
  );
  const [lastRefresh, setLastRefresh] = useState<number>(
    typeof window !== "undefined"
      ? Number(localStorage.getItem("last_refresh")) || 0
      : 0
  );
  const router = useRouter();

  // Refresh token을 서버에 보내 새로운 access token을 받는 함수
  const refreshAccessToken = async () => {
    try {
      const response = await axios.post(
        "https://smini.site/refresh",
        {},
        { withCredentials: true }
      );

      const newAccessToken = response.data.accessToken;
      if (newAccessToken) {
        setAccessToken(newAccessToken);
        localStorage.setItem("access_token", newAccessToken);
        const now = Date.now();
        setLastRefresh(now);
        localStorage.setItem("last_refresh", String(now));
        console.log("새로운 토큰 발급:", newAccessToken);
      }
    } catch (error) {
      console.error("Error refreshing token:", error);
    }
  };

  // `accessToken`이 변경될 때마다 로그 확인
  useEffect(() => {
    console.log("업데이트된 accessToken:", accessToken);
  }, [accessToken]);

  // 최초 렌더링 시 토큰 확인 및 자동 갱신
  useEffect(() => {
    const storedToken = localStorage.getItem("access_token");
    const storedLastRefresh = Number(localStorage.getItem("last_refresh")) || 0;
    const now = Date.now();

    if (!storedToken) {
      console.log("No Login");
      return;
    }

    const excludedPaths = ["/", "/signup"];
    if (excludedPaths.includes(router.pathname)) {
      return;
    }

    if (now - storedLastRefresh >= 60 * 60 * 1000) {
      refreshAccessToken();
    }
  }, []);

  // 페이지 이동 시 1시간이 지나면 토큰 갱신
  useEffect(() => {
    const handleRouteChange = () => {
      const storedLastRefresh =
        Number(localStorage.getItem("last_refresh")) || 0;
      const now = Date.now();
      if (now - storedLastRefresh >= 60 * 60 * 1000) {
        refreshAccessToken();
      }
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, []);

  return (
    <div>
      <Component {...pageProps} />
    </div>
  );
}

export default MyApp;
