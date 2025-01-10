import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export interface TrackingFormData {
  tracking_number: string;
  status: string;
  location: string;
  estimated_delivery: string;
  notes: string;
  from_location: string;
  to_location: string;
}

interface TrackingFormProps {
  onSubmit: (data: TrackingFormData) => Promise<void>;
  loading: boolean;
}

export const TrackingForm = ({ onSubmit, loading }: TrackingFormProps) => {
  const [formData, setFormData] = useState<TrackingFormData>({
    tracking_number: "",
    status: "pending",
    location: "",
    estimated_delivery: "",
    notes: "",
    from_location: "",
    to_location: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSubmit(formData);
  };

  return (
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

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label htmlFor="from_location" className="text-sm font-medium">
            From Location
          </label>
          <Input
            id="from_location"
            name="from_location"
            value={formData.from_location}
            onChange={handleInputChange}
            placeholder="Origin"
            required
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="to_location" className="text-sm font-medium">
            To Location
          </label>
          <Input
            id="to_location"
            name="to_location"
            value={formData.to_location}
            onChange={handleInputChange}
            placeholder="Destination"
            required
          />
        </div>
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
  );
};