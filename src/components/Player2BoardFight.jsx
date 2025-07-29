import "../styles/Player2Board.css";
import  Card  from "@/components/Card";
export default function Player2BoardFight({ cards, origin, onPreview, phase, carteAttaquantId, carteDefenseurId }) {
  return (
    <div className="player2BoardFight">
      {cards.map((card, index) => (
        <Card key={card.id} card={card} origin={origin} index={index} onPreview={onPreview} phase={phase} carteAttaquantId={carteAttaquantId} carteDefenseurId={carteDefenseurId} />
      ))}
    </div>

  );
}