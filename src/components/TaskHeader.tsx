import { Button } from "@/components/ui/button";
import { Plus, LayoutGrid } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface TaskHeaderProps {
  userEmail?: string;
  isAdmin?: boolean;
  showArchived: boolean;
  isKanbanMode: boolean;
  onCreateClick: () => void;
  onArchiveToggle: () => void;
  onKanbanToggle: () => void;
  onLogout: () => void;
}

export const TaskHeader = ({
  userEmail,
  isAdmin,
  showArchived,
  onCreateClick,
  onKanbanToggle,
}: TaskHeaderProps) => {
  const isMobile = useIsMobile();

  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
      <div className="flex justify-between items-center w-full">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
            {showArchived ? "Archived Requests" : "Service Desk"}
          </h1>
          <p className="text-sm text-gray-600 mt-1">
            Welcome, {userEmail} {isAdmin && "(Admin)"}
          </p>
        </div>
        <Button
          variant="ghost"
          onClick={onKanbanToggle}
          className="p-2"
          aria-label="Toggle view"
        >
          <LayoutGrid className="h-5 w-5" />
        </Button>
      </div>
      {!showArchived && !isMobile && (
        <Button
          onClick={onCreateClick}
          className="flex items-center gap-2 text-sm sm:text-base"
        >
          <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
          <span className="hidden sm:inline">New Request</span>
        </Button>
      )}
    </div>
  );
};