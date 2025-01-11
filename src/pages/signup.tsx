import axios from "axios";
import style from "@/styles/signup.module.css";
import { useState } from "react";
import { useAuthStore } from "./authStore";
import { useRouter } from "next/router";

export default function SignUp() {
  const [formData, setFormData] = useState({
    nickname: "",
    password: "",
  });

  const [error, setError] = useState("");

  const router = useRouter();

  // Zustand 상태 업데이트 함수 가져오기
  const setUser = useAuthStore((state) => state.setUser);

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onHandleSignUp = async () => {
    if (!formData.nickname || !formData.password) {
      setError("닉네임과 비밀번호를 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post("/api/users", {
        nickname: formData.nickname,
        password: formData.password,
      });

      // 회원가입 성공 시 Zustand에 사용자 정보 저장
      setUser({ nickname: formData.nickname });
      alert("회원가입 성공!");
      router.push("/home");
      console.log(response.data);
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "회원가입에 실패했습니다.");
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    }
  };
  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onHandleSignUp();
    }
  };

  return (
    <div className={style.container}>
      <section>
        <h1 className={style.welcome}>Hey, Welcome Back!</h1>
      </section>
      <section>
        <div>
          <h3 className={style.input_text}>Nickname</h3>
          <input
            type="text"
            name="nickname"
            placeholder="사용하실 닉네임을 입력해주세요..."
            className={style.input_data}
            value={formData.nickname}
            onChange={onHandleChange}
          />
        </div>
        <div>
          <h3 className={style.input_text}>Password</h3>
          <input
            onKeyDown={onKeyDown}
            type="password"
            name="password"
            placeholder="비밀번호를 정해주세요..."
            className={style.input_data}
            value={formData.password}
            onChange={onHandleChange}
          />
          <button className={style.signup_button} onClick={onHandleSignUp}>
            Sign Up
          </button>
          {error && <p className={style.error}>{error}</p>}
        </div>
      </section>
    </div>
  );
}
