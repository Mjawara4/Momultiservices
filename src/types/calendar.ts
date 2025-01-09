import type { Database } from "@/integrations/supabase/types";
import type { RealtimePostgresChangesPayload } from '@supabase/supabase-js';

export type ShippingDate = Database['public']['Tables']['scheduled_shipping_dates']['Row'];

export interface RealtimeShippingPayload extends RealtimePostgresChangesPayload<{
  [key: string]: any;
}> {
  eventType: 'INSERT' | 'UPDATE' | 'DELETE';
  new: ShippingDate | null;
  old: ShippingDate | null;
}