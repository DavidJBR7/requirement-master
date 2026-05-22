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
      user: null, // { id, username, email, fullName }
      rememberMe: false,

      setTokens: (accessToken, refreshToken) => {
        const payload = decodeJwt(accessToken);
        const baseUser = payload
          ? { id: Number(payload.sub), username: payload.username }
          : null;
        // Mantener datos previos de email/fullName si existían
        const prevUser = get().user;
        const user = baseUser
          ? {
              ...baseUser,
              email: prevUser?.email || null,
              fullName: prevUser?.fullName || null,
            }
          : null;
        set({ accessToken, refreshToken, user });
      },

      login: (accessToken, refreshToken, rememberMe) => {
        const payload = decodeJwt(accessToken);
        const baseUser = payload
          ? { id: Number(payload.sub), username: payload.username }
          : null;
        set({
          accessToken,
          refreshToken,
          rememberMe,
          user: baseUser ? { ...baseUser, email: null, fullName: null } : null,
        });
      },

      setUserProfile: (profile) =>
        set((state) => ({
          user: state.user
            ? { ...state.user, ...profile }
            : { id: profile.id, ...profile },
        })),

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
