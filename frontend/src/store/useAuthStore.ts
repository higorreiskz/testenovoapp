import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { UserSummary } from "../types";

interface AuthState {
  user?: UserSummary;
  token?: string;
  isLoading: boolean;
  setAuth: (payload: { user: UserSummary; token: string }) => void;
  updateUser: (payload: Partial<UserSummary>) => void;
  logout: () => void;
  setLoading: (loading: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: undefined,
      token: undefined,
      isLoading: false,
      setAuth: ({ user, token }) => set({ user, token }),
      updateUser: (payload) =>
        set((state) =>
          state.user ? { user: { ...state.user, ...payload } } : state
        ),
      logout: () => set({ user: undefined, token: undefined }),
      setLoading: (loading) => set({ isLoading: loading }),
    }),
    { name: "clipzone-auth" }
  )
);

export default useAuthStore;
