import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/components/ui/use-toast";

const formSchema = z.object({
  shipping_date: z.string().min(1, "Date is required"),
  from_location: z.string().min(1, "Origin location is required"),
  to_location: z.string().min(1, "Destination location is required"),
});

type FormData = z.infer<typeof formSchema>;

export const AddShippingDateForm = ({ onSuccess }: { onSuccess: () => void }) => {
  const { toast } = useToast();
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shipping_date: "",
      from_location: "",
      to_location: "",
    },
  });

  const onSubmit = async (values: FormData) => {
    try {
      const { error } = await supabase
        .from("scheduled_shipping_dates")
        .insert({
          shipping_date: values.shipping_date,
          from_location: values.from_location,
          to_location: values.to_location,
        });

      if (error) {
        console.error("Error adding shipping date:", error);
        throw error;
      }

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
        <FormField
          control={form.control}
          name="shipping_date"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Date</FormLabel>
              <FormControl>
                <Input type="date" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="from_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Origin Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="to_location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Destination Location</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full">
          Add Shipping Date
        </Button>
      </form>
    </Form>
  );
};