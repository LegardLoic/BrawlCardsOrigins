import { useDraggable } from "@dnd-kit/core";
import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import DamagePopup from "./DamagePopup";
export default function Card({ card, origin, onPreview, phase, carteAttaquantId, carteDefenseurId, }) {
    const animatedCards = new Set(); // Persistant entre renders
    const isAttaquant = phase === "combat" && card.id === carteAttaquantId;
    const controls = useAnimation();
    const [degatsAffiches, setDegatsAffiches] = useState(null);
    const [buffAtk, setBuffAtk] = useState(false);
    const [buffHp, setBuffHp] = useState(false);
    const [pulseAtk, setPulseAtk] = useState(false);
    const [pulseHp, setPulseHp] = useState(false);
    const [shouldAnimate, setShouldAnimate] = useState(() => {
      if (animatedCards.has(card.id)) return false;
      animatedCards.add(card.id);
      return true;
    });
    const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
      id: `${origin}-${card.id}`,
      data: { source: origin, card },
    });

    const classGlow = 
      card.estDoree && card.furieUse ? "golden-furie-glow"
      : card.estDoree && card.aura ? "golden-aura-glow"
      : card.estDoree ? "golden-glow"
      : card.furieUse ? "furie-glow"
      : card.aura ? "aura-glow"
      : "";

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
    zIndex: isDragging || isAttaquant ? 999 : 1, // 👉 ici !
    position: "relative",
    willChange: "transform",
    touchAction: "none", // ✅ indispensable pour le mobile
    
  };
    // ✅ Animation d’entrée
    useEffect(() => {
        const timeout = setTimeout(() => setShouldAnimate(false), 1000);
        return () => clearTimeout(timeout);
      }, []);

     // ✅ Animation d’attaque
  useEffect(() => {
    if (phase !== "combat" || card.id !== carteAttaquantId) return;

    const attacker = document.querySelector(`[data-id='${carteAttaquantId}']`);
    const defender = document.querySelector(`[data-id='${carteDefenseurId}']`);
    if (!attacker || !defender) return;

    const aRect = attacker.getBoundingClientRect();
    const dRect = defender.getBoundingClientRect();

    const scale = parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue("--scale")
    ) || 1;

    const deltaX = (dRect.left - aRect.left) * 0.6 / scale;
    const deltaY = (dRect.top - aRect.top) * 0.6 / scale;

    controls.start({
      x: deltaX,
      y: deltaY,
      transition: { duration: 0.3, ease: [0.2, 0, 0.6, 3] }, // ⚡ Accéléré
    }).then(() => {
      controls.start({
        x: 0,
        y: 0,
        transition: { duration: 0.25, ease: "easeOut" },
      });
    });
  }, [carteAttaquantId, carteDefenseurId, phase, card.id, controls]);

    // ✅ Dégâts reçus (secouement + popup)
    useEffect(() => {
    
      if (
        phase === "combat"  &&
        card.degatsRecus > 0
      ) {
        controls.start({
          x: [0, -10, 10, -6, 6, -2, 2, 0],
          transition: { duration: 0.4 },
        });
  
        setDegatsAffiches(card.degatsRecus);
        setTimeout(() => setDegatsAffiches(null), 800);
      }
    }, [carteDefenseurId, card.degatsRecus, phase, card.id, controls]);

      // ✅ Buff visuel (détecte changement atk/hp)
      useEffect(() => {
        const prevAtk = card.baseAtk ?? card.atk;
        const prevHp = card.baseHp ?? card.hp;
    
        if (card.atk > prevAtk) {
          setBuffAtk(true);
          setTimeout(() => setBuffAtk(false), 600);
        }
        if (card.hp > prevHp) {
          setBuffHp(true);
          setTimeout(() => setBuffHp(false), 600);
        }
      }, [card.atk, card.hp]);
  
      useEffect(() => {
        if (card.atk > card.baseAtk) {
          setPulseAtk(true);
          setTimeout(() => setPulseAtk(false), 400);
        }
      }, [card.atk]);
      
      useEffect(() => {
        if (card.hp > card.baseHp) {
          setPulseHp(true);
          setTimeout(() => setPulseHp(false), 400);
        }
      }, [card.hp]);
      useEffect(() => {
      }, [card]);

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      style={style}
      className="card-wrapper" // 💡 pour position:relative
    >
      <motion.div
        animate={controls}
        className={`cardfight player content-card ${
          shouldAnimate ? "animate__animated animate__backInLeft" : ""
        } ${card.animAoE ? "aoe-hit" : ""}`}
        data-id={card.id}
        data-fullimg={card.img}
        onDoubleClick={() => onPreview?.(card)}
      >
      <AnimatePresence mode="wait">
        <motion.img
          key={
            card.provocationUse && card.bouclierUse
              ? "provoc_bouclier"
              : card.provocationUse
              ? "provoc"
              : card.bouclierUse
              ? "bouclier"
              : "normal"
          }
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className={`cardimg ${classGlow}`}
            
          src={
            card.provocationUse && card.bouclierUse
              ? card.imgMiniaProvocBouclier
              : card.provocationUse
              ? card.imgMiniaProvoc
              : card.bouclierUse
              ? card.imgMiniaBouclier
              : card.imgMinia
          }
          alt={card.nom}
        />
      </AnimatePresence>

        
  
        <p
          className={`hudIntAtk ${card.atk > card.baseAtk ? "buffed" : ""} ${
            pulseAtk ? "pulse" : ""
          }`}
        >
          {card.atk}
        </p>
        <p
          className={`hudIntPv ${
            phase === "combat" && card.hp < card.hpCombat ? "pv-damaged" : ""
          }${card.hp > card.baseHp ? " buffed" : ""} ${pulseHp ? "pulse" : ""}`}
        >
          {card.hp}
        </p>
  
        {degatsAffiches !== null && <DamagePopup amount={degatsAffiches} />}
      </motion.div>
    </div>
  );
}
