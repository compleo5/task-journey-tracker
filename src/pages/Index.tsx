import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RequestCard } from "@/components/RequestCard";
import { CommentThread } from "@/components/CommentThread";
import { CreateRequestForm } from "@/components/CreateRequestForm";
import { Plus } from "lucide-react";

// Mock data
const mockRequests = [
  {
    id: "1",
    title: "Access to Development Environment",
    description: "Need access to the development environment for the new project",
    status: "open" as const,
    createdAt: new Date("2024-02-20"),
  },
  {
    id: "2",
    title: "Software Installation Request",
    description: "Request for installation of design software on my workstation",
    status: "in-progress" as const,
    createdAt: new Date("2024-02-19"),
  },
];

const mockComments = [
  {
    id: "1",
    author: "John Doe",
    content: "I need this urgently for the upcoming sprint.",
    createdAt: new Date("2024-02-20T10:00:00"),
    isAdmin: false,
  },
  {
    id: "2",
    author: "Support Team",
    content: "We're reviewing your request. Will get back to you shortly.",
    createdAt: new Date("2024-02-20T10:30:00"),
    isAdmin: true,
  },
];

const Index = () => {
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [showCreateForm, setShowCreateForm] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Service Desk</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="flex items-center gap-2"
          >
            <Plus size={20} />
            New Request
          </Button>
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
            <CreateRequestForm />
          </div>
        ) : selectedRequest ? (
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold">Request Details</h2>
              <Button
                variant="ghost"
                onClick={() => setSelectedRequest(null)}
              >
                Back to List
              </Button>
            </div>
            <div className="mb-8">
              <h3 className="text-lg font-medium mb-4">Comments</h3>
              <CommentThread comments={mockComments} />
            </div>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {mockRequests.map((request) => (
              <RequestCard
                key={request.id}
                {...request}
                onClick={() => setSelectedRequest(request.id)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Index;