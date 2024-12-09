import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { useAuth } from "@/components/AuthProvider";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface CreateRequestFormProps {
  onSuccess?: () => void;
}

export const CreateRequestForm = ({ onSuccess }: CreateRequestFormProps) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState<"low" | "medium" | "high">("medium");
  const { user } = useAuth();
  const queryClient = useQueryClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    try {
      const { error } = await supabase
        .from('tasks')
        .insert({
          title,
          description,
          priority,
          created_by: user.id,
        });

      if (error) throw error;

      toast.success("Request created successfully");
      queryClient.invalidateQueries({ queryKey: ['tasks'] });
      onSuccess?.();
    } catch (error) {
      console.error('Error creating request:', error);
      toast.error("Failed to create request");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Title</label>
        <Input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Brief description of your request"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Description</label>
        <Textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Provide more details about your request..."
          className="h-32"
          required
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium text-gray-700">Priority</label>
        <Select value={priority} onValueChange={(value: "low" | "medium" | "high") => setPriority(value)}>
          <SelectTrigger>
            <SelectValue placeholder="Select priority" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="low">Low</SelectItem>
            <SelectItem value="medium">Medium</SelectItem>
            <SelectItem value="high">High</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <Button type="submit" className="w-full">
        Submit Request
      </Button>
    </form>
  );
};