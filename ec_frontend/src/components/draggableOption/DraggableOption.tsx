import { useDraggable } from "@dnd-kit/core";
import type DraggableOptionProps from "./DraggableOption.types";

export default function DraggableOption({
  id,
  isVisible,
  children,
}: DraggableOptionProps) {
  const { setNodeRef, listeners, attributes, transform } = useDraggable({
    id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    cursor: "grab",
    display: isVisible ? "block" : "none",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      {children}
    </div>
  );
}
