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
    queryKey: ["ship-site-data"],
    queryFn: async () => {
      console.log("Fetching shipping dates...");
      const { data, error } = await supabase
        .from("ship_site_data")
        .select("*")
        .eq('type', 'shipping')
        .order('created_at', { ascending: true });
      
      if (error) {
        console.error("Supabase error:", error);
        throw error;
      }
      
      console.log("Raw data from Supabase:", data);
      
      // Filter for today and future dates
      const filteredDates = data?.filter(date => {
        const shipDate = startOfDay(new Date(date.created_at));
        const today = startOfDay(new Date());
        return isToday(shipDate) || isFuture(shipDate);
      }) || [];

      return filteredDates;
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Shipping Schedule</h1>
        <p className="text-muted-foreground mt-2">Showing upcoming shipping requests</p>
      </div>

      <Card className="p-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>From Location</TableHead>
              <TableHead>To Location</TableHead>
              <TableHead>Package Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {scheduledDates?.map((shipment) => (
              <TableRow key={shipment.id}>
                <TableCell className="font-medium">
                  {format(parseISO(shipment.created_at), "MMMM d, yyyy")}
                </TableCell>
                <TableCell>{shipment.name}</TableCell>
                <TableCell>{shipment.from_location}</TableCell>
                <TableCell>{shipment.to_location}</TableCell>
                <TableCell>{shipment.package_type}</TableCell>
              </TableRow>
            ))}
            {!scheduledDates?.length && (
              <TableRow>
                <TableCell colSpan={5} className="text-center text-muted-foreground">
                  No upcoming shipping requests
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