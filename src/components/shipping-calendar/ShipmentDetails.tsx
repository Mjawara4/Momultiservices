import React from "react";
import { format } from "date-fns";
import { Badge } from "@/components/ui/badge";
import { Tables } from "@/integrations/supabase/types";

interface ShipmentDetailsProps {
  shipments: Tables<"scheduled_shipping_dates">[];
  date: Date;
}

export const ShipmentDetails = ({ shipments, date }: ShipmentDetailsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">
        {date ? format(date, "MMMM d, yyyy") : "Select a date"}
      </h3>
      <div className="space-y-1">
        {shipments.length > 0 ? (
          shipments.map((shipment) => (
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