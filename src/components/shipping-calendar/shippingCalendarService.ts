import { supabase } from "@/integrations/supabase/client";

export interface AddShippingDateParams {
  shipping_date: string;
  from_location: string;
  to_location: string;
}

export const addShippingDate = async (values: AddShippingDateParams) => {
  try {
    const { data, error } = await supabase
      .from("scheduled_shipping_dates")
      .insert({
        shipping_date: values.shipping_date,
        from_location: values.from_location,
        to_location: values.to_location,
      })
      .select();

    if (error) {
      console.error("Error adding shipping date:", error);
      throw error;
    }

    return data;
  } catch (error) {
    console.error("Error in addShippingDate:", error);
    throw error;
  }
};