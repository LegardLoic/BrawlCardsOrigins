import { createPortal } from "react-dom";
import { useEffect, useRef } from "react";

export default function ProjectileImage({ startX, startY, endX, endY, onEnd, imgSrc }) {
  const ref = useRef();

  const scale =
    parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--scale")) || 1;
  const size = 64 * scale;

  useEffect(() => {
    if (!ref.current) return;

    const el = ref.current;
    const duration = 600;

    el.style.transition = "none";
    el.style.transform = "translate(0, 0) rotate(0deg)";

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        el.style.transition = `transform ${duration}ms ease-out`;
        el.style.transform = `translate(${endX - startX}px, ${endY - startY}px) rotate(720deg)`;
      });
    });

    const handle = setTimeout(() => {
      onEnd?.();
    }, duration);

    return () => clearTimeout(handle);
  }, [startX, startY, endX, endY, onEnd]);

  const content = (
    <img
      ref={ref}
      src={imgSrc}
      alt="Projectile"
      className="projectile-img"
      style={{
        position: "absolute",
        top: `${startY}px`,
        left: `${startX}px`,
        width: `${size}px`,
        height: `${size}px`,
        pointerEvents: "none",
        zIndex: 1000,
        transform: "translate(0, 0) rotate(0deg)",
      }}
    />
  );

  return createPortal(content, document.getElementById("projectile-root"));
}
