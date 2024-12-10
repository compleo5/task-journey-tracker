import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RequestCard } from "@/components/RequestCard";
import { RequestDetails } from "@/components/RequestDetails";
import { CreateRequestForm } from "@/components/CreateRequestForm";
import { Plus, LogOut, Archive } from "lucide-react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useNavigate } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

const Index = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showArchived, setShowArchived] = useState(false);
  const { user, isAdmin } = useAuth();
  const navigate = useNavigate();

  const { data: tasks, isLoading } = useQuery({
    queryKey: ['tasks', showArchived],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('tasks')
        .select(`
          *,
          created_by:profiles!tasks_created_by_fkey(id),
          assigned_to:profiles!tasks_assigned_to_fkey(id)
        `)
        .eq('status', showArchived ? 'archived' : 'new')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data;
    },
  });

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  const selectedTask = tasks?.find(task => task.id === selectedRequest);

  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              {showArchived ? "Archived Requests" : "Service Desk"}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Welcome, {user?.email} {isAdmin && "(Admin)"}
            </p>
          </div>
          <div className="flex gap-4">
            {!showArchived && (
              <Button
                onClick={() => setShowCreateForm(true)}
                className="flex items-center gap-2"
              >
                <Plus size={20} />
                New Request
              </Button>
            )}
            <Button
              variant="outline"
              onClick={() => setShowArchived(!showArchived)}
              className="flex items-center gap-2"
            >
              <Archive size={20} />
              {showArchived ? "Active Requests" : "Archived Requests"}
            </Button>
            <Button
              variant="outline"
              onClick={handleLogout}
              className="flex items-center gap-2"
            >
              <LogOut size={20} />
              Logout
            </Button>
          </div>
        </div>

        {showCreateForm ? (
          <div className="bg-white rounded-lg shadow p-6 mb-8">
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
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {tasks?.map((task) => (
              <RequestCard
                key={task.id}
                title={task.title}
                description={task.description || ""}
                status={task.status}
                createdAt={new Date(task.created_at)}
                priority={task.priority}
                onClick={() => setSelectedRequest(task.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;