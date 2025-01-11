import { useRouter } from "next/router";
import { useAuthStore } from "@/pages/authStore";
import style from "./header.module.css";
import Image from "next/image";

export default function NavigationBar() {
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    alert("로그아웃 되었습니다.");
    router.push("/");
  };

  return (
    <nav className={style.top_bar}>
      <div className={style.Rectangle} />
      <h1 className={style.title}>Music Score Converter</h1>

      <div className={style.navigation}>
        <button className={style.Button} onClick={() => router.push("/home")}>
          Home
        </button>
        <button className={style.Button} onClick={handleLogout}>
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
