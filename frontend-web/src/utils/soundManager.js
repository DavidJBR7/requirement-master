// src/utils/soundManager.js
import { Howl } from "howler";
import { useSoundStore } from "../store/soundStore";

const sounds = {
  correct: new Howl({
    src: ["/sounds/correct.mp3"],
    volume: 1.0,
  }),
  wrong: new Howl({
    src: ["/sounds/wrong.mp3"],
    volume: 1.0,
  }),
  completed_correct: new Howl({
    src: ["/sounds/completed_correct.mp3"],
    volume: 1.0,
  }),
  completed_wrong: new Howl({
    src: ["/sounds/completed_wrong.mp3"],
    volume: 1.0,
  }),
};

export function playSound(name) {
  const { isMuted, volume } = useSoundStore.getState();
  if (isMuted) return;

  const sound = sounds[name];
  if (!sound) {
    console.warn(`Sonido "${name}" no encontrado.`);
    return;
  }

  // Ajustamos el volumen global del sonido (opcional)
  sound.volume(volume);
  sound.play();
}

// Opcional: precarga todos los sonidos
export function preloadAllSounds() {
  Object.values(sounds).forEach((sound) => sound.load());
}