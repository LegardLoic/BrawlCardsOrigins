let soundEffectVolume = 1; // 🔊 Valeur par défaut à fond

export function setSoundEffectVolume(volume) {
  soundEffectVolume = volume;
}

export function playSound(src) {
  const audio = new Audio(src);
  audio.volume = soundEffectVolume; // ✅ utilise le volume global
  audio.play();
}
