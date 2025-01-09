import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { parseISO, isFuture, isToday, startOfDay } from "date-fns";
import type { ShippingDate } from "@/types/calendar";

export const useShippingDates = () => {
  return useQuery<ShippingDate[]>({
    queryKey: ["scheduled-shipping-dates"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("scheduled_shipping_dates")
        .select("*")
        .order('shipping_date', { ascending: true });
      
      if (error) {
        console.error("Error fetching shipping dates:", error);
        throw error;
      }
      
      // Filter for today and future dates
      return (data || []).filter(date => {
        const shipDate = startOfDay(parseISO(date.shipping_date));
        const today = startOfDay(new Date());
        return isToday(shipDate) || isFuture(shipDate);
      });
    },
  });
};