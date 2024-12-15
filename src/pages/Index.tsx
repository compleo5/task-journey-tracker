import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { AppLayout } from "@/components/layout/AppLayout";
import { TaskContainer } from "@/components/tasks/TaskContainer";

type TaskStatus = Database['public']['Enums']['task_status'];

const Index = () => {
  const [showArchived, setShowArchived] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', showArchived],
    queryFn: async () => {
      let query = supabase
        .from('tasks')
        .select(`
          *,
          created_by:profiles!tasks_created_by_fkey(id),
          assigned_to:profiles!tasks_assigned_to_fkey(id)
        `)
        .order('created_at', { ascending: false });

      if (showArchived) {
        query = query.eq('status', 'archived');
      } else {
        query = query.neq('status', 'archived');
      }

      const { data, error } = await query;
      if (error) throw error;
      return data;
    },
  });

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDrop = async (e: React.DragEvent, newStatus: TaskStatus) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    
    try {
      const { error } = await supabase
        .from('tasks')
        .update({ status: newStatus })
        .eq('id', taskId);

      if (error) throw error;

      await queryClient.invalidateQueries({ queryKey: ['tasks'] });
      toast.success(`Task status updated to ${newStatus.split('-').join(' ')}`);
    } catch (error) {
      console.error('Error updating task status:', error);
      toast.error('Failed to update task status');
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <AppLayout showArchived={showArchived} setShowArchived={setShowArchived}>
      <TaskContainer
        tasks={tasks || []}
        isAdmin={isAdmin}
        userEmail={user?.email}
        showArchived={showArchived}
        onArchiveToggle={() => setShowArchived(!showArchived)}
        handleLogout={handleLogout}
        handleDragStart={handleDragStart}
        handleDrop={handleDrop}
      />
    </AppLayout>
  );
};

export default Index;