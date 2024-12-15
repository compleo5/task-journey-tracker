import { CreateRequestForm } from "@/components/CreateRequestForm";
import { RequestDetails } from "@/components/RequestDetails";
import { TaskHeader } from "@/components/TaskHeader";
import { TaskStatistics } from "@/components/TaskStatistics";
import { KanbanView } from "@/components/KanbanView";
import { ListView } from "@/components/ListView";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Database } from "@/integrations/supabase/types";
import { useKanbanView } from "@/hooks/use-kanban-view";
import { useState } from "react";

type TaskStatus = Database['public']['Enums']['task_status'];

interface TaskContainerProps {
  tasks: any[];
  isAdmin: boolean;
  userEmail: string | undefined;
  showArchived: boolean;
  onArchiveToggle: () => void;
  handleLogout: () => void;
  handleDragStart: (e: React.DragEvent, taskId: string) => void;
  handleDrop: (e: React.DragEvent, newStatus: TaskStatus) => void;
}

export const TaskContainer = ({
  tasks,
  isAdmin,
  userEmail,
  showArchived,
  onArchiveToggle,
  handleLogout,
  handleDragStart,
  handleDrop,
}: TaskContainerProps) => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { isKanbanMode, toggleKanbanMode } = useKanbanView();

  const stats = {
    total: tasks?.length || 0,
    new: tasks?.filter(task => task.status === 'new').length || 0,
    inImplementation: tasks?.filter(task => task.status === 'in-implementation').length || 0,
    done: tasks?.filter(task => task.status === 'done').length || 0,
  };

  const selectedTask = tasks?.find(task => task.id === selectedRequest);

  return (
    <>
      <TaskHeader
        userEmail={userEmail}
        isAdmin={isAdmin}
        showArchived={showArchived}
        isKanbanMode={isKanbanMode}
        onCreateClick={() => setShowCreateForm(true)}
        onArchiveToggle={onArchiveToggle}
        onKanbanToggle={toggleKanbanMode}
        onLogout={handleLogout}
      />

      <TaskStatistics {...stats} />

      {showCreateForm ? (
        <div className="bg-white rounded-lg shadow p-4 sm:p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold">Create New Request</h2>
            <Button
              variant="ghost"
              onClick={() => setShowCreateForm(false)}
            >
              Cancel
            </Button>
          </div>
          <CreateRequestForm onSuccess={() => setShowCreateForm(false)} />
        </div>
      ) : selectedRequest && selectedTask ? (
        <RequestDetails 
          task={selectedTask}
          onBack={() => setSelectedRequest(null)}
        />
      ) : (
        <>
          {isKanbanMode ? (
            <KanbanView
              tasks={tasks}
              onTaskClick={setSelectedRequest}
              onDragStart={handleDragStart}
              onDrop={handleDrop}
            />
          ) : (
            <ListView
              tasks={tasks}
              onTaskClick={setSelectedRequest}
            />
          )}
          <FloatingActionButton onClick={() => setShowCreateForm(true)} />
        </>
      )}
    </>
  );
};