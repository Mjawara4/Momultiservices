import { ShipmentTracker } from "@/components/shipping/ShipmentTracker";

const Index = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-4xl font-bold mb-8 text-center">
        Express GP Shipping Services
      </h1>
      <div className="max-w-3xl mx-auto">
        <ShipmentTracker />
      </div>
    </div>
  );
};

export default Index;