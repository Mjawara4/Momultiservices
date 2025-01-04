import { supabase } from "@/integrations/supabase/client";
import { ShippingFormData } from "./ShippingForm";

const calculatePrice = (weight: number, packageType: string) => {
  if (packageType === "laptop" || packageType === "tablet") {
    return 50;
  } else if (packageType === "phone") {
    return 30;
  } else {
    return weight * 12;
  }
};

export const submitShippingRequest = async (values: ShippingFormData) => {
  const estimatedPrice = calculatePrice(values.weight, values.packageType);
  
  // First, save to Supabase
  const { error: supabaseError } = await supabase
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

  if (supabaseError) throw supabaseError;

  // Then, send email notification
  const { error: emailError } = await supabase.functions.invoke('send-shipping-notification', {
    body: {
      shippingData: {
        name: values.name,
        phone: values.phone,
        from_location: values.fromLocation,
        to_location: values.toLocation,
        weight: values.weight,
        package_type: values.packageType,
        estimated_price: estimatedPrice
      }
    }
  });

  if (emailError) throw emailError;
  
  return { estimatedPrice };
};