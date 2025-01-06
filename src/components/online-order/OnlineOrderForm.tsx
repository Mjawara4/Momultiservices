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
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { useState } from "react";
import { Loader2 } from "lucide-react";

const formSchema = z.object({
  websiteLink: z.string().url("Please enter a valid URL"),
  itemDetails: z.string().min(10, "Please provide more details about the items"),
  orderAmount: z.coerce
    .number()
    .min(0.01, "Order amount must be greater than 0")
    .max(1000000, "Order amount cannot exceed $1,000,000"),
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  screenshot: z
    .instanceof(FileList)
    .refine((files) => files.length > 0, "Screenshot is required")
    .refine(
      (files) =>
        files[0]?.type === "image/jpeg" ||
        files[0]?.type === "image/png" ||
        files[0]?.type === "image/webp",
      "Only .jpg, .png, and .webp formats are supported"
    ),
});

export const OnlineOrderForm = () => {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
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

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
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

          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Full Name</FormLabel>
                <FormControl>
                  <Input {...field} placeholder="Your full name" />
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
                  <Input {...field} placeholder="Your phone number" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

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