// src/store/soundStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useSoundStore = create(
  persist(
    (set, get) => ({
      isMuted: false,
      volume: 0.8,
      toggleMute: () => set({ isMuted: !get().isMuted }),
      setVolume: (vol) => set({ volume: vol }),
    }),
    {
      name: "sound-settings", // clave en localStorage
    }
  )
);