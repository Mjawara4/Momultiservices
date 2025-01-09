import React from "react";
import { format, parseISO, startOfDay } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

interface ShipmentDetailsProps {
  shipments: Tables<"scheduled_shipping_dates">[];
  date: Date;
}

export const ShipmentDetails = ({ shipments, date }: ShipmentDetailsProps) => {
  // Filter shipments for the selected date
  const filteredShipments = shipments.filter((shipment) => {
    const shipmentDate = startOfDay(parseISO(shipment.shipping_date));
    const selectedDate = startOfDay(date);
    const isSameDate = format(shipmentDate, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
    console.log("Comparing dates:", {
      shipmentDate: format(shipmentDate, 'yyyy-MM-dd'),
      selectedDate: format(selectedDate, 'yyyy-MM-dd'),
      isSameDate
    });
    return isSameDate;
  });

  return (
    <div className="space-y-2">
      <h3 className="font-semibold">
        {date ? format(date, "MMMM d, yyyy") : "Select a date"}
      </h3>
      <div className="space-y-1">
        {filteredShipments.length > 0 ? (
          filteredShipments.map((shipment) => (
            <div key={shipment.id} className="p-2 bg-secondary rounded-md">
              <div className="flex justify-between items-center">
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
    </div>
  );
};