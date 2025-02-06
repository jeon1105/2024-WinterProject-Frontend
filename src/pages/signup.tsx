import axios from "axios";
import style from "@/styles/signup.module.css";
import { useState } from "react";
import { useAuthStore } from "./stores/authStore";
import { useRouter } from "next/router";
import NavigationLoginBar from "@/widgets/header_login";

export default function SignUp() {
  const [formData, setFormData] = useState({
    nickname: "",
    user_id: "",
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
      console.log("Sending POST request with data:", formData);
      const response = await axios.post(
        "https://smini.site/signup",
        {
          nickname: formData.nickname,
          user_id: formData.user_id,
          password: formData.password,
        },
        {
          withCredentials: true,
        }
      );
      console.log("Response received:", response);
      setUser({
        user_id: formData.user_id,
        nickname: formData.nickname,
      });

      alert("회원가입 성공!");
      router.push("/home");
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        setError(error.response?.data?.message || "회원가입에 실패했습니다.");
      } else {
        console.error("Unknown error:", error);
        setError("서버와 연결할 수 없습니다.");
      }
    }
  };

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // 버튼의 기본 동작(폼 제출)을 막음
    onHandleSignUp();
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      onHandleSignUp();
    }
  };

  return (
    <>
      <NavigationLoginBar />
      <hr />
      <div className={style.container}>
        <div>
          <h1 className={style.signup_container}>Registration Information</h1>
          <p>Please fill in the required fields.</p>
        </div>
        <div className={style.form_container}>
          <div>
            <h3 className={style.input_text}>Nickname</h3>
            <input
              type="text"
              name="nickname"
              placeholder="Enter your nickname"
              className={style.input_data}
              value={formData.nickname}
              onChange={onHandleChange}
            />
          </div>
          <div>
            <h3 className={style.input_text}>ID</h3>
            <input
              type="text"
              name="user_id"
              placeholder="Enter your user ID"
              className={style.input_data}
              value={formData.user_id}
              onChange={onHandleChange}
            />
          </div>
          <div>
            <h3 className={style.input_text}>Password</h3>
            <input
              onKeyDown={onKeyDown}
              type="password"
              name="password"
              placeholder="Enter your password"
              className={style.input_data}
              value={formData.password}
              onChange={onHandleChange}
            />
            <button
              className={style.signup_button}
              onClick={handleSubmit}
              type="button"
            >
              Sign Up
            </button>
            {error && <p className={style.error}>{error}</p>}
          </div>
        </div>
      </div>
      <hr />
    </>
  );
}
