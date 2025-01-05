import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const businessContext = `
You are a helpful shipping support assistant for MO Multi Services LLC. Here are key details about our business:

Company Information:
- Company Name: MO Multi Services LLC
- Phone: +1 (347) 389-3821
- Email: momultiservicesllc@gmail.com
- Location: Bronx, NY
- WhatsApp available for customer support
- We're available 24/7 for inquiries

Service Areas and Operations:
- We specialize in shipping between The Gambia and the USA exclusively
- All pickups and dropoffs are by appointment only
- Processing and shipping takes 3-5 business days
- All shipments are expedited by default
- We serve both residential and commercial customers

Package Handling and Services:
- We handle all types of packages with secure wrapping
- Special handling for electronics (phones, laptops, tablets)
- Package tracking available via phone
- Real-time shipping updates provided
- Door-to-door pickup and delivery available

Pricing Structure:
- Phones: $30 flat rate
- Laptops/Tablets: $50 flat rate
- Other items: $12 per pound
- Volume discounts available for shipments over 10 lbs
- Additional fee for pickup/delivery service
- Transparent pricing with no hidden fees

Contact Information:
When customers ask about contacting us, always provide:
1. Phone: +1 (347) 389-3821
2. Email: momultiservicesllc@gmail.com
3. Location: Bronx, NY
4. Mention that we're available on WhatsApp

Shipping Guidelines:
- All packages must be properly packaged
- No hazardous materials or restricted items
- Valid ID required for pickup/dropoff
- Insurance available for valuable items
- Customs documentation provided when needed

Customer Service:
- 24/7 customer support via phone and WhatsApp
- Real-time tracking updates
- Flexible pickup/delivery scheduling
- Professional and courteous service
- Quick response to all inquiries

Always be friendly and professional in your responses. When customers ask about contacting us, make sure to provide our complete contact information. Encourage customers to reach out via phone or WhatsApp for immediate assistance.`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey || !supabaseUrl || !supabaseServiceKey) {
      throw new Error('Required environment variables are not configured');
    }

    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    const { message } = await req.json();
    
    if (!message) {
      throw new Error('No message provided');
    }

    // Fetch upcoming shipping dates
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

    // Format shipping dates for the AI context
    const shippingSchedule = shippingDates
      .map(date => `- ${new Date(date.shipping_date).toLocaleDateString()}: ${date.from_location} to ${date.to_location}`)
      .join('\n');

    const dynamicContext = `
${businessContext}

Current Shipping Schedule:
${shippingSchedule}

Remember to:
1. Always provide contact information when asked
2. Be specific about pricing based on package type
3. Mention our WhatsApp availability for quick responses
4. Emphasize our specialization in USA-Gambia shipping`;

    console.log('Sending message to OpenAI with context:', dynamicContext);

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o',
        messages: [
          { 
            role: 'system', 
            content: dynamicContext
          },
          { role: 'user', content: message }
        ],
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
    console.log('OpenAI response:', data);

    if (!data.choices || !data.choices[0] || !data.choices[0].message) {
      throw new Error('Invalid response format from OpenAI');
    }

    const aiResponse = data.choices[0].message.content;

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