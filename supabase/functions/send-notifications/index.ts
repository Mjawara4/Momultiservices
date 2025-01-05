import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

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
}

interface InquiryData {
  name: string;
  phone: string;
  question: string;
  country: string;
  preferredContactMethod: string;
  subject: string;
}

const generateShippingEmailHtml = (data: ShippingData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .price { color: #2b6cb0; font-size: 1.2em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Shipping Request</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${data.name}
          </div>
          <div class="field">
            <span class="label">Phone:</span> ${data.phone}
          </div>
          <div class="field">
            <span class="label">From:</span> ${data.from_location}
          </div>
          <div class="field">
            <span class="label">To:</span> ${data.to_location}
          </div>
          <div class="field">
            <span class="label">Weight:</span> ${data.weight} lbs
          </div>
          <div class="field">
            <span class="label">Package Type:</span> ${data.package_type}
          </div>
          <div class="field price">
            <span class="label">Estimated Price:</span> $${data.estimated_price}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

const generateInquiryEmailHtml = (data: InquiryData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .question { background: #f9f9f9; padding: 15px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>New Customer Inquiry</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${data.name}
          </div>
          <div class="field">
            <span class="label">Phone:</span> ${data.phone}
          </div>
          <div class="field">
            <span class="label">Subject:</span> ${data.subject}
          </div>
          <div class="field">
            <span class="label">Country:</span> ${data.country}
          </div>
          <div class="field">
            <span class="label">Preferred Contact Method:</span> ${data.preferredContactMethod}
          </div>
          <div class="question">
            <span class="label">Question:</span><br>
            ${data.question}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    let subject = '';
    let html = '';

    if (type === 'shipping') {
      subject = '🚚 New Shipping Request';
      html = generateShippingEmailHtml(data as ShippingData);
    } else if (type === 'inquiry') {
      subject = '❓ New Customer Inquiry';
      html = generateInquiryEmailHtml(data as InquiryData);
    } else {
      throw new Error('Invalid notification type');
    }

    console.log('Sending email notification:', { type, data });

    // Send to both emails for redundancy
    const emails = ["mjawara4@icloud.com", "momultiservicesllc@gmail.com"];
    const emailPromises = emails.map(async (email) => {
      try {
        const res = await fetch("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${RESEND_API_KEY}`,
          },
          body: JSON.stringify({
            from: "MO Multi Services <onboarding@resend.dev>",
            to: [email],
            subject: subject,
            html: html,
          }),
        });

        if (!res.ok) {
          const errorText = await res.text();
          console.error(`Error sending email to ${email}:`, errorText);
          return { email, success: false, error: errorText };
        }

        const responseData = await res.json();
        console.log(`Email sent successfully to ${email}:`, responseData);
        return { email, success: true };
      } catch (error) {
        console.error(`Error sending email to ${email}:`, error);
        return { email, success: false, error };
      }
    });

    const results = await Promise.all(emailPromises);
    const successfulSends = results.filter(r => r.success);

    if (successfulSends.length === 0) {
      throw new Error('Failed to send email to all recipients');
    }

    return new Response(JSON.stringify({ 
      success: true,
      results
    }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error: any) {
    console.error("Error in send-notifications function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);