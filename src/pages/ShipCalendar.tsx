import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, parseISO, isFuture, isToday, startOfDay } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const ShipCalendar = () => {
  const { data: scheduledDates } = useQuery({
    queryKey: ["scheduled-dates"],
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
      const filteredDates = data?.filter(date => {
        const shipDate = startOfDay(parseISO(date.shipping_date));
        const today = startOfDay(new Date());
        return isToday(shipDate) || isFuture(shipDate);
      }) || [];

      return filteredDates;
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Shipping Dates</h1>
        <p className="text-muted-foreground mt-2">Showing upcoming shipping dates only</p>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>From Location</TableHead>
              <TableHead>To Location</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledDates?.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  {format(parseISO(shipment.shipping_date), "MMMM d, yyyy")}
                </TableCell>
                <TableCell>{shipment.from_location}</TableCell>
                <TableCell>{shipment.to_location}</TableCell>
              </TableRow>
            ))}
            {!scheduledDates?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No upcoming shipping dates scheduled
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </Card>
    </div>
  );
};

export default ShipCalendar;