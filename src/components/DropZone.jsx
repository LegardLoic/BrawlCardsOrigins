import { useDroppable } from "@dnd-kit/core";
import "@/styles/DropZone.css";

export default function DropZone({ id, children, className = "", style = {} }) {
  const { setNodeRef, isOver } = useDroppable({
    id,
  });

  return (
    <div
      ref={setNodeRef}
      className={className}
      style={{
        border: isOver ? "3px dashed gold" : "3px dashed transparent",
        backgroundColor: isOver ? "rgba(255, 255, 255, 0.1)" : "transparent",
        borderRadius: "12px",
        transition: "all 0.2s ease-in-out",
        ...style,
      }}
    >
      {children}
    </div>
  );
}
