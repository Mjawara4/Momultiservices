import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, Plane, ShoppingCart } from "lucide-react";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 md:py-12">
        <h1 className="text-2xl md:text-4xl font-bold text-center mb-2 md:mb-4">Welcome to Our Shipping Solutions</h1>
        <p className="text-sm md:text-lg text-muted-foreground text-center mb-6 md:mb-12 max-w-2xl mx-auto">Your trusted partner for all logistics needs</p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 lg:gap-8 max-w-7xl mx-auto">
          {/* Express GP Service */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden relative min-h-[250px] md:min-h-[350px] bg-cover bg-center" 
            onClick={() => navigate("/ship")}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="p-4 md:p-6 flex flex-col items-center relative z-10 h-full justify-center">
              <div className="bg-primary/10 p-2 md:p-4 rounded-full mb-3 backdrop-blur-sm">
                <Package className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-semibold mb-2 text-white">Express GP</h2>
              <p className="text-white/90 text-center text-xs md:text-base mb-4 max-w-xs">Fast and reliable ground shipping services for all your needs</p>
              <Button 
                variant="secondary" 
                className="w-full max-w-[200px] text-sm md:text-base py-2"
              >
                Get Started
              </Button>
            </div>
          </Card>

          {/* Air Cargo Service */}
          <Card 
            className="relative group overflow-hidden min-h-[250px] md:min-h-[350px] bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="p-4 md:p-6 flex flex-col items-center relative z-10 h-full justify-center">
              <div className="bg-secondary/50 p-2 md:p-4 rounded-full mb-3 backdrop-blur-sm">
                <Plane className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-semibold mb-2 text-white">Air Cargo</h2>
              <p className="text-white/90 text-center text-xs md:text-base mb-4 max-w-xs">International air freight solutions for your business</p>
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="text-lg md:text-2xl font-semibold text-white">Coming Soon</span>
              </div>
            </div>
          </Card>

          {/* Online Shopping Service */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden relative min-h-[250px] md:min-h-[350px] bg-cover bg-center"
            onClick={() => navigate("/order-for-me")}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="p-4 md:p-6 flex flex-col items-center relative z-10 h-full justify-center">
              <div className="bg-primary/10 p-2 md:p-4 rounded-full mb-3 backdrop-blur-sm">
                <ShoppingCart className="h-5 w-5 md:h-8 md:w-8 text-white" />
              </div>
              <h2 className="text-lg md:text-2xl font-semibold mb-2 text-white">Online Shopping</h2>
              <p className="text-white/90 text-center text-xs md:text-base mb-4 max-w-xs">Shop your favorite products with ease</p>
              <Button 
                variant="secondary" 
                className="w-full max-w-[200px] text-sm md:text-base py-2"
              >
                Order for Me
              </Button>
            </div>
          </Card>
        </div>
      </div>
      
      <TestimonialsSection />
    </div>
  );
};

export default Index;