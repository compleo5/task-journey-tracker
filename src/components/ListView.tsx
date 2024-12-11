import { RequestCard } from "@/components/RequestCard";

interface ListViewProps {
  tasks: any[];
  onTaskClick: (taskId: string) => void;
}

export const ListView = ({ tasks, onTaskClick }: ListViewProps) => (
  <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
    {tasks?.map((task) => (
      <RequestCard
        key={task.id}
        title={task.title}
        description={task.description || ""}
        status={task.status}
        createdAt={new Date(task.created_at)}
        priority={task.priority}
        onClick={() => onTaskClick(task.id)}
      />
    ))}
  </div>
);