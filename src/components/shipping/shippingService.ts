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

export const submitShippingRequest = async (values: ShippingFormData, discountPercentage: number | null) => {
  const originalPrice = calculatePrice(values.weight, values.packageType);
  const estimatedPrice = discountPercentage 
    ? originalPrice * (1 - discountPercentage / 100) 
    : originalPrice;
  
  // If there's a discount code, mark it as used
  if (values.discountCode && discountPercentage) {
    const { error: discountError } = await supabase
      .from('shipping_discount_codes')
      .update({ 
        is_used: true,
        used_at: new Date().toISOString()
      })
      .eq('code', values.discountCode.toUpperCase());

    if (discountError) {
      console.error('Error updating discount code:', discountError);
      throw new Error('Failed to process discount code');
    }
  }

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
        estimated_price: estimatedPrice,
        original_price: originalPrice,
        discount_applied: discountPercentage ? `${discountPercentage}%` : null,
        discount_code: values.discountCode ? values.discountCode.toUpperCase() : null
      }
    }
  });

  if (emailError) {
    console.error('Email Error:', emailError);
    throw new Error('Failed to send email notification');
  }

  console.log('Shipping request submitted successfully:', data);
  return { estimatedPrice, originalPrice, data };
};