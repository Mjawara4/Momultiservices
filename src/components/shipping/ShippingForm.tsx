import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { submitShippingRequest } from "./shippingService";
import { PersonalInfoFields } from "./PersonalInfoFields";
import { LocationFields } from "./LocationFields";
import { PackageFields } from "./PackageFields";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  fromLocation: z.string().min(2, "Please enter a valid location"),
  toLocation: z.string().min(2, "Please enter a valid location"),
  weight: z.coerce.number().min(0, "Weight must be a positive number"),
  packageType: z.string().min(1, "Please select a package type"),
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
      weight: 0,
      packageType: "",
    },
  });

  const onSubmit = async (values: ShippingFormData) => {
    try {
      const result = await submitShippingRequest(values);
      
      toast({
        title: "Shipping Request Submitted!",
        description: (
          <div className="space-y-2">
            <p>Estimated price: ${result.estimatedPrice}</p>
            <p>From: {values.fromLocation}</p>
            <p>To: {values.toLocation}</p>
            <p>Package Type: {values.packageType}</p>
            <p>Weight: {values.weight} lbs</p>
            <div className="mt-4 pt-2 border-t">
              <p>For any questions, please contact us:</p>
              <p>Phone: +1 (347) 389-3821</p>
              <p>Email: momultiservicesllc@gmail.com</p>
            </div>
          </div>
        ),
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
        <PersonalInfoFields form={form} />
        <LocationFields form={form} />
        <PackageFields form={form} />
        
        <Button type="submit" className="w-full">
          Calculate Shipping & Submit
        </Button>
      </form>
    </Form>
  );
};