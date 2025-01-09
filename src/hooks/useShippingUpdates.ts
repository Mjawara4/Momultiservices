import { useEffect } from 'react';
import { useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { format } from "date-fns";
import type { RealtimeShippingPayload } from "@/types/calendar";

export const useShippingUpdates = () => {
  const queryClient = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel('shipping-updates')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'scheduled_shipping_dates'
        },
        (payload: RealtimeShippingPayload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ["scheduled-shipping-dates"] });
          
          if (!payload.new && !payload.old) return;
          
          const shippingDate = payload.new?.shipping_date || payload.old?.shipping_date;
          if (!shippingDate) return;
          
          const date = format(new Date(shippingDate), "MMMM d, yyyy");
          
          switch (payload.eventType) {
            case 'INSERT':
              toast.success(`New shipment scheduled for ${date}`);
              break;
            case 'UPDATE':
              toast.info(`Shipment updated for ${date}`);
              break;
            case 'DELETE':
              toast.warning(`Shipment removed for ${date}`);
              break;
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);
};