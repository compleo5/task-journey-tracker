import { useState } from "react";

export const useKanbanView = () => {
  const [isKanbanMode, setIsKanbanMode] = useState(false);

  const toggleKanbanMode = () => {
    setIsKanbanMode(prev => !prev);
  };

  return {
    isKanbanMode,
    toggleKanbanMode,
  };
};