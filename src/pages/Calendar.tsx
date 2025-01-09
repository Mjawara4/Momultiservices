import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ShipmentDetails } from "@/components/shipping-calendar/ShipmentDetails";
import { useState, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const queryClient = useQueryClient();

  const { data: shipments, isLoading } = useQuery({
    queryKey: ["scheduled-shipping-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*")
        .order('shipping_date', { ascending: true });
      
      if (error) throw error;
      console.log("Fetched shipments:", data);
      return data;
    },
  });

  // Subscribe to real-time changes
  useEffect(() => {
    const channel = supabase
      .channel('shipping-updates')
      .on(
        'postgres_changes',
        {
          event: '*', // Listen to all events (INSERT, UPDATE, DELETE)
          schema: 'public',
          table: 'scheduled_shipping_dates'
        },
        (payload) => {
          console.log('Real-time update received:', payload);
          // Invalidate and refetch the query
          queryClient.invalidateQueries({ queryKey: ["scheduled-shipping-dates"] });
          
          // Show a toast notification based on the event type
          const event = payload.eventType;
          const date = format(new Date(payload.new?.shipping_date || payload.old?.shipping_date), "MMMM d, yyyy");
          
          if (event === 'INSERT') {
            toast.success(`New shipment scheduled for ${date}`);
          } else if (event === 'UPDATE') {
            toast.info(`Shipment updated for ${date}`);
          } else if (event === 'DELETE') {
            toast.warning(`Shipment removed for ${date}`);
          }
        }
      )
      .subscribe();

    // Cleanup subscription on component unmount
    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Shipping Calendar</h1>
      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
          />
        </Card>
        <Card className="p-6">
          <ShipmentDetails 
            shipments={shipments || []} 
            date={selectedDate || new Date()} 
          />
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;