import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8">Welcome to Express Shipping Solutions</h1>
        <p className="text-center text-lg mb-12">Your trusted partner for all shipping needs</p>
        
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Ship a Package</h2>
            <p className="mb-6">Ready to ship? Get started with our easy shipping process and competitive rates.</p>
            <Button 
              className="w-full"
              onClick={() => navigate("/ship")}
            >
              Ship Now
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">Have Questions?</h2>
            <p className="mb-6">Check our FAQ or send us your inquiry. We're here to help!</p>
            <Button 
              className="w-full"
              onClick={() => navigate("/inquire")}
            >
              Make an Inquiry
            </Button>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">View Schedule</h2>
            <p className="mb-6">Check our shipping calendar and upcoming deliveries.</p>
            <Button 
              className="w-full"
              onClick={() => navigate("/calendar")}
            >
              View Calendar
            </Button>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Index;