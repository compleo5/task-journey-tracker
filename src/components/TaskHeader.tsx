import { Button } from "@/components/ui/button";
import { Plus, LogOut, Archive, Kanban } from "lucide-react";

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
  isKanbanMode,
  onCreateClick,
  onArchiveToggle,
  onKanbanToggle,
  onLogout,
}: TaskHeaderProps) => (
  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
    <div>
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
        {showArchived ? "Archived Requests" : "Service Desk"}
      </h1>
      <p className="text-sm text-gray-600 mt-1">
        Welcome, {userEmail} {isAdmin && "(Admin)"}
      </p>
    </div>
    <div className="flex flex-wrap gap-2 sm:gap-4">
      {!showArchived && (
        <>
          <Button
            onClick={onCreateClick}
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            <Plus className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Request</span>
          </Button>
          <Button
            variant="outline"
            onClick={onKanbanToggle}
            className="flex items-center gap-2 text-sm sm:text-base"
          >
            <Kanban className="h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">
              {isKanbanMode ? "List View" : "Kanban View"}
            </span>
          </Button>
        </>
      )}
      <Button
        variant="outline"
        onClick={onArchiveToggle}
        className="flex items-center gap-2 text-sm sm:text-base"
      >
        <Archive className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">
          {showArchived ? "Active Requests" : "Archived"}
        </span>
      </Button>
      <Button
        variant="outline"
        onClick={onLogout}
        className="flex items-center gap-2 text-sm sm:text-base"
      >
        <LogOut className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden sm:inline">Logout</span>
      </Button>
    </div>
  </div>
);