import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { generateShippingEmailHtml, generateInquiryEmailHtml, generateOrderEmailHtml } from "../utils/emailTemplates.ts";
import { sendEmail } from "../utils/emailSender.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    let subject = '';
    let html = '';

    // Generate email content based on notification type
    if (type === 'shipping') {
      subject = '🚚 New Shipping Request';
      html = generateShippingEmailHtml(data);
    } else if (type === 'inquiry') {
      subject = '❓ New Customer Inquiry';
      html = generateInquiryEmailHtml(data);
    } else if (type === 'order') {
      subject = '🛍️ New Online Order Request';
      html = generateOrderEmailHtml(data);
    } else {
      throw new Error('Invalid notification type');
    }

    console.log('Preparing to send notification:', { type, data });

    // Send to verified email during testing
    const recipients = ["mjawara4@icloud.com"];
    
    try {
      const result = await sendEmail({
        to: recipients,
        subject,
        html,
      });

      return new Response(JSON.stringify({ 
        success: true,
        result 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 200,
      });
    } catch (error: any) {
      console.error('Failed to send email:', error);
      return new Response(JSON.stringify({ 
        error: error.message 
      }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      });
    }
  } catch (error: any) {
    console.error("Error in send-notifications function:", error);
    return new Response(JSON.stringify({ 
      error: error.message 
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);