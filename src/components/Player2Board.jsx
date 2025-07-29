import "@/styles/Player2Board.css";
import  Card  from "@/components/Card";
import {
  SortableContext,
  useSortable,
  arrayMove,
  rectSortingStrategy
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

import { useDroppable } from '@dnd-kit/core'; // ajoute ça en haut du fichier

function SortableCardWrapper({ card, origin, index, onPreview, phase, carteAttaquantId, carteDefenseurId }) {
  const droppableId = `board-${card.id}`;

  const { setNodeRef: setDroppableRef } = useDroppable({
    id: droppableId,
  });

  const {
    attributes,
    listeners,
    setNodeRef: setSortableRef,
    transform,
    transition,
  } = useSortable({ id: card.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const combinedRef = (node) => {
    setSortableRef(node);
    setDroppableRef(node);
  };

  return (
    <div id={droppableId} ref={combinedRef} style={style} {...attributes} {...listeners}>
      <Card
        card={card}
        origin={origin}
        index={index}
        onPreview={onPreview}
        phase={phase}
        carteAttaquantId={carteAttaquantId}
        carteDefenseurId={carteDefenseurId}
      />
    </div>
  );
}

export default function Player2Board({ cards, origin, onPreview, phase, carteAttaquantId, carteDefenseurId }) {
  return (
    <div className="player2Board">
      <SortableContext items={cards.map((card) => card.id)} strategy={rectSortingStrategy}>
              {cards.map((card, index) => (
                <SortableCardWrapper
                  key={card.id}
                  card={card}
                  index={index}
                  origin={origin}
                  onPreview={onPreview}
                  phase={phase}
                  carteAttaquantId={carteAttaquantId}
                  carteDefenseurId={carteDefenseurId}
                />
              ))}
            </SortableContext>
    </div>

  );
}