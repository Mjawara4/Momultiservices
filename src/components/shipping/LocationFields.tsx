import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "./ShippingForm";

interface LocationFieldsProps {
  form: UseFormReturn<ShippingFormData>;
}

export const LocationFields = ({ form }: LocationFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="fromLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shipping From</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="toLocation"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Shipping To</FormLabel>
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