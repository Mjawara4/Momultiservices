import { Card } from "@/components/ui/card";
import { ShippingForm } from "@/components/shipping/ShippingForm";

const ShipForm = () => {
  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Ship a Package</h1>
      
      <Card className="p-6">
        <ShippingForm />
      </Card>
    </div>
  );
};

export default ShipForm;