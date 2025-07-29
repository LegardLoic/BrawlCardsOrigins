import "@/styles/Player2Deck.css";
import  DeckCard  from "@/components/DeckCard";

export default function Player2Deck({ cards, origin, onDeck, onPreview }) {
  return (
    <div className="playerDeck">
      {cards.map((card, index) => (
        <DeckCard key={card.id} card={card} origin={origin} onDeck={onDeck} index={index} onPreview={onPreview} />
      ))}
    </div>

  );
}