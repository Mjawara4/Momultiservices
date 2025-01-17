import { useState } from "react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { UseFormReturn } from "react-hook-form";
import { ShippingFormData } from "./ShippingForm";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

interface DiscountCodeFieldProps {
  form: UseFormReturn<ShippingFormData>;
  onDiscountValidated: (percentage: number | null) => void;
}

export const DiscountCodeField = ({ form, onDiscountValidated }: DiscountCodeFieldProps) => {
  const { toast } = useToast();
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState(false);

  const validateDiscountCode = async () => {
    const code = form.getValues("discountCode");
    if (!code) return;

    setIsValidating(true);
    try {
      const { data, error } = await supabase
        .from('shipping_discount_codes')
        .select('discount_percentage, is_used, expires_at')
        .eq('code', code.toUpperCase())
        .single();

      if (error) throw error;

      if (!data) {
        toast({
          variant: "destructive",
          title: "Invalid Code",
          description: "This discount code is not valid.",
        });
        setIsValid(false);
        onDiscountValidated(null);
        return;
      }

      if (data.is_used) {
        toast({
          variant: "destructive",
          title: "Code Already Used",
          description: "This discount code has already been used.",
        });
        setIsValid(false);
        onDiscountValidated(null);
        return;
      }

      if (data.expires_at && new Date(data.expires_at) < new Date()) {
        toast({
          variant: "destructive",
          title: "Code Expired",
          description: "This discount code has expired.",
        });
        setIsValid(false);
        onDiscountValidated(null);
        return;
      }

      setIsValid(true);
      onDiscountValidated(data.discount_percentage);
      toast({
        title: "Discount Applied!",
        description: `${data.discount_percentage}% discount will be applied to your shipping.`,
      });
    } catch (error) {
      console.error('Error validating discount code:', error);
      toast({
        variant: "destructive",
        title: "Error",
        description: "Failed to validate discount code.",
      });
    } finally {
      setIsValidating(false);
    }
  };

  return (
    <FormField
      control={form.control}
      name="discountCode"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Discount Code (Optional)</FormLabel>
          <div className="flex gap-2">
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter discount code"
                className="uppercase"
                onChange={(e) => {
                  field.onChange(e);
                  setIsValid(false);
                  onDiscountValidated(null);
                }}
              />
            </FormControl>
            <Button 
              type="button" 
              variant="secondary"
              onClick={validateDiscountCode}
              disabled={isValidating || !field.value || isValid}
            >
              {isValidating ? "Validating..." : isValid ? "Applied" : "Apply"}
            </Button>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};