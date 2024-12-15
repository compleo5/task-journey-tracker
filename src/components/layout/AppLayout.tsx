import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import {
  Sidebar,
  SidebarContent,
  SidebarProvider,
} from "@/components/ui/sidebar";
import { NavigationContent } from "@/components/navigation/NavigationContent";

interface AppLayoutProps {
  children: React.ReactNode;
  showArchived: boolean;
  setShowArchived: (show: boolean) => void;
}

export const AppLayout = ({ children, showArchived, setShowArchived }: AppLayoutProps) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen bg-gray-50 flex w-full">
        {/* Desktop Sidebar */}
        <Sidebar className="hidden md:flex">
          <SidebarContent>
            <NavigationContent showArchived={showArchived} setShowArchived={setShowArchived} />
          </SidebarContent>
        </Sidebar>

        {/* Mobile Sidebar */}
        <Sheet>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden fixed top-4 left-4 z-40"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <NavigationContent showArchived={showArchived} setShowArchived={setShowArchived} />
          </SheetContent>
        </Sheet>

        <div className="flex-1 max-w-7xl mx-auto px-4 py-8">
          {children}
        </div>
      </div>
    </SidebarProvider>
  );
};