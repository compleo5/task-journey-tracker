import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { formatDistanceToNow } from "date-fns";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Pencil, Trash2 } from "lucide-react";

interface CommentThreadProps {
  taskId: string;
}

export const CommentThread = ({ taskId }: CommentThreadProps) => {
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
  const [editedContent, setEditedContent] = useState("");
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

  const handleEditComment = async (commentId: string) => {
    if (!editedContent.trim()) return;

    try {
      const { error } = await supabase
        .from('comments')
        .update({ content: editedContent.trim() })
        .eq('id', commentId);

      if (error) throw error;

      setEditingCommentId(null);
      setEditedContent("");
      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      toast.success("Comment updated successfully");
    } catch (error) {
      console.error('Error updating comment:', error);
      toast.error("Failed to update comment");
    }
  };

  const handleDeleteComment = async (commentId: string) => {
    try {
      const { error } = await supabase
        .from('comments')
        .delete()
        .eq('id', commentId);

      if (error) throw error;

      queryClient.invalidateQueries({ queryKey: ['comments', taskId] });
      toast.success("Comment deleted successfully");
    } catch (error) {
      console.error('Error deleting comment:', error);
      toast.error("Failed to delete comment");
    }
  };

  const startEditing = (comment: any) => {
    setEditingCommentId(comment.id);
    setEditedContent(comment.content);
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
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="font-medium text-gray-900">
                  {comment.created_by?.id}
                </span>
                <span className="text-sm text-gray-500">
                  {formatDistanceToNow(new Date(comment.created_at))} ago
                </span>
              </div>
              {user?.id === comment.created_by?.id && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => startEditing(comment)}
                    className="h-8 w-8"
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteComment(comment.id)}
                    className="h-8 w-8 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>
            {editingCommentId === comment.id ? (
              <div className="space-y-2">
                <Textarea
                  value={editedContent}
                  onChange={(e) => setEditedContent(e.target.value)}
                  className="min-h-[60px]"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={() => handleEditComment(comment.id)}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => {
                      setEditingCommentId(null);
                      setEditedContent("");
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <p className="text-gray-700">{comment.content}</p>
            )}
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