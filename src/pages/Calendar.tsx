import { useState, useMemo } from "react";
import { Calendar } from "@/components/ui/calendar";
import { Card } from "@/components/ui/card";
import { ShipmentDetails } from "@/components/shipping-calendar/ShipmentDetails";
import { LocationFilters } from "@/components/shipping-calendar/LocationFilters";
import { useShippingDates } from "@/hooks/useShippingDates";
import { useShippingUpdates } from "@/hooks/useShippingUpdates";
import type { ShippingDate } from "@/types/calendar";

const CalendarPage = () => {
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [filterFromLocation, setFilterFromLocation] = useState("all");
  const [filterToLocation, setFilterToLocation] = useState("all");

  // Initialize real-time updates
  useShippingUpdates();

  // Fetch shipping dates
  const { data: shipments = [], isLoading } = useShippingDates();

  // Calculate unique locations
  const { uniqueFromLocations, uniqueToLocations } = useMemo(() => ({
    uniqueFromLocations: [...new Set(shipments.map(s => s.from_location))],
    uniqueToLocations: [...new Set(shipments.map(s => s.to_location))]
  }), [shipments]);

  // Filter shipments based on selected locations
  const filteredShipments = useMemo(() => 
    shipments.filter(shipment => {
      const matchesFromLocation = filterFromLocation === "all" || shipment.from_location === filterFromLocation;
      const matchesToLocation = filterToLocation === "all" || shipment.to_location === filterToLocation;
      return matchesFromLocation && matchesToLocation;
    }), 
    [shipments, filterFromLocation, filterToLocation]
  );

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