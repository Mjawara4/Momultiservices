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
        <div className="flex-1 w-full">
          <div className="w-full px-2 sm:px-4 md:container md:px-6">
            <div className="relative flex items-center justify-between mb-4 md:mb-8 py-2">
              <Button 
                variant="ghost" 
                size="icon"
                onClick={() => navigate("/")}
                className="absolute left-0"
              >
                <Home className="h-4 w-4 md:h-5 md:w-5" />
              </Button>
              
              <div className="mx-auto">
                <img 
                  src="/lovable-uploads/4a704460-41a7-4da9-9823-4f82d1d02e7a.png" 
                  alt="MQ Multiservices LLC" 
                  className="h-12 md:h-16 w-auto object-contain cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={() => navigate("/")}
                />
              </div>

              <div className="flex items-center gap-2 md:gap-4">
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