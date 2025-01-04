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
  
  // Save to Supabase only
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
  
  return { estimatedPrice };
};