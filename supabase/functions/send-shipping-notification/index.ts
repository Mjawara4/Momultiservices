import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ShippingData {
  name: string;
  phone: string;
  from_location: string;
  to_location: string;
  weight: number;
  package_type: string;
  estimated_price: number;
  shipping_date?: string;
}

const handler = async (req: Request): Promise<Response> => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { shippingData } = await req.json();
    const emailHtml = `
      <h2>New Shipping Request</h2>
      <p><strong>Name:</strong> ${shippingData.name}</p>
      <p><strong>Phone:</strong> ${shippingData.phone}</p>
      <p><strong>From:</strong> ${shippingData.from_location}</p>
      <p><strong>To:</strong> ${shippingData.to_location}</p>
      <p><strong>Weight:</strong> ${shippingData.weight}kg</p>
      <p><strong>Package Type:</strong> ${shippingData.package_type}</p>
      <p><strong>Estimated Price:</strong> $${shippingData.estimated_price}</p>
      ${shippingData.shipping_date ? `<p><strong>Shipping Date:</strong> ${shippingData.shipping_date}</p>` : ''}
    `;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Shipping Notifications <onboarding@resend.dev>",
        to: ["your-email@example.com"], // Replace with your email
        subject: "New Shipping Request",
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      throw new Error(`Failed to send email: ${await res.text()}`);
    }

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);