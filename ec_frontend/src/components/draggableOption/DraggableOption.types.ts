import type { ReactNode } from "react";

export default interface DraggableOptionProps {
  id: string;
  isVisible: boolean;
  children: ReactNode;
}
