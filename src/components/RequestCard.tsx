import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatDistanceToNow } from "date-fns";

interface RequestCardProps {
  title: string;
  description: string;
  status: "open" | "in-progress" | "resolved";
  priority: "low" | "medium" | "high";
  createdAt: Date;
  onClick: () => void;
}

const statusColors = {
  "open": "bg-yellow-100 text-yellow-800",
  "in-progress": "bg-blue-100 text-blue-800",
  "resolved": "bg-green-100 text-green-800",
};

const priorityColors = {
  "low": "bg-gray-100 text-gray-800",
  "medium": "bg-orange-100 text-orange-800",
  "high": "bg-red-100 text-red-800",
};

export const RequestCard = ({ title, description, status, priority, createdAt, onClick }: RequestCardProps) => {
  return (
    <Card 
      className="p-6 hover:shadow-md transition-shadow cursor-pointer animate-fade-in"
      onClick={onClick}
    >
      <div className="flex justify-between items-start mb-4">
        <h3 className="font-semibold text-lg text-gray-900">{title}</h3>
        <div className="flex gap-2">
          <Badge className={priorityColors[priority]}>
            {priority.charAt(0).toUpperCase() + priority.slice(1)}
          </Badge>
          <Badge className={statusColors[status]}>
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </Badge>
        </div>
      </div>
      <p className="text-gray-600 mb-4 line-clamp-2">{description}</p>
      <div className="text-sm text-gray-500">
        Created {formatDistanceToNow(createdAt)} ago
      </div>
    </Card>
  );
};