import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { TrackingForm } from "@/components/admin/tracking/TrackingForm";
import { createTracking } from "@/services/tracking";
import type { TrackingFormData } from "@/components/admin/tracking/TrackingForm";

const ManageTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (formData: TrackingFormData) => {
    setLoading(true);

    try {
      const data = await createTracking(formData);
      
      toast({
        title: "Success",
        description: "Tracking information has been added successfully.",
      });

      navigate(`/track/${data.tracking_number}`);
    } catch (error: any) {
      console.error('Error adding tracking:', error);
      toast({
        title: "Error",
        description: error.message || "Failed to add tracking information. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Tracking Information</h1>
      
      <Card className="p-6">
        <TrackingForm onSubmit={handleSubmit} loading={loading} />
      </Card>
    </div>
  );
};

export default ManageTracking;