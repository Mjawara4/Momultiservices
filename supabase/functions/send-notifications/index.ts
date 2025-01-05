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
  <h2>New Shipping Request</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Phone:</strong> ${data.phone}</p>
  <p><strong>From:</strong> ${data.from_location}</p>
  <p><strong>To:</strong> ${data.to_location}</p>
  <p><strong>Weight:</strong> ${data.weight} lbs</p>
  <p><strong>Package Type:</strong> ${data.package_type}</p>
  <p><strong>Estimated Price:</strong> $${data.estimated_price}</p>
`;

const generateInquiryEmailHtml = (data: InquiryData) => `
  <h2>New Inquiry</h2>
  <p><strong>Name:</strong> ${data.name}</p>
  <p><strong>Phone:</strong> ${data.phone}</p>
  <p><strong>Subject:</strong> ${data.subject}</p>
  <p><strong>Question:</strong> ${data.question}</p>
  <p><strong>Country:</strong> ${data.country}</p>
  <p><strong>Preferred Contact Method:</strong> ${data.preferredContactMethod}</p>
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
      subject = 'New Shipping Request';
      html = generateShippingEmailHtml(data as ShippingData);
    } else if (type === 'inquiry') {
      subject = 'New Inquiry';
      html = generateInquiryEmailHtml(data as InquiryData);
    } else {
      throw new Error('Invalid notification type');
    }

    console.log('Sending email notification:', { type, data });

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MO Multi Services <onboarding@resend.dev>",
        to: ["mjawara4@icloud.com"], // Updated to use your verified email
        subject: subject,
        html: html,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response from Resend:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const responseData = await res.json();
    console.log("Email sent successfully:", responseData);

    return new Response(JSON.stringify({ success: true }), {
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