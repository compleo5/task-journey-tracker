import { RequestCard } from "@/components/RequestCard";
import { Database } from "@/integrations/supabase/types";

type TaskStatus = Database['public']['Enums']['task_status'];

interface KanbanViewProps {
  tasks: any[];
  onTaskClick: (taskId: string) => void;
  onDragStart: (e: React.DragEvent, taskId: string) => void;
  onDrop: (e: React.DragEvent, status: TaskStatus) => void;
}

export const KanbanView = ({ tasks, onTaskClick, onDragStart, onDrop }: KanbanViewProps) => {
  const columns: Record<TaskStatus, any[]> = {
    'new': tasks?.filter(task => task.status === 'new') || [],
    'in-consideration': tasks?.filter(task => task.status === 'in-consideration') || [],
    'in-implementation': tasks?.filter(task => task.status === 'in-implementation') || [],
    'done': tasks?.filter(task => task.status === 'done') || [],
    'backlogged': tasks?.filter(task => task.status === 'backlogged') || [],
    'archived': tasks?.filter(task => task.status === 'archived') || [],
  };

  return (
    <div className="overflow-x-auto pb-4">
      <div className="grid grid-flow-col auto-cols-[minmax(300px,1fr)] gap-4 min-w-full">
        {Object.entries(columns).map(([status, columnTasks]) => (
          <div 
            key={status} 
            className="bg-gray-50 p-4 rounded-lg"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => onDrop(e, status as TaskStatus)}
          >
            <h3 className="text-lg font-semibold mb-4 capitalize">
              {status.split('-').join(' ')}
            </h3>
            <div className="space-y-4">
              {columnTasks.map(task => (
                <RequestCard
                  key={task.id}
                  taskId={task.id}
                  title={task.title}
                  description={task.description || ""}
                  status={task.status}
                  createdAt={new Date(task.created_at)}
                  priority={task.priority}
                  onClick={() => onTaskClick(task.id)}
                  onDragStart={onDragStart}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};