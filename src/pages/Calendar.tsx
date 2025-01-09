import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO } from "date-fns";
import { ShipmentDetails } from "@/components/shipping-calendar/ShipmentDetails";
import { useState } from "react";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());

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