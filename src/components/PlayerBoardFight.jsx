import "../styles/PlayerBoardFight.css";
import  Card  from "@/components/Card";
export default function PlayerBoardFight({ cards, origin, onPreview, phase, carteAttaquantId, carteDefenseurId }) {
  return (
    <div className="playerBoardFight">
      {cards.map((card, index) => (
        <Card key={card.id} card={card} origin={origin} index={index} onPreview={onPreview} phase={phase} carteAttaquantId={carteAttaquantId} carteDefenseurId={carteDefenseurId} />
      ))}
    </div>

  );
}