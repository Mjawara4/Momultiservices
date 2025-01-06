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

const MAX_IMAGE_SIZE = 1024 * 1024; // 1MB
const MAX_WIDTH = 1200;
const QUALITY = 0.8;

const optimizeImage = async (file: File): Promise<Blob> => {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let width = img.width;
      let height = img.height;

      // Calculate new dimensions while maintaining aspect ratio
      if (width > MAX_WIDTH) {
        height = Math.round((height * MAX_WIDTH) / width);
        width = MAX_WIDTH;
      }

      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext('2d');
      if (!ctx) {
        reject(new Error('Failed to get canvas context'));
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);
      
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        'image/jpeg',
        QUALITY
      );
    };

    img.onerror = () => reject(new Error('Failed to load image'));
    img.src = URL.createObjectURL(file);
  });
};

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
      
      // Optimize and upload screenshot
      const file = values.screenshot[0];
      const optimizedBlob = await optimizeImage(file);
      const optimizedFile = new File([optimizedBlob], file.name, { type: 'image/jpeg' });
      
      const fileExt = 'jpg'; // We're converting all images to JPEG
      const fileName = `${crypto.randomUUID()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('product_screenshots')
        .upload(fileName, optimizedFile);

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

      // Send email notification
      const { error: emailError } = await supabase.functions.invoke('send-notifications', {
        body: {
          type: 'order',
          data: {
            ...values,
            serviceFee,
            screenshotUrl: publicUrl
          }
        }
      });

      if (emailError) {
        console.error('Email notification error:', emailError);
        // Don't throw here, as the order was successful
        toast({
          variant: "destructive",
          title: "Warning",
          description: "Order submitted successfully, but there was an issue sending the email notification.",
        });
      }

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