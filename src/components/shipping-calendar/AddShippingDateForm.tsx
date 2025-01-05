import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/components/ui/use-toast";
import { ShippingDateFormFields } from "./ShippingDateFormFields";
import { addShippingDate } from "./shippingCalendarService";

const formSchema = z.object({
  shipping_date: z.string().min(1, "Date is required"),
  from_location: z.string().min(1, "Origin location is required"),
  to_location: z.string().min(1, "Destination location is required"),
});

export type ShippingDateFormData = z.infer<typeof formSchema>;

export const AddShippingDateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const form = useForm<ShippingDateFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipping_date: "",
      from_location: "",
      to_location: "",
    },
  });

  const onSubmit = async (values: ShippingDateFormData) => {
    try {
      await addShippingDate(values);
      
      toast({
        title: "Success",
        description: "Shipping date added successfully",
      });
      
      form.reset();
      onSuccess();
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to add shipping date",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <ShippingDateFormFields form={form} />
        <Button type="submit" className="w-full">
          Add Shipping Date
        </Button>
      </form>
    </Form>
  );
};