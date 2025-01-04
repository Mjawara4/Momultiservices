import { Button } from "@/components/ui/button";
import { Home } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface LayoutProps {
  children: React.ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto p-6">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <Home className="h-5 w-5" />
        </Button>
        {children}
      </div>
    </div>
  );
};

export default Layout;