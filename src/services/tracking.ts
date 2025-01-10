import { supabase } from "@/integrations/supabase/client";
import { TrackingFormData } from "@/components/admin/tracking/TrackingForm";

export const createTracking = async (formData: TrackingFormData) => {
  // Check if tracking number already exists
  const { data: existingTracking } = await supabase
    .from('shipping_tracking')
    .select('tracking_number')
    .eq('tracking_number', formData.tracking_number)
    .single();

  if (existingTracking) {
    throw new Error("This tracking number already exists.");
  }

  // Create a new shipping date entry
  const { data: shippingDate, error: shippingDateError } = await supabase
    .from('scheduled_shipping_dates')
    .insert([{
      from_location: formData.from_location,
      to_location: formData.to_location,
      shipping_date: new Date().toISOString().split('T')[0],
    }])
    .select()
    .single();

  if (shippingDateError) throw shippingDateError;

  // Create tracking entry with the new shipping_id
  const { data, error } = await supabase
    .from('shipping_tracking')
    .insert([{
      tracking_number: formData.tracking_number,
      shipping_id: shippingDate.id,
      status: formData.status,
      location: formData.location || null,
      estimated_delivery: formData.estimated_delivery || null,
      notes: formData.notes || null,
    }])
    .select()
    .single();

  if (error) throw error;

  return data;
};