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
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  fromLocation: z.string().min(2, "Please enter a valid location"),
  toLocation: z.string().min(2, "Please enter a valid location"),
  weight: z.string().transform((val) => Number(val) || 0),
  packageType: z.string(),
});

const Ship = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
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

  const calculatePrice = (weight: number, packageType: string) => {
    if (packageType === "laptop" || packageType === "tablet") {
      return 50;
    } else if (packageType === "phone") {
      return 30;
    } else {
      return weight * 12;
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    const estimatedPrice = calculatePrice(values.weight, values.packageType);
    
    const { error } = await supabase
      .from('ship_site_data')
      .insert({
        name: values.name,
        phone: values.phone,
        from_location: values.fromLocation,
        to_location: values.toLocation,
        weight: values.weight,
        package_type: values.packageType,
        estimated_price: estimatedPrice,
        type: 'shipping'
      });

    if (error) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "There was a problem submitting your shipping request.",
      });
      console.error('Error:', error);
      return;
    }

    toast({
      title: "Shipping Request Submitted",
      description: `Estimated shipping cost: $${estimatedPrice}`,
    });
    form.reset();
  };

  return (
    <div className="container max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-center">Ship a Package</h1>
      
      <Card className="p-6">
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
      </Card>
    </div>
  );
};

export default Ship;