import React from "react";
import { useQuery } from "@tanstack/react-query";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { format } from "date-fns";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AddShippingDateForm } from "@/components/shipping-calendar/AddShippingDateForm";

const ShipCalendar = () => {
  const { data: scheduledDates, refetch } = useQuery({
    queryKey: ["scheduled-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*")
        .order('shipping_date', { ascending: true });
      
      if (error) throw error;
      return data;
    },
  });

  return (
    <div className="container mx-auto p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Available Shipping Dates</h1>
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
                  {format(new Date(shipment.shipping_date), "MMMM d, yyyy")}
                </TableCell>
                <TableCell>{shipment.from_location}</TableCell>
                <TableCell>{shipment.to_location}</TableCell>
              </TableRow>
            ))}
            {!scheduledDates?.length && (
              <TableRow>
                <TableCell colSpan={3} className="text-center text-muted-foreground">
                  No shipping dates scheduled
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