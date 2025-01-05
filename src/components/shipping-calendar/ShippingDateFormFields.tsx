import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ShippingDateFormData } from "./AddShippingDateForm";

interface ShippingDateFormFieldsProps {
  form: UseFormReturn<ShippingDateFormData>;
}

export const ShippingDateFormFields = ({ form }: ShippingDateFormFieldsProps) => {
  return (
    <>
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
    </>
  );
};