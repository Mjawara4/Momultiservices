import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Layout from "@/components/Layout";

const ShipCalendar = () => {
  const { data: scheduledDates, isLoading } = useQuery({
    queryKey: ["scheduled-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(new Date());

  // Find shipments for the selected date
  const selectedDateShipments = scheduledDates?.filter(
    (shipment) => format(new Date(shipment.shipping_date), 'yyyy-MM-dd') === 
                  format(selectedDate || new Date(), 'yyyy-MM-dd')
  );

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Shipping Calendar</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              className="rounded-md border"
              modifiers={{
                booked: (date) => 
                  scheduledDates?.some(
                    (shipment) => 
                      format(new Date(shipment.shipping_date), 'yyyy-MM-dd') === 
                      format(date, 'yyyy-MM-dd')
                  ) || false
              }}
              modifiersStyles={{
                booked: {
                  backgroundColor: 'rgb(34 197 94 / 0.1)',
                  fontWeight: 'bold'
                }
              }}
            />
          </Card>
          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedDate ? (
                `Shipments for ${format(selectedDate, 'MMMM d, yyyy')}`
              ) : (
                'Select a date to view shipments'
              )}
            </h2>
            <div className="space-y-4">
              {selectedDateShipments?.length ? (
                selectedDateShipments.map((shipment) => (
                  <div key={shipment.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">From: {shipment.from_location}</p>
                        <p className="text-sm text-muted-foreground">
                          To: {shipment.to_location}
                        </p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-muted-foreground">
                  No shipments scheduled for this date
                </p>
              )}
            </div>
          </Card>
        </div>
      </div>
    </Layout>
  );
};

export default ShipCalendar;