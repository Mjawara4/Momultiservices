import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import { Loader2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface TrackingInfo {
  tracking_number: string;
  status: string;
  location: string | null;
  updated_at: string;
  estimated_delivery: string | null;
  notes: string | null;
  shipping: {
    from_location: string;
    to_location: string;
  } | null;
}

const TrackingDetails = () => {
  const { trackingNumber } = useParams();
  const [loading, setLoading] = useState(true);
  const [trackingInfo, setTrackingInfo] = useState<TrackingInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchTrackingInfo = async () => {
      try {
        const { data, error } = await supabase
          .from('shipping_tracking')
          .select(`
            tracking_number,
            status,
            location,
            updated_at,
            estimated_delivery,
            notes,
            shipping:scheduled_shipping_dates(
              from_location,
              to_location
            )
          `)
          .eq('tracking_number', trackingNumber)
          .maybeSingle();

        if (error) throw error;
        
        if (!data) {
          setError(`No tracking information found for number: ${trackingNumber}`);
          toast({
            variant: "destructive",
            title: "Not Found",
            description: `No tracking information found for number: ${trackingNumber}`,
          });
          return;
        }

        setTrackingInfo(data);
      } catch (err) {
        console.error('Error fetching tracking info:', err);
        setError('Unable to find tracking information');
        toast({
          variant: "destructive",
          title: "Error",
          description: "Unable to fetch tracking information",
        });
      } finally {
        setLoading(false);
      }
    };

    if (trackingNumber) {
      fetchTrackingInfo();
    }
  }, [trackingNumber, toast]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (error || !trackingInfo) {
    return (
      <div className="container max-w-2xl mx-auto p-6">
        <Card className="p-6">
          <div className="text-center text-red-500">
            {error || 'Tracking information not found'}
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="container max-w-2xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-center">Tracking Details</h1>
      
      <Card className="p-6 space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Tracking Number</h3>
            <p className="text-lg">{trackingInfo.tracking_number}</p>
          </div>
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Status</h3>
            <p className="text-lg capitalize">{trackingInfo.status}</p>
          </div>
        </div>

        <div className="space-y-2">
          <h3 className="font-semibold text-sm text-muted-foreground">Route</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p>{trackingInfo.shipping?.from_location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p>{trackingInfo.shipping?.to_location}</p>
            </div>
          </div>
        </div>

        {trackingInfo.location && (
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Current Location</h3>
            <p>{trackingInfo.location}</p>
          </div>
        )}

        {trackingInfo.estimated_delivery && (
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Estimated Delivery</h3>
            <p>{format(new Date(trackingInfo.estimated_delivery), 'MMMM d, yyyy')}</p>
          </div>
        )}

        {trackingInfo.notes && (
          <div>
            <h3 className="font-semibold text-sm text-muted-foreground">Additional Notes</h3>
            <p>{trackingInfo.notes}</p>
          </div>
        )}

        <div className="text-sm text-muted-foreground">
          Last Updated: {format(new Date(trackingInfo.updated_at), 'MMMM d, yyyy h:mm a')}
        </div>
      </Card>
    </div>
  );
};

export default TrackingDetails;