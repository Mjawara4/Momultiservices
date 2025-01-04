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
import { useState } from "react";
import { useToast } from "@/components/ui/use-toast";
import { Card } from "@/components/ui/card";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  fromLocation: z.string().min(2, "Please enter a valid location"),
  toLocation: z.string().min(2, "Please enter a valid location"),
  weight: z.string().transform((val) => Number(val)),
  packageType: z.string(),
});

const Ship = () => {
  const [estimatedPrice, setEstimatedPrice] = useState<number | null>(null);
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
    const price = calculatePrice(values.weight, values.packageType);
    setEstimatedPrice(price);

    // TODO: Add Supabase integration here
    toast({
      title: "Shipping Request Received",
      description: "We'll contact you shortly to arrange pickup.",
    });
  };

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="container max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-center">Ship a Package</h1>
        
        <Card className="p-6">
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-2">Drop-off Location:</h2>
            <p>123 Shipping Street, City, State 12345</p>
            <p className="mt-2">Contact: (555) 123-4567</p>
          </div>

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
                        <SelectItem value="phone">Phone (iPhone/Android)</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {estimatedPrice !== null && (
                <div className="p-4 bg-primary/10 rounded-lg">
                  <p className="text-lg font-semibold">
                    Estimated Price: ${estimatedPrice}
                  </p>
                </div>
              )}

              <Button type="submit" className="w-full">
                Submit Shipping Request
              </Button>
            </form>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Ship;