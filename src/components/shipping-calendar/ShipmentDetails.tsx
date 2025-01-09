import React from "react";
import { format } from "date-fns";
import { Tables } from "@/integrations/supabase/types";

interface ShipmentDetailsProps {
  shipments: Tables<"scheduled_shipping_dates">[];
  date: Date;
}

export const ShipmentDetails = ({ shipments }: ShipmentDetailsProps) => {
  return (
    <div className="space-y-2">
      <h3 className="font-semibold">Scheduled Shipments</h3>
      <div className="space-y-1">
        {shipments.length > 0 ? (
          shipments.map((shipment) => (
            <div key={shipment.id} className="p-2 bg-secondary rounded-md">
              <div className="flex justify-between items-center">
                <div>
                  <p className="font-medium">
                    {format(new Date(shipment.shipping_date), "MMMM d, yyyy")}
                  </p>
                  <p>From: {shipment.from_location}</p>
                  <p className="text-sm text-muted-foreground">
                    To: {shipment.to_location}
                  </p>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-muted-foreground">No shipments found</p>
        )}
      </div>
    </div>
  );
};