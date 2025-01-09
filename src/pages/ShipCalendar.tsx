import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format, isAfter, startOfDay } from "date-fns";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
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
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*")
        .order('shipping_date', { ascending: true });
      
      if (error) throw error;
      
      // Filter out past dates
      const today = startOfDay(new Date());
      return data.filter(date => 
        isAfter(new Date(date.shipping_date), today)
      );
    },
  });

  // Group shipments by month
  const groupedShipments = React.useMemo(() => {
    if (!scheduledDates) return {};
    return scheduledDates.reduce((acc, shipment) => {
      const month = format(new Date(shipment.shipping_date), 'MMMM yyyy');
      if (!acc[month]) acc[month] = [];
      acc[month].push(shipment);
      return acc;
    }, {} as Record<string, typeof scheduledDates>);
  }, [scheduledDates]);

  return (
    <div className="container mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold">Available Shipping Dates</h1>
        <p className="text-muted-foreground mt-2">Showing upcoming shipping dates only</p>
      </div>

      <Carousel className="w-full max-w-4xl mx-auto">
        <CarouselContent>
          {Object.entries(groupedShipments).map(([month, shipments]) => (
            <CarouselItem key={month}>
              <Card className="p-6">
                <h2 className="text-2xl font-semibold mb-4">{month}</h2>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Date</TableHead>
                      <TableHead>From Location</TableHead>
                      <TableHead>To Location</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {shipments.map((shipment) => (
                      <TableRow key={shipment.id}>
                        <TableCell className="font-medium">
                          {format(new Date(shipment.shipping_date), "MMMM d, yyyy")}
                        </TableCell>
                        <TableCell>{shipment.from_location}</TableCell>
                        <TableCell>{shipment.to_location}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </Card>
            </CarouselItem>
          ))}
          {!scheduledDates?.length && (
            <CarouselItem>
              <Card className="p-6">
                <p className="text-center text-muted-foreground">
                  No upcoming shipping dates scheduled
                </p>
              </Card>
            </CarouselItem>
          )}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </div>
  );
};

export default ShipCalendar;