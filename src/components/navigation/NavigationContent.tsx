import { LayoutDashboard, Archive, LogOut } from "lucide-react";
import {
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";

export const NavigationContent = ({
  setShowArchived,
  showArchived,
}: {
  setShowArchived: (show: boolean) => void;
  showArchived: boolean;
}) => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate("/auth");
  };

  return (
    <div className="flex flex-col h-full">
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={() => navigate('/')} className="w-full">
            <LayoutDashboard className="h-4 w-4" />
            <span>Dashboard</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            onClick={() => setShowArchived(!showArchived)}
            className="w-full"
          >
            <Archive className="h-4 w-4" />
            <span>Archived</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton onClick={handleLogout} className="w-full">
            <LogOut className="h-4 w-4" />
            <span>Logout</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </div>
  );
};