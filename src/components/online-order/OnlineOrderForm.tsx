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
import { supabase } from "@/integrations/supabase/client";

const formSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  phone: z.string().min(10, "Please enter a valid phone number"),
  websiteLink: z.string().url("Please enter a valid URL"),
  itemDetails: z.string().min(10, "Please provide more details about the item(s)"),
  orderAmount: z.coerce.number().positive("Order amount must be greater than 0"),
});

export const OnlineOrderForm = () => {
  const { toast } = useToast();
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      phone: "",
      websiteLink: "",
      itemDetails: "",
      orderAmount: 0,
    },
  });

  const orderAmount = form.watch("orderAmount");
  const serviceFee = orderAmount * 0.15;

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const { error } = await supabase
        .from('online_orders')
        .insert({
          name: values.name,
          phone: values.phone,
          website_link: values.websiteLink,
          item_details: values.itemDetails,
          order_amount: values.orderAmount,
          service_fee: serviceFee,
        });

      if (error) throw error;
      
      toast({
        title: "Order Request Submitted!",
        description: (
          <div className="mt-2 space-y-2">
            <p>Thank you! Your order request has been submitted successfully.</p>
            <p>We'll get back to you shortly.</p>
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
        description: "There was a problem submitting your order request.",
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
                <Input placeholder="Enter your full name" {...field} />
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
                <Input placeholder="Enter your phone number" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="websiteLink"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Enter the link to the website where you'd like us to order from:</FormLabel>
              <FormControl>
                <Input placeholder="Enter a valid URL" {...field} />
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
                  placeholder="Please provide detailed information about the items you want us to order"
                  className="min-h-[100px]"
                  {...field}
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
                  placeholder="Enter the total amount"
                  {...field}
                  onChange={(e) => field.onChange(e.target.valueAsNumber)}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="p-4 bg-muted rounded-md">
          <FormLabel>Our service fee (15%):</FormLabel>
          <div className="text-lg font-semibold">
            ${serviceFee.toFixed(2)}
          </div>
        </div>

        <Button type="submit" className="w-full">
          Submit Order Request
        </Button>
      </form>
    </Form>
  );
};