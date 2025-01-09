import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";
import { Package, Plane, ShoppingCart, Facebook, Instagram, Twitter } from "lucide-react";
import { TestimonialsSection } from "@/components/testimonials/TestimonialsSection";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      {/* Main Content */}
      <div className="px-4 py-6 md:container md:px-6 md:py-8">
        {/* Hero Section */}
        <div className="space-y-4 mb-8">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center leading-tight">
            Welcome to Our Shipping Solutions
          </h1>
          <p className="text-base md:text-lg text-muted-foreground text-center max-w-md mx-auto px-2">
            Your trusted partner for all logistics needs
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-6 max-w-4xl mx-auto mb-8">
          {/* Express GP Service */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden relative aspect-square md:aspect-[4/3] bg-cover bg-center" 
            onClick={() => navigate("/ship")}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1566576721346-d4a3b4eaeb55?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
              <div className="bg-primary/10 p-2.5 rounded-full mb-3 backdrop-blur-sm">
                <Package className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white text-center">Express GP</h2>
              <p className="text-white/90 text-center text-sm md:text-base mb-3 max-w-[200px]">
                Fast and reliable ground shipping services
              </p>
              <Button 
                variant="secondary" 
                className="w-full max-w-[160px] text-sm py-1.5"
              >
                Get Started
              </Button>
            </div>
          </Card>

          {/* Online Shopping Service */}
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all overflow-hidden relative aspect-square md:aspect-[4/3] bg-cover bg-center"
            onClick={() => navigate("/order-for-me")}
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1607082349566-187342175e2f?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50 group-hover:bg-black/40 transition-colors" />
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
              <div className="bg-primary/10 p-2.5 rounded-full mb-3 backdrop-blur-sm">
                <ShoppingCart className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white text-center">Online Shopping</h2>
              <p className="text-white/90 text-center text-sm md:text-base mb-3 max-w-[200px]">
                We help you order items from US websites
              </p>
              <Button 
                variant="secondary" 
                className="w-full max-w-[160px] text-sm py-1.5"
              >
                Order for Me
              </Button>
            </div>
          </Card>

          {/* Air Cargo Service */}
          <Card 
            className="relative group overflow-hidden aspect-square md:aspect-[4/3] bg-cover bg-center"
            style={{
              backgroundImage: 'url("https://images.unsplash.com/photo-1436491865332-7a61a109cc05?q=80&w=2000")',
            }}
          >
            <div className="absolute inset-0 bg-black/50" />
            <div className="absolute inset-0 p-4 flex flex-col items-center justify-center">
              <div className="bg-secondary/50 p-2.5 rounded-full mb-3 backdrop-blur-sm">
                <Plane className="h-5 w-5 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-semibold mb-2 text-white text-center">Air Cargo</h2>
              <p className="text-white/90 text-center text-sm md:text-base mb-3 max-w-[200px]">
                International air freight solutions
              </p>
              <div className="absolute inset-0 bg-black/80 flex items-center justify-center">
                <span className="text-lg md:text-2xl font-semibold text-white">Coming Soon</span>
              </div>
            </div>
          </Card>
        </div>
      </div>
      
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-secondary py-6">
        <div className="px-4 md:container">
          <div className="flex flex-col items-center justify-center space-y-6">
            <div className="grid grid-cols-4 gap-6 md:gap-8">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2"
              >
                <Facebook className="h-6 w-6" />
              </a>
              <a 
                href="https://www.instagram.com/mo_multiservice/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2"
              >
                <Instagram className="h-6 w-6" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2"
              >
                <Twitter className="h-6 w-6" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors p-2"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-6 w-6"
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </a>
            </div>
            <p className="text-sm text-muted-foreground text-center">
              © {new Date().getFullYear()} MO Multiservices LLC. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;