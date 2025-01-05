import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ChatSupport } from "./ChatSupport";
import { MainNavigation } from "./MainNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <MainNavigation />
        <div className="flex-1">
          <div className="container mx-auto p-6">
            <div className="flex items-center gap-4 mb-4">
              <SidebarTrigger />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/")}
              >
                <Home className="h-5 w-5" />
              </Button>
            </div>
            {children}
          </div>
          <ChatSupport />
        </div>
      </div>
    </SidebarProvider>
  );
};

export default Layout;