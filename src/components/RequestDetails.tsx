import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CommentThread } from "@/components/CommentThread";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from "date-fns";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { useQueryClient } from "@tanstack/react-query";

// Define the exact status types to match the database enum
type TaskStatus = "new" | "in-consideration" | "in-implementation" | "done" | "archived" | "backlogged";

interface RequestDetailsProps {
  task: {
    id: string;
    title: string;
    description?: string | null;
    status: TaskStatus;  // Use the precise type here
    priority: "low" | "medium" | "high";
    created_at: string;
    created_by?: { id: string } | null;
    assigned_to?: { id: string } | null;
  };
  onBack: () => void;
}

const statusColors = {
  "new": "bg-blue-100 text-blue-800",
  "in-consideration": "bg-purple-100 text-purple-800",
  "in-implementation": "bg-yellow-100 text-yellow-800",
  "done": "bg-green-100 text-green-800",
  "archived": "bg-gray-100 text-gray-800",
  "backlogged": "bg-orange-100 text-orange-800",
};

const priorityColors = {
  "low": "bg-gray-100 text-gray-800",
  "medium": "bg-orange-100 text-orange-800",
  "high": "bg-red-100 text-red-800",
};

export const RequestDetails = ({ task, onBack }: RequestDetailsProps) => {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();

  const handleStatusChange = async (newStatus: TaskStatus) => {
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', task.id);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success("Status updated successfully");
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error("Failed to update status");
    }
  };

  const canUpdateStatus = isAdmin || user?.id === task.created_by?.id || user?.id === task.assigned_to?.id;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <Button variant="ghost" onClick={onBack}>← Back to List</Button>
        {canUpdateStatus && (
          <Select value={task.status} onValueChange={handleStatusChange}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Update status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in-consideration">In Consideration</SelectItem>
              <SelectItem value="in-implementation">In Implementation</SelectItem>
              <SelectItem value="done">Done</SelectItem>
              <SelectItem value="archived">Archive</SelectItem>
              <SelectItem value="backlogged">Backlog</SelectItem>
            </SelectContent>
          </Select>
        )}
      </div>

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-start mb-4">
          <h1 className="text-2xl font-bold text-gray-900">{task.title}</h1>
          <div className="flex gap-2">
            <Badge className={priorityColors[task.priority]}>
              {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
            </Badge>
            <Badge className={statusColors[task.status]}>
              {task.status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
            </Badge>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          <p className="text-gray-700">{task.description}</p>
          <div className="text-sm text-gray-500">
            Created {formatDistanceToNow(new Date(task.created_at))} ago
            {task.created_by?.id && ` by ${task.created_by.id}`}
          </div>
          {task.assigned_to?.id && (
            <div className="text-sm text-gray-500">
              Assigned to: {task.assigned_to.id}
            </div>
          )}
        </div>

        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold mb-4">Comments</h2>
          <CommentThread taskId={task.id} />
        </div>
      </div>
    </div>
  );
};