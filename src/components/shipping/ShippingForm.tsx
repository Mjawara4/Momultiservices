import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { submitShippingRequest } from "./shippingService";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  fromLocation: z.string().min(2, "Please enter a valid location"),
  toLocation: z.string().min(2, "Please enter a valid location"),
  weight: z.string().transform((val) => parseFloat(val) || 0), // Transform string to number with fallback
  packageType: z.string(),
});

export type ShippingFormData = z.infer<typeof formSchema>;

export const ShippingForm = () => {
  const { toast } = useToast();
  
  const form = useForm<ShippingFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      fromLocation: "",
      toLocation: "",
      weight: "",
      packageType: "",
    },
  });

  const onSubmit = async (values: ShippingFormData) => {
    try {
      await submitShippingRequest(values);
      
      toast({
        title: "Success!",
        description: "Shipping request submitted successfully.",
      });
      
      form.reset();
    } catch (error) {
      console.error('Error:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your shipping request.",
      });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full Name</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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

        <FormField
          control={form.control}
          name="weight"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Package Weight (lbs)</FormLabel>
              <FormControl>
                <Input type="number" {...field} />
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

        <Button type="submit" className="w-full">
          Calculate Shipping & Submit
        </Button>
      </form>
    </Form>
  );
};