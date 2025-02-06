import { useRouter } from "next/router";
import { useAuthStore } from "@/pages/stores/authStore";
import style from "./header.module.css";
import Image from "next/image";
import axios from "axios";

export default function NavigationBar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = async () => {
    try {
      // 1. 서버에 refresh token 보내기 (로그아웃)
      const response = await axios.post(
        "https://smini.site/logout", // 서버의 로그아웃 엔드포인트
        {},
        {
          withCredentials: true, // 쿠키에 저장된 refresh token을 자동으로 포함해서 보내기
        }
      );

      if (response.status === 200) {
        // 2. 로그아웃 상태로 업데이트
        logout();
        useAuthStore.getState().logout();

        // 3. 로컬 스토리지에서 사용자 데이터 및 토큰 삭제
        localStorage.removeItem("user");
        localStorage.removeItem("token");
        localStorage.removeItem("refresh_token");

        // 4. 사용자에게 로그아웃 완료 알림
        alert("로그아웃 되었습니다.");

        // 5. 홈 페이지로 리다이렉트
        router.push("/");
      }
    } catch (error) {
      console.error("로그아웃 중 오류 발생:", error);
    }
  };

  return (
    <nav className={style.top_bar}>
      <div className={style.Rectangle} />
      <h1 className={style.title}>Music Score Converter</h1>

      <div className={style.navigation}>
        <button className={style.button} onClick={() => router.push("/home")}>
          Home
        </button>
        <button className={style.button} onClick={handleLogout}>
          Logout
        </button>
        <div
          className={style.profile}
          onClick={() => router.push("/allsheets")}
        >
          <Image src="/profile.svg" alt="Profile" width={30} height={30} />
        </div>
      </div>
    </nav>
  );
}
