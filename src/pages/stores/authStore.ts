import { create } from "zustand";

interface User {
  user_id: string; // 사용자 ID
  nickname: string;
}

interface AuthState {
  user: User | null;
  user_id: string | null; // user_id를 별도로 저장
  nickname: string | null; // nickname을 string으로 저장
  isLoggedIn: boolean;
  setUser: (user: User) => void;
  setUserId: (user_id: string) => void; // user_id만 업데이트하는 함수 추가
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  user_id: null, // user_id 초기값 null
  nickname: null, // nickname 초기값 null
  isLoggedIn: false,
  setUser: (user) =>
    set(() => ({
      user,
      user_id: user.user_id, // user_id 상태 업데이트
      nickname: user.nickname, // nickname 상태 업데이트
      isLoggedIn: true,
    })),
  setUserId: (user_id) =>
    set(() => ({
      user_id, // user_id만 업데이트하는 함수
    })),
  logout: () =>
    set(() => ({
      user: null,
      user_id: null, // 로그아웃 시 user_id 초기화
      nickname: null, // nickname 초기화
      isLoggedIn: false,
    })),
}));
