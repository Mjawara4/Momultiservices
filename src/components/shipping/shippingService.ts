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
  
  // Save to Supabase
  const { data, error: supabaseError } = await supabase
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
    })
    .select()
    .single();

  if (supabaseError) {
    console.error('Supabase Error:', supabaseError);
    throw new Error('Failed to submit shipping request');
  }

  // Send email notification
  const { error: emailError } = await supabase.functions.invoke('send-notifications', {
    body: {
      type: 'shipping',
      data: {
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

  if (emailError) {
    console.error('Email Error:', emailError);
    throw new Error('Failed to send email notification');
  }

  console.log('Shipping request submitted successfully:', data);
  return { estimatedPrice, data };
};