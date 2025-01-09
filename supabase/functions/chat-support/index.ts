import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.0';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const generateChatEmailHtml = (messages: any[]) => {
  const chatTranscript = messages
    .map(msg => `<p><strong>${msg.isUser ? 'User' : 'Assistant'}:</strong> ${msg.content}</p>`)
    .join('\n');

  return `
    <h2>New Chat Conversation</h2>
    <div style="margin-top: 20px;">
      <h3>Chat Transcript:</h3>
      ${chatTranscript}
    </div>
  `;
};

const sendEmailNotification = async (messages: any[]) => {
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "MO Multi Services <onboarding@resend.dev>",
        to: ["momultiservicesllc@gmail.com"],
        subject: "New Chat Conversation",
        html: generateChatEmailHtml(messages),
      }),
    });

    if (!res.ok) {
      const errorText = await res.text();
      console.error('Resend API Error:', errorText);
      throw new Error(`Failed to send email: ${errorText}`);
    }

    const data = await res.json();
    console.log('Email sent successfully:', data);
    return data;
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
};

const businessContext = `
You are a concise shipping support assistant for MO Multi Services LLC. Keep responses under 3 sentences when possible.

Company Details:
- Name: MO Multi Services LLC
- Location: Bronx, NY
- Contact: +1 (347) 389-3821, momultiservicesllc@gmail.com
- Available 24/7 via phone/WhatsApp
- Service Area: USA to Gambia shipping

Core Services:
1. Express GP Shipping:
   - Processing time: 3-5 business days
   - Pricing:
     * Phones: $30 flat rate
     * Laptops/Tablets: $50 flat rate
     * Other items: $12 per pound
     * Volume discounts for orders over 10 lbs
   - Door-to-door delivery available
   - Package tracking provided

2. Online Shopping Service:
   - We order items from US websites for customers
   - Service fee: 15% of total order amount
   - We handle complete process from purchase to delivery
   - Available for all major US retailers
   - Screenshot upload available for specific items

3. Shipping Calendar System:
   - Regular scheduled shipments
   - Ability to view upcoming shipping dates
   - Flexible booking system

Additional Services:
- Free consultation for shipping inquiries
- Package consolidation
- Custom packaging for fragile items
- Insurance options available
- WhatsApp support for real-time updates

Shipping Restrictions:
- No hazardous materials
- No perishable goods
- No illegal items
- Weight limits apply

Payment Information:
- Accept all major payment methods
- Secure payment processing
- Transparent pricing with no hidden fees
- Deposit required for large shipments

Response Guidelines:
- Always be polite and professional
- Include relevant contact information when asked
- Mention WhatsApp availability for urgent queries
- Keep responses concise but informative
- Focus on answering the specific question asked
- Provide pricing when relevant
- Share upcoming shipping dates when asked about schedules`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    if (!supabaseUrl || !supabaseServiceKey) {
      throw new Error('Supabase configuration missing');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message, history = [] } = await req.json();
    
    if (!message) {
      throw new Error('No message provided');
    }

    // Fetch shipping dates
    console.log('Fetching shipping dates...');
    const { data: shippingDates, error: shippingError } = await supabase
      .from('scheduled_shipping_dates')
      .select('*')
      .gte('shipping_date', new Date().toISOString())
      .order('shipping_date', { ascending: true })
      .limit(5);

    if (shippingError) {
      console.error('Error fetching shipping dates:', shippingError);
      throw shippingError;
    }

    // Format shipping dates for context
    const formattedDates = shippingDates.map(date => ({
      date: new Date(date.shipping_date).toLocaleDateString(),
      from: date.from_location,
      to: date.to_location
    }));

    console.log('Shipping dates fetched:', formattedDates);

    // Create dynamic context with latest shipping information
    const dynamicContext = `
${businessContext}

Current Shipping Schedule (next 5 upcoming dates):
${formattedDates.map(d => `- ${d.date}: ${d.from} to ${d.to}`).join('\n')}

When asked about shipping dates or schedule:
1. Always provide the most recent schedule information above
2. Mention that schedules are updated in real-time
3. Recommend checking the calendar page for the full schedule
4. Note that users can receive real-time notifications for schedule changes

Remember: Keep responses brief and focused on the customer's question.`;

    console.log('Calling OpenAI API...');
    
    // Prepare messages array with context and history
    const messages = [
      { role: 'system', content: dynamicContext },
      ...history,
      { role: 'user', content: message }
    ];

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4',
        messages: messages,
        max_tokens: 500,
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
    console.log('OpenAI response received');
    const aiResponse = data.choices[0].message.content;

    // Send email notification with chat transcript
    const updatedHistory = [...history, { content: message, isUser: true }, { content: aiResponse, isUser: false }];
    await sendEmailNotification(updatedHistory);

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in chat-support function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'An error occurred while processing your request'
      }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});