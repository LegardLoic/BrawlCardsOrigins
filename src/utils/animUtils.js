export function lancerAnimationCriDeGuerreAoE(sourceCardId) {
  const source = document.querySelector(`[data-id='${sourceCardId}']`);
  if (!source) return;

  const sourceRect = source.getBoundingClientRect();

  const aura = document.createElement("div");
  aura.className = "cri-de-guerre-aura";
  aura.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
  aura.style.top = `${sourceRect.top + sourceRect.height / 2}px`;

  document.body.appendChild(aura);

  setTimeout(() => {
    aura.remove();
  }, 800);
}

export function lancerAnimationCriDeGuerreUnique(sourceCardId, targetCardId) {
  const source = document.querySelector(`[data-id='${sourceCardId}']`);
  const target = document.querySelector(`[data-id='${targetCardId}']`);

  if (!source || !target) return;

  // 1. Aura circulaire sur la source
  const sourceRect = source.getBoundingClientRect();
  const aura = document.createElement("div");
  aura.className = "cri-de-guerre-aura";
  aura.style.left = `${sourceRect.left + sourceRect.width / 2}px`;
  aura.style.top = `${sourceRect.top + sourceRect.height / 2}px`;
  document.body.appendChild(aura);

  // Nettoyage de l'aura après 0.6s
  setTimeout(() => {
    aura.remove();
  }, 800);

  // 2. Glow temporaire sur la cible après un petit délai
  setTimeout(() => {
    target.classList.add("cri-de-guerre-glow-target");
    setTimeout(() => {
      target.classList.remove("cri-de-guerre-glow-target");
    }, 600); // durée de l'animation
  }, 400); // délai pour laisser le temps à l’aura d’apparaître
}



