import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Calendar, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Ship = () => {
  const navigate = useNavigate();

  return (
    <div className="container max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Express GP Services</h1>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Shipping Form Option */}
        <Card 
          className="p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
          onClick={() => navigate("/ship/form")}
        >
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Package className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Ship a Package</h2>
          <p className="text-muted-foreground text-center mb-4">
            Create a new shipping request and get instant quotes
          </p>
          <Button>Get Started</Button>
        </Card>

        {/* Calendar Option */}
        <Card 
          className="p-6 hover:shadow-lg transition-all cursor-pointer flex flex-col items-center"
          onClick={() => navigate("/ship/calendar")}
        >
          <div className="bg-primary/10 p-4 rounded-full mb-4">
            <Calendar className="h-8 w-8 text-primary" />
          </div>
          <h2 className="text-2xl font-semibold mb-2">Shipping Calendar</h2>
          <p className="text-muted-foreground text-center mb-4">
            View and manage scheduled shipments
          </p>
          <Button>View Schedule</Button>
        </Card>
      </div>
    </div>
  );
};

export default Ship;