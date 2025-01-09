import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isFuture, isToday, startOfDay } from "date-fns";
import { ShipmentDetails } from "@/components/shipping-calendar/ShipmentDetails";
import { LocationFilters } from "@/components/shipping-calendar/LocationFilters";
import { useState, useEffect, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import type { Database } from "@/integrations/supabase/types";

type ShippingDate = Database['public']['Tables']['scheduled_shipping_dates']['Row'];
type ShippingPayload = RealtimePostgresChangesPayload<{
  [key: string]: any;
  shipping_date: string;
}>;

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterFromLocation, setFilterFromLocation] = useState("all");
  const [filterToLocation, setFilterToLocation] = useState("all");
  const queryClient = useQueryClient();

  const { data: shipments = [], isLoading } = useQuery<ShippingDate[]>({
    queryKey: ["scheduled-shipping-dates"],
    queryFn: async () => {
      console.log("Fetching shipping dates...");
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*")
        .order('shipping_date', { ascending: true });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Raw data from Supabase:", data);
      
      // Filter for today and future dates
      const filteredDates = (data || []).filter(date => {
        const shipDate = startOfDay(parseISO(date.shipping_date));
        const today = startOfDay(new Date());
        return isToday(shipDate) || isFuture(shipDate);
      });

      return filteredDates;
    },
  });

  // Get unique locations for filters
  const { uniqueFromLocations, uniqueToLocations } = useMemo(() => {
    const fromLocations = [...new Set(shipments.map(s => s.from_location))];
    const toLocations = [...new Set(shipments.map(s => s.to_location))];
    return {
      uniqueFromLocations: fromLocations,
      uniqueToLocations: toLocations
    };
  }, [shipments]);

  // Filter shipments based on selected locations
  const filteredShipments = useMemo(() => {
    return shipments.filter(shipment => {
      const matchesFromLocation = filterFromLocation === "all" || shipment.from_location === filterFromLocation;
      const matchesToLocation = filterToLocation === "all" || shipment.to_location === filterToLocation;
      return matchesFromLocation && matchesToLocation;
    });
  }, [shipments, filterFromLocation, filterToLocation]);

  // Subscribe to real-time changes
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
        (payload: ShippingPayload) => {
          console.log('Real-time update received:', payload);
          queryClient.invalidateQueries({ queryKey: ["scheduled-shipping-dates"] });
          
          const event = payload.eventType;
          const shippingDate = payload.new?.shipping_date || payload.old?.shipping_date;
          
          if (shippingDate) {
            const date = format(new Date(shippingDate), "MMMM d, yyyy");
            
            if (event === 'INSERT') {
              toast.success(`New shipment scheduled for ${date}`);
            } else if (event === 'UPDATE') {
              toast.info(`Shipment updated for ${date}`);
            } else if (event === 'DELETE') {
              toast.warning(`Shipment removed for ${date}`);
            }
          }
        }
      )
      .subscribe();

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
      
      <LocationFilters 
        uniqueFromLocations={uniqueFromLocations}
        uniqueToLocations={uniqueToLocations}
        filterFromLocation={filterFromLocation}
        filterToLocation={filterToLocation}
        setFilterFromLocation={setFilterFromLocation}
        setFilterToLocation={setFilterToLocation}
      />

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="p-6">
          <Calendar
            mode="single"
            selected={selectedDate}
            onSelect={setSelectedDate}
            className="rounded-md border"
            disabled={(date) => {
              const today = startOfDay(new Date());
              return date < today;
            }}
          />
        </Card>
        <Card className="p-6">
          <ShipmentDetails 
            shipments={filteredShipments} 
            date={selectedDate || new Date()} 
          />
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;