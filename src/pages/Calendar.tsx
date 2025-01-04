import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";

const CalendarPage = () => {
  const { data: shipments, isLoading } = useQuery({
    queryKey: ["shipments"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ship_site_data")
        .select("*")
        .eq("type", "shipping");
      
      if (error) throw error;
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
            className="rounded-md border"
          />
        </Card>
        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">Upcoming Shipments</h2>
          <div className="space-y-4">
            {shipments?.map((shipment) => (
              <div key={shipment.id} className="border-b pb-4">
                <p className="font-medium">{shipment.name}</p>
                <p className="text-sm text-muted-foreground">
                  From: {shipment.from_location}
                </p>
                <p className="text-sm text-muted-foreground">
                  To: {shipment.to_location}
                </p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};

export default CalendarPage;