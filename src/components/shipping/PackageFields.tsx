import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "./ShippingForm";

interface PackageFieldsProps {
  form: UseFormReturn<ShippingFormData>;
}

export const PackageFields = ({ form }: PackageFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="weight"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package Weight (lbs)</FormLabel>
            <FormControl>
              <Input
                type="number"
                step="0.1"
                min="0"
                {...field}
                onChange={(e) => field.onChange(e.target.valueAsNumber)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="packageType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Package Type</FormLabel>
            <Select onValueChange={field.onChange} defaultValue={field.value}>
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select package type" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="laptop">Laptop/Tablet</SelectItem>
                <SelectItem value="phone">Phone</SelectItem>
                <SelectItem value="other">Other</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
    </>
  );
};