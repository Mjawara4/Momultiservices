import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import Layout from "@/components/Layout";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Badge } from "@/components/ui/badge";

const ShipCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [filterFromLocation, setFilterFromLocation] = React.useState("");
  const [filterToLocation, setFilterToLocation] = React.useState("");

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

  // Get unique locations for filters
  const uniqueFromLocations = React.useMemo(() => {
    if (!scheduledDates) return [];
    return [...new Set(scheduledDates.map(date => date.from_location))];
  }, [scheduledDates]);

  const uniqueToLocations = React.useMemo(() => {
    if (!scheduledDates) return [];
    return [...new Set(scheduledDates.map(date => date.to_location))];
  }, [scheduledDates]);

  // Filter shipments based on location filters
  const filteredShipments = React.useMemo(() => {
    if (!scheduledDates) return [];
    return scheduledDates.filter(shipment => {
      const matchesFrom = !filterFromLocation || shipment.from_location === filterFromLocation;
      const matchesTo = !filterToLocation || shipment.to_location === filterToLocation;
      return matchesFrom && matchesTo;
    });
  }, [scheduledDates, filterFromLocation, filterToLocation]);

  // Find shipments for the selected date
  const selectedDateShipments = filteredShipments.filter(
    (shipment) =>
      format(new Date(shipment.shipping_date), "yyyy-MM-dd") ===
      format(selectedDate || new Date(), "yyyy-MM-dd")
  );

  // Calculate date booking status
  const getDateBookingStatus = (date: Date) => {
    const dateShipments = filteredShipments.filter(
      (shipment) =>
        format(new Date(shipment.shipping_date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
    return dateShipments.length > 0 ? "booked" : "available";
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <div className="container mx-auto p-6">
        <h1 className="text-3xl font-bold mb-8 text-center">Shipping Calendar</h1>
        
        {/* Filters */}
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <select
            className="border rounded-md p-2"
            value={filterFromLocation}
            onChange={(e) => setFilterFromLocation(e.target.value)}
          >
            <option value="">All From Locations</option>
            {uniqueFromLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
          
          <select
            className="border rounded-md p-2"
            value={filterToLocation}
            onChange={(e) => setFilterToLocation(e.target.value)}
          >
            <option value="">All To Locations</option>
            {uniqueToLocations.map((location) => (
              <option key={location} value={location}>
                {location}
              </option>
            ))}
          </select>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          <Card className="p-6">
            <Popover>
              <PopoverTrigger asChild>
                <div>
                  <Calendar
                    mode="single"
                    selected={selectedDate}
                    onSelect={setSelectedDate}
                    className="rounded-md border"
                    modifiers={{
                      booked: (date) =>
                        getDateBookingStatus(date) === "booked",
                    }}
                    modifiersStyles={{
                      booked: {
                        backgroundColor: "rgb(34 197 94 / 0.1)",
                        fontWeight: "bold",
                      },
                    }}
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80">
                <div className="space-y-2">
                  <h3 className="font-semibold">
                    {selectedDate
                      ? format(selectedDate, "MMMM d, yyyy")
                      : "Select a date"}
                  </h3>
                  <div className="space-y-1">
                    {selectedDateShipments.length > 0 ? (
                      selectedDateShipments.map((shipment) => (
                        <div
                          key={shipment.id}
                          className="p-2 bg-secondary rounded-md"
                        >
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">
                                From: {shipment.from_location}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                To: {shipment.to_location}
                              </p>
                            </div>
                            <Badge variant="secondary">
                              {format(new Date(shipment.shipping_date), "HH:mm")}
                            </Badge>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-muted-foreground">
                        No shipments scheduled for this date
                      </p>
                    )}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-semibold mb-4">
              {selectedDate
                ? `Shipments for ${format(selectedDate, "MMMM d, yyyy")}`
                : "Select a date to view shipments"}
            </h2>
            <div className="space-y-4">
              {selectedDateShipments.length > 0 ? (
                selectedDateShipments.map((shipment) => (
                  <div key={shipment.id} className="border-b pb-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">
                          From: {shipment.from_location}
                        </p>
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