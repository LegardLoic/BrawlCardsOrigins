import { useLocation } from "react-router-dom";
import GameIA from "@/components/GameIA";
import Game1v1 from "@/components/Game1v1";

export default function Game() {
  const location = useLocation();
  const mode = location.state?.mode || "ia"; // Par défaut, mode IA

  return (
    <div className="game">
      {mode === "ia" ? <GameIA /> : <Game1v1 />}
    </div>
  );
}

