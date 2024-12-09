import { Avatar } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";

interface Comment {
  id: string;
  author: string;
  content: string;
  createdAt: Date;
  isAdmin: boolean;
}

interface CommentThreadProps {
  comments: Comment[];
}

export const CommentThread = ({ comments }: CommentThreadProps) => {
  return (
    <div className="space-y-6">
      {comments.map((comment) => (
        <div key={comment.id} className="flex gap-4 animate-fade-in">
          <Avatar className="w-10 h-10">
            <div className={`w-full h-full flex items-center justify-center ${
              comment.isAdmin ? "bg-primary text-white" : "bg-secondary text-gray-700"
            }`}>
              {comment.author[0].toUpperCase()}
            </div>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-900">
                {comment.author}
              </span>
              <span className="text-sm text-gray-500">
                {formatDistanceToNow(comment.createdAt)} ago
              </span>
            </div>
            <p className="text-gray-700">{comment.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
};