import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Tables } from "@/integrations/supabase/types";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PackageSearch } from "lucide-react";
import { format } from "date-fns";

export const ShipmentTracker = () => {
  const [shipments, setShipments] = useState<Tables<"ship_site_data">[]>([]);

  useEffect(() => {
    // Initial fetch of recent shipments
    const fetchShipments = async () => {
      const { data, error } = await supabase
        .from("ship_site_data")
        .select("*")
        .eq("type", "shipping")
        .order("created_at", { ascending: false })
        .limit(5);

      if (error) {
        console.error("Error fetching shipments:", error);
        return;
      }

      if (data) setShipments(data);
    };

    fetchShipments();

    // Subscribe to real-time updates
    const channel = supabase
      .channel("schema-db-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "ship_site_data",
          filter: "type=eq.shipping",
        },
        (payload) => {
          console.log("Real-time update:", payload);
          // Refresh the shipments list
          fetchShipments();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  if (!shipments.length) {
    return (
      <Card className="p-6 text-center">
        <PackageSearch className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        <p className="text-muted-foreground">No recent shipments to track</p>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold mb-4">Recent Shipments</h2>
      {shipments.map((shipment) => (
        <Card key={shipment.id} className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <p className="font-semibold">{shipment.name}</p>
              <p className="text-sm text-muted-foreground">
                {format(new Date(shipment.created_at), "PPp")}
              </p>
            </div>
            <Badge variant="secondary">
              {shipment.package_type || "Package"}
            </Badge>
          </div>
          <div className="grid grid-cols-2 gap-2 mt-4">
            <div>
              <p className="text-sm text-muted-foreground">From</p>
              <p>{shipment.from_location}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">To</p>
              <p>{shipment.to_location}</p>
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};