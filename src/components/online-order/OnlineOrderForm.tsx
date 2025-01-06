import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Form, FormLabel } from "@/components/ui/form";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import { orderFormSchema, OrderFormValues } from "./schema";
import { ProductDetailsFields } from "./ProductDetailsFields";
import { OrderDetailsFields } from "./OrderDetailsFields";
import { PersonalInfoFields } from "./PersonalInfoFields";

export const OnlineOrderForm = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<OrderFormValues>({
    resolver: zodResolver(orderFormSchema),
    defaultValues: {
      websiteLink: "",
      itemDetails: "",
      orderAmount: 0,
      name: "",
      phone: "",
    },
  });

  const orderAmount = form.watch("orderAmount");
  const serviceFee = orderAmount * 0.15;

  const onSubmit = async (values: OrderFormValues) => {
    try {
      setIsUploading(true);
      
      // Upload screenshot
      const file = values.screenshot[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_screenshots')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product_screenshots')
        .getPublicUrl(fileName);

      // Submit order with screenshot URL
      const { error } = await supabase
        .from('online_orders')
        .insert({
          website_link: values.websiteLink,
          item_details: values.itemDetails,
          order_amount: values.orderAmount,
          service_fee: serviceFee,
          name: values.name,
          phone: values.phone,
          screenshot_url: publicUrl,
        });

      if (error) throw error;

      toast({
        title: "Order Request Submitted!",
        description: (
          <div className="space-y-2">
            <p>Thank you! Your order request has been submitted successfully.</p>
            <p>Order Amount: ${values.orderAmount.toFixed(2)}</p>
            <p>Service Fee: ${serviceFee.toFixed(2)}</p>
            <div className="mt-4 pt-2 border-t">
              <p>We'll get back to you shortly.</p>
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
        description: "There was a problem submitting your order request.",
      });
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Card className="p-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <ProductDetailsFields form={form} />
          <OrderDetailsFields form={form} />
          <PersonalInfoFields form={form} />

          <div className="p-4 bg-secondary rounded-md">
            <FormLabel>Our service fee (15%):</FormLabel>
            <div className="text-lg font-semibold">
              ${serviceFee.toFixed(2)}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full"
            disabled={isUploading}
          >
            {isUploading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              'Submit Order Request'
            )}
          </Button>
        </form>
      </Form>
    </Card>
  );
};