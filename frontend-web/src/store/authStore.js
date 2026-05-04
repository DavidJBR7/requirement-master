import { create } from "zustand";
import { persist } from "zustand/middleware";

function decodeJwt(token) {
  try {
    return JSON.parse(atob(token.split(".")[1]));
  } catch {
    return null;
  }
}

export const useAuthStore = create(
  persist(
    (set, get) => ({
      accessToken: null,
      refreshToken: null,
      user: null,
      rememberMe: false,

      setTokens: (accessToken, refreshToken) => {
        const payload = decodeJwt(accessToken);
        const user = payload
          ? { id: Number(payload.sub), username: payload.username }
          : null;
        set({ accessToken, refreshToken, user });
      },

      login: (accessToken, refreshToken, rememberMe) => {
        const payload = decodeJwt(accessToken);
        const user = payload
          ? { id: Number(payload.sub), username: payload.username }
          : null;
        set({ accessToken, refreshToken, rememberMe, user });
      },

      logout: () =>
        set({
          accessToken: null,
          refreshToken: null,
          user: null,
          rememberMe: false,
        }),
    }),
    {
      name: "auth-storage",
      partialize: (state) => ({
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
        rememberMe: state.rememberMe,
      }),
    },
  ),
);
