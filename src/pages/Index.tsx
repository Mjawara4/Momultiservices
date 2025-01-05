import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, Plane, ShoppingCart } from "lucide-react";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-center mb-4">Welcome to Our Shipping Solutions</h1>
        <p className="text-center text-lg text-muted-foreground mb-12">Your trusted partner for all logistics needs</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {/* Express GP Service */}
          <Card className="group cursor-pointer hover:shadow-lg transition-all" onClick={() => navigate("/ship")}>
            <div className="p-6 flex flex-col items-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4">
                <Package className="h-8 w-8 text-primary" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Express GP</h2>
              <p className="text-muted-foreground text-center mb-4">Fast and reliable ground shipping services for all your needs</p>
              <Button>Get Started</Button>
            </div>
          </Card>

          {/* Air Cargo Service */}
          <Card className="relative group">
            <div className="p-6 flex flex-col items-center">
              <div className="bg-secondary/50 p-4 rounded-full mb-4">
                <Plane className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Air Cargo</h2>
              <p className="text-muted-foreground text-center mb-4">International air freight solutions for your business</p>
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">Coming Soon</span>
              </div>
            </div>
          </Card>

          {/* Online Shopping Service */}
          <Card className="relative group">
            <div className="p-6 flex flex-col items-center">
              <div className="bg-secondary/50 p-4 rounded-full mb-4">
                <ShoppingCart className="h-8 w-8 text-muted-foreground" />
              </div>
              <h2 className="text-2xl font-semibold mb-2">Online Shopping</h2>
              <p className="text-muted-foreground text-center mb-4">Shop your favorite products with ease</p>
              <div className="absolute inset-0 bg-background/80 flex items-center justify-center">
                <span className="text-lg font-semibold text-primary">Coming Soon</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;