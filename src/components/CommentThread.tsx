import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

interface CommentThreadProps {
  taskId: string;
}

export const CommentThread = ({ taskId }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['comments', taskId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('comments')
        .select(`
          *,
          created_by:profiles!comments_created_by_fkey(id, is_admin)
        `)
        .eq('task_id', taskId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return data;
    },
  });

  const handleSubmitComment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !newComment.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .insert({
          content: newComment.trim(),
          task_id: taskId,
          created_by: user.id,
        });

      if (error) throw error;

      setNewComment("");
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      toast.success("Comment added successfully");
    } catch (error) {
      console.error('Error adding comment:', error);
      toast.error("Failed to add comment");
    }
  };

  if (isLoading) {
    return <div>Loading comments...</div>;
  }

  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 animate-fade-in">
          <Avatar className="w-10 h-10">
            <div className={`w-full h-full flex items-center justify-center ${
              comment.created_by?.is_admin ? "bg-primary text-white" : "bg-secondary text-gray-700"
            }`}>
              {comment.created_by?.id[0].toUpperCase()}
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">
                {comment.created_by?.id}
              </span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(new Date(comment.created_at))} ago
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        </div>
      ))}

      <form onSubmit={handleSubmitComment} className="mt-6">
        <Textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment..."
          className="mb-4"
          required
        />
        <Button type="submit" disabled={!newComment.trim()}>
          Add Comment
        </Button>
      </form>
    </div>
  );
};