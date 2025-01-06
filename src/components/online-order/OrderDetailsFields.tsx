import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "./schema";

interface OrderDetailsFieldsProps {
  form: UseFormReturn<OrderFormValues>;
}

export const OrderDetailsFields = ({ form }: OrderDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="itemDetails"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Describe the item(s) you'd like us to order for you:</FormLabel>
            <FormControl>
              <Textarea 
                {...field} 
                placeholder="Please provide detailed information about the items you want us to order"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="orderAmount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter the total cost of your order (in USD):</FormLabel>
            <FormControl>
              <Input 
                type="number" 
                step="0.01"
                min="0"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};