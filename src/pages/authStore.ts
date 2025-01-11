import { create } from "zustand";

interface AuthState {
  user: { nickname: string } | null;
  isLoggedIn: boolean;
  setUser: (user: { nickname: string }) => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  isLoggedIn: false,
  setUser: (user) =>
    set(() => ({
      user,
      isLoggedIn: true,
    })),
  logout: () =>
    set(() => ({
      user: null,
      isLoggedIn: false,
    })),
}));
