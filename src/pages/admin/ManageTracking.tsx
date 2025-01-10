import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2 } from "lucide-react";

const ManageTracking = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tracking_number: "",
    shipping_id: "",
    status: "pending",
    location: "",
    estimated_delivery: "",
    notes: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Validate shipping_id is a valid UUID
      const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      if (!uuidRegex.test(formData.shipping_id)) {
        throw new Error("Invalid shipping ID format. Please enter a valid UUID.");
      }

      const { data, error } = await supabase
        .from('shipping_tracking')
        .insert([{
          tracking_number: formData.tracking_number,
          shipping_id: formData.shipping_id,
          status: formData.status,
          location: formData.location || null,
          estimated_delivery: formData.estimated_delivery || null,
          notes: formData.notes || null,
        }])
        .select()
        .single();

      if (error) throw error;

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

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Add Tracking Information</h1>
      
      <Card className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="tracking_number" className="text-sm font-medium">
              Tracking Number
            </label>
            <Input
              id="tracking_number"
              name="tracking_number"
              value={formData.tracking_number}
              onChange={handleInputChange}
              placeholder="Enter tracking number"
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="shipping_id" className="text-sm font-medium">
              Shipping ID (UUID format)
            </label>
            <Input
              id="shipping_id"
              name="shipping_id"
              value={formData.shipping_id}
              onChange={handleInputChange}
              placeholder="Enter shipping ID (UUID format)"
              required
              pattern="^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$"
              title="Please enter a valid UUID"
            />
            <p className="text-xs text-gray-500">
              Example format: 123e4567-e89b-12d3-a456-426614174000
            </p>
          </div>

          <div className="space-y-2">
            <label htmlFor="status" className="text-sm font-medium">
              Status
            </label>
            <Select
              value={formData.status}
              onValueChange={(value) =>
                setFormData((prev) => ({ ...prev, status: value }))
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="in_transit">In Transit</SelectItem>
                <SelectItem value="delivered">Delivered</SelectItem>
                <SelectItem value="delayed">Delayed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="location" className="text-sm font-medium">
              Current Location
            </label>
            <Input
              id="location"
              name="location"
              value={formData.location}
              onChange={handleInputChange}
              placeholder="Enter current location"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="estimated_delivery" className="text-sm font-medium">
              Estimated Delivery Date
            </label>
            <Input
              id="estimated_delivery"
              name="estimated_delivery"
              type="date"
              value={formData.estimated_delivery}
              onChange={handleInputChange}
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="notes" className="text-sm font-medium">
              Notes
            </label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              placeholder="Add any additional notes"
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding Tracking...
              </>
            ) : (
              "Add Tracking Information"
            )}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default ManageTracking;