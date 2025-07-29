import { useDraggable } from "@dnd-kit/core";
import { useState, useEffect } from "react";

export default function DeckCard({ card, origin, index, onPreview }) {
  const animatedCardsDeck = new Set(); // Persistant entre renders
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `${origin}-${card.id}`,
    data: { source: origin, card },
  });
      const [shouldAnimateDeck, setShouldAnimateDeck] = useState(() => {
        if (animatedCardsDeck.has(card.id)) return false;
        animatedCardsDeck.add(card.id);
        return true;
      });
      

  // ✅ Compensation du scale (lié à .image-wrapper)
  const scale =
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--scale")
    ) || 1;

  const style = {
    transform: transform
      ? `translate3d(${transform.x / scale}px, ${transform.y / scale}px, 0)`
      : undefined,
    cursor: "grab",
    zIndex: isDragging ? 999 : 1,
    position: "relative",
    willChange: "transform",
    touchAction: "none", // ✅ important pour mobile aussi
  };
  // ✅ Animation d’entrée
  useEffect(() => {
    const timeout = setTimeout(() => setShouldAnimateDeck(false), 1000);
      return () => clearTimeout(timeout);
    }, []);

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...listeners}
      {...attributes}
      id={card.id}
      onDoubleClick={() => {
        console.log("Double clic détecté sur", card.nom);
        onPreview?.(card);
      }}
      className={`cardInDeck${index} text-white content-card ${
        shouldAnimateDeck ? "animate__animated animate__backInRight" : ""
        }`}
      data-fullimg={card.img}
    >
      <img className="fullCard" data-id={card.id} src={card.img} alt={card.nom} />
      <div className="hudDeck">
        <p className="atkPreviewDeck">{card.atk}</p>
        <p className="hpPreviewDeck">{card.hp}</p>
      </div>
    </div>
  );
}