import { ChatSupport } from "./ChatSupport";
import { MainNavigation } from "./MainNavigation";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            <div className="relative flex items-center justify-between mb-8">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
                className="absolute left-0"
              >
                <Home className="h-5 w-5" />
              </Button>
              
              <div className="mx-auto">
                <img 
                  src="/lovable-uploads/4a704460-41a7-4da9-9823-4f82d1d02e7a.png" 
                  alt="MQ Multiservices LLC" 
                  className="h-16 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/")}
                />
              </div>

              <div className="flex items-center gap-4">
                <SidebarTrigger />
              </div>
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