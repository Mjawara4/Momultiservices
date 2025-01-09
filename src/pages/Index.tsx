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
      <div className="container max-w-4xl mx-auto p-6">
        {/* Hero Section */}
        <div className="space-y-4 mb-8">
          <h1 className="text-3xl font-bold text-center">
            Welcome to Our Shipping Solutions
          </h1>
          <p className="text-base text-muted-foreground text-center max-w-2xl mx-auto">
            Your trusted partner for all logistics needs
          </p>
        </div>
        
        {/* Services Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Express GP Service */}
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
            onClick={() => navigate("/ship")}
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Package className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Express GP</h2>
            <p className="text-muted-foreground text-center mb-4">
              Fast and reliable ground shipping services for all your needs
            </p>
            <Button>Get Started</Button>
          </Card>

          {/* Online Shopping Service */}
          <Card 
            className="p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
            onClick={() => navigate("/order-for-me")}
          >
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <ShoppingCart className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Online Shopping</h2>
            <p className="text-muted-foreground text-center mb-4">
              We help you order items from US websites and handle shipping
            </p>
            <Button>Order for Me</Button>
          </Card>

          {/* Air Cargo Service */}
          <Card className="p-6 hover:shadow-lg transition-all flex flex-col items-center relative">
            <div className="bg-primary/10 p-4 rounded-full mb-4">
              <Plane className="h-8 w-8 text-primary" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Air Cargo</h2>
            <p className="text-muted-foreground text-center mb-4">
              International air freight solutions for your business
            </p>
            <Button disabled>Coming Soon</Button>
            <div className="absolute inset-0 bg-background/50 flex items-center justify-center backdrop-blur-sm">
              <span className="text-xl font-semibold">Coming Soon</span>
            </div>
          </Card>
        </div>
      </div>
      
      <TestimonialsSection />

      {/* Footer */}
      <footer className="bg-secondary py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col items-center justify-center space-y-4">
            <div className="flex items-center justify-center space-x-6">
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Facebook className="h-5 w-5" />
              </a>
              <a 
                href="https://www.instagram.com/mo_multiservice/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <Twitter className="h-5 w-5" />
              </a>
              <a 
                href="https://tiktok.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-muted-foreground hover:text-primary transition-colors"
              >
                <svg 
                  viewBox="0 0 24 24" 
                  className="h-5 w-5"
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