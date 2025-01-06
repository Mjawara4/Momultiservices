import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UseFormReturn } from "react-hook-form";
import { OrderFormValues } from "./schema";

interface ProductDetailsFieldsProps {
  form: UseFormReturn<OrderFormValues>;
}

export const ProductDetailsFields = ({ form }: ProductDetailsFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="websiteLink"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Enter the link to the website where you'd like us to order from:</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="https://example.com/product"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="screenshot"
        render={({ field: { onChange, value, ...field } }) => (
          <FormItem>
            <FormLabel>Upload a screenshot of the product:</FormLabel>
            <FormControl>
              <Input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(e) => onChange(e.target.files)}
                {...field}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};