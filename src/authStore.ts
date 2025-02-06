import { create } from "zustand";

// 사용자 정보 정의
interface User {
  nickname: string;
  user_id: string;
  profileImage: string | null;
  accessToken: string;
}

// Zustand에서 관리할 상태와 동작을 정의
interface AuthState {
  user: User | null;
  isLoggedIn: boolean;
  accessToken: string | null;
  setUser: (data: { user: User; token: string }) => void;
  logout: () => void;
}

// Zustand 스토어를 생성
export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  accessToken: null,

  setUser: ({ user, token }) =>
    set(() => ({
      user,
      isLoggedIn: true,
      accessToken: token,
    })),

  logout: () =>
    set(() => ({
      user: null,
      isLoggedIn: false,
      accessToken: null,
    })),
}));
