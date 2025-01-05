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
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden relative min-h-[400px] bg-cover bg-center" 
            onClick={() => navigate("/ship")}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="p-6 flex flex-col items-center relative z-10 h-full justify-center">
              <div className="bg-primary/10 p-4 rounded-full mb-4 backdrop-blur-sm">
                <Package className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Express GP</h2>
              <p className="text-white/90 text-center mb-4">Fast and reliable ground shipping services for all your needs</p>
              <Button variant="secondary">Get Started</Button>
            </div>
          </Card>

          {/* Air Cargo Service */}
          <Card className="relative group overflow-hidden min-h-[400px] bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="p-6 flex flex-col items-center relative z-10 h-full justify-center">
              <div className="bg-secondary/50 p-4 rounded-full mb-4 backdrop-blur-sm">
                <Plane className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Air Cargo</h2>
              <p className="text-white/90 text-center mb-4">International air freight solutions for your business</p>
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">Coming Soon</span>
              </div>
            </div>
          </Card>

          {/* Online Shopping Service */}
          <Card className="relative group overflow-hidden min-h-[400px] bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="p-6 flex flex-col items-center relative z-10 h-full justify-center">
              <div className="bg-secondary/50 p-4 rounded-full mb-4 backdrop-blur-sm">
                <ShoppingCart className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-semibold mb-2 text-white">Online Shopping</h2>
              <p className="text-white/90 text-center mb-4">Shop your favorite products with ease</p>
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="text-2xl font-semibold text-white">Coming Soon</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;