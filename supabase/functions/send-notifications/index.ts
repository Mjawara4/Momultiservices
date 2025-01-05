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

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, data } = await req.json();
    let emailHtml = '';
    let subject = '';

    if (type === 'shipping') {
      const shippingData = data as ShippingData;
      subject = 'New Shipping Request';
      emailHtml = `
        <h2>New Shipping Request</h2>
        <p><strong>Name:</strong> ${shippingData.name}</p>
        <p><strong>Phone:</strong> ${shippingData.phone}</p>
        <p><strong>From:</strong> ${shippingData.from_location}</p>
        <p><strong>To:</strong> ${shippingData.to_location}</p>
        <p><strong>Weight:</strong> ${shippingData.weight} lbs</p>
        <p><strong>Package Type:</strong> ${shippingData.package_type}</p>
        <p><strong>Estimated Price:</strong> $${shippingData.estimated_price}</p>
      `;
    } else if (type === 'inquiry') {
      const inquiryData = data as InquiryData;
      subject = 'New Inquiry';
      emailHtml = `
        <h2>New Inquiry</h2>
        <p><strong>Name:</strong> ${inquiryData.name}</p>
        <p><strong>Phone:</strong> ${inquiryData.phone}</p>
        <p><strong>Subject:</strong> ${inquiryData.subject}</p>
        <p><strong>Question:</strong> ${inquiryData.question}</p>
        <p><strong>Country:</strong> ${inquiryData.country}</p>
        <p><strong>Preferred Contact Method:</strong> ${inquiryData.preferredContactMethod}</p>
      `;
    }

    console.log("Sending email with HTML:", emailHtml);

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "Shipping Notifications <onboarding@resend.dev>",
        to: ["momultiservicesllc@gmail.com"],
        subject: subject,
        html: emailHtml,
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error("Error response from Resend:", errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const data = await res.json();
    console.log("Email sent successfully:", data);

    return new Response(JSON.stringify({ success: true }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Error in send-notifications function:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
};

serve(handler);