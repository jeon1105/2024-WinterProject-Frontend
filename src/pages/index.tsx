import { useRouter } from "next/router";
import style from "@/styles/index.module.css";
import { useState } from "react";
import axios from "axios";
import { useAuthStore } from "./stores/authStore"; // Zustand 가져오기

import NavigationLoginBar from "@/widgets/header_login";

interface LoginResponse {
  access_token: string;
  user_id: string;
  nickname: string;
}

export default function Login() {
  const [formData, setFormData] = useState({
    user_id: "",
    password: "",
  });

  const [error, setError] = useState("");
  const router = useRouter();

  // Zustand의 setUser 함수
  const setUser = useAuthStore((state) => state.setUser); // Zustand에서 setUser 가져오기

  const onHandleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const onHandleLogin = async () => {
    const { user_id, password } = formData;

    if (!user_id || !password) {
      setError("아이디와 비밀번호를 입력해주세요.");
      return;
    }

    try {
      // 로그인 요청
      const response = await axios.post<LoginResponse>(
        "http://52.78.134.101:5000/login",
        {
          user_id,
          password,
        },
        {
          withCredentials: true, // 쿠키와 자격 증명을 함께 보내기
        }
      );
      console.log(response);
      // 서버에서 Access Token을 받음
      const { access_token, user_id: LoginResponse, nickname } = response.data; // user 정보와 access_token을 받아옴
      console.log(access_token);
      console.log(user_id);
      localStorage.setItem("user", user_id);
      localStorage.setItem("user_id", user_id);

      // Access Token을 localStorage에 저장
      localStorage.setItem("access_token", access_token);

      // user 정보 저장 (Zustand 상태 업데이트)
      setUser({
        user_id: user_id, // user_id 상태에 저장
        nickname: nickname, // nickname 상태에 저장
      });
      console.log("Updated user:", useAuthStore.getState().user);

      // 로그인 성공 후 /home으로 리다이렉트
      alert("로그인 성공!");
      router.push("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data?.message || "로그인에 실패했습니다.");
      } else {
        setError("서버와 연결할 수 없습니다.");
      }
    }
  };

  const onHandleRedirectToSignUp = () => {
    router.push("/signup");
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onHandleLogin();
    }
  };

  return (
    <>
      <NavigationLoginBar />
      <hr />
      <div className={style.container}>
        <div>
          <h1 className={style.login_text}>Login</h1>
        </div>
        <div className={style.form_container}>
          <div>
            <h3 className={style.input_text}>ID</h3>
            <input
              type="text"
              name="user_id"
              placeholder="Enter your ID"
              className={style.input_data}
              value={formData.user_id}
              onChange={onHandleChange}
            />
          </div>
          <div>
            <h3 className={style.input_text}>Password</h3>
            <input
              type="password"
              name="password"
              onKeyDown={onKeyDown}
              placeholder="Enter your Password"
              className={style.input_data}
              value={formData.password}
              onChange={onHandleChange}
            />
            <div className={style.button_container}>
              <button
                className={style.button}
                onClick={onHandleRedirectToSignUp}
              >
                No Account?
              </button>
              <button onClick={onHandleLogin} className={style.button}>
                Log in
              </button>
            </div>
            {error && <p className={style.error}>{error}</p>}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
