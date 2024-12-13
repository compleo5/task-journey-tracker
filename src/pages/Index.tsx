import { useState } from "react";
import { CreateRequestForm } from "@/components/CreateRequestForm";
import { RequestDetails } from "@/components/RequestDetails";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Database } from "@/integrations/supabase/types";
import { TaskHeader } from "@/components/TaskHeader";
import { TaskStatistics } from "@/components/TaskStatistics";
import { KanbanView } from "@/components/KanbanView";
import { ListView } from "@/components/ListView";
import { Button } from "@/components/ui/button";
import { FloatingActionButton } from "@/components/FloatingActionButton";
import { Archive, LogOut } from "lucide-react";

type TaskStatus = Database['public']['Enums']['task_status'];

const Index = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const [isKanbanMode, setIsKanbanMode] = useState(false);
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

  const selectedTask = tasks?.find(task => task.id === selectedRequest);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  // Calculate statistics
  const stats = {
    total: tasks?.length || 0,
    new: tasks?.filter(task => task.status === 'new').length || 0,
    inImplementation: tasks?.filter(task => task.status === 'in-implementation').length || 0,
    done: tasks?.filter(task => task.status === 'done').length || 0,
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Sidebar */}
        <div className="hidden sm:flex flex-col w-64 bg-white h-screen p-4 border-r">
          <div className="flex-grow">
            <Button
              variant="ghost"
              className="w-full justify-start mb-2"
              onClick={() => setShowArchived(!showArchived)}
            >
              <Archive className="mr-2 h-5 w-5" />
              {showArchived ? "Active Requests" : "Archived"}
            </Button>
          </div>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="mr-2 h-5 w-5" />
            Logout
          </Button>
        </div>

        {/* Main Content */}
        <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
          <TaskHeader
            userEmail={user?.email}
            isAdmin={isAdmin}
            showArchived={showArchived}
            isKanbanMode={isKanbanMode}
            onCreateClick={() => setShowCreateForm(true)}
            onArchiveToggle={() => setShowArchived(!showArchived)}
            onKanbanToggle={() => setIsKanbanMode(!isKanbanMode)}
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
        </div>
      </div>
    </div>
  );
};

export default Index;