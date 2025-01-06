import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const businessContext = `
You are a concise shipping support assistant for MO Multi Services LLC. Keep responses under 3 sentences when possible.

Key Details:
- Company: MO Multi Services LLC
- Contact: +1 (347) 389-3821, momultiservicesllc@gmail.com
- Location: Bronx, NY
- Service: USA-Gambia shipping only
- Processing time: 3-5 business days
- Available 24/7 via phone/WhatsApp

Pricing:
- Phones: $30 flat
- Laptops/Tablets: $50 flat
- Other items: $12/lb
- Volume discounts over 10 lbs

Guidelines:
- Always include contact info when asked
- Mention WhatsApp availability
- Be friendly but brief
- Focus on answering the specific question asked`;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

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
      .limit(3); // Reduced from 5 to 3 for more concise responses

    if (shippingError) {
      console.error('Error fetching shipping dates:', shippingError);
      throw shippingError;
    }

    const shippingSchedule = shippingDates
      .map(date => `${new Date(date.shipping_date).toLocaleDateString()}: ${date.from_location} to ${date.to_location}`)
      .join('\n');

    const dynamicContext = `
${businessContext}

Next Shipping Dates:
${shippingSchedule}

Remember: Keep responses brief and focused on the customer's question.`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { 
            role: 'system', 
            content: dynamicContext
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150, // Reduced from 500 to encourage shorter responses
        temperature: 0.7,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API error:', errorData);
      throw new Error(`OpenAI API error: ${errorData.error?.message || 'Unknown error'}`);
    }

    const data = await response.json();
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