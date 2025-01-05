import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { LocationFilters } from "@/components/shipping-calendar/LocationFilters";
import { AddShippingDateForm } from "@/components/shipping-calendar/AddShippingDateForm";
import { ShipmentDetails } from "@/components/shipping-calendar/ShipmentDetails";

const ShipCalendar = () => {
  const [selectedDate, setSelectedDate] = React.useState<Date | undefined>(
    new Date()
  );
  const [filterFromLocation, setFilterFromLocation] = React.useState("all");
  const [filterToLocation, setFilterToLocation] = React.useState("all");

  const { data: scheduledDates, refetch } = useQuery({
    queryKey: ["scheduled-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*");
      
      if (error) throw error;
      return data;
    },
  });

  const uniqueFromLocations = React.useMemo(() => {
    if (!scheduledDates) return [];
    return [...new Set(scheduledDates.map(date => date.from_location))];
  }, [scheduledDates]);

  const uniqueToLocations = React.useMemo(() => {
    if (!scheduledDates) return [];
    return [...new Set(scheduledDates.map(date => date.to_location))];
  }, [scheduledDates]);

  const filteredShipments = React.useMemo(() => {
    if (!scheduledDates) return [];
    return scheduledDates.filter(shipment => {
      const matchesFrom = filterFromLocation === "all" || shipment.from_location === filterFromLocation;
      const matchesTo = filterToLocation === "all" || shipment.to_location === filterToLocation;
      return matchesFrom && matchesTo;
    });
  }, [scheduledDates, filterFromLocation, filterToLocation]);

  const selectedDateShipments = filteredShipments.filter(
    (shipment) =>
      format(new Date(shipment.shipping_date), "yyyy-MM-dd") ===
      format(selectedDate || new Date(), "yyyy-MM-dd")
  );

  const getDateBookingStatus = (date: Date) => {
    const dateShipments = filteredShipments.filter(
      (shipment) =>
        format(new Date(shipment.shipping_date), "yyyy-MM-dd") ===
        format(date, "yyyy-MM-dd")
    );
    return dateShipments.length > 0 ? "booked" : "available";
  };

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Shipping Calendar</h1>
        <Dialog>
          <DialogTrigger asChild>
            <Button>Add Shipping Date</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Add New Shipping Date</DialogTitle>
            </DialogHeader>
            <AddShippingDateForm onSuccess={refetch} />
          </DialogContent>
        </Dialog>
      </div>

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
              <ShipmentDetails
                shipments={selectedDateShipments}
                date={selectedDate || new Date()}
              />
            </PopoverContent>
          </Popover>
        </Card>

        <Card className="p-6">
          <h2 className="text-2xl font-semibold mb-4">
            {selectedDate
              ? `Shipments for ${format(selectedDate, "MMMM d, yyyy")}`
              : "Select a date to view shipments"}
          </h2>
          <ShipmentDetails
            shipments={selectedDateShipments}
            date={selectedDate || new Date()}
          />
        </Card>
      </div>
    </div>
  );
};

export default ShipCalendar;