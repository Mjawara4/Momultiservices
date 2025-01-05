import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const businessContext = `
You are a helpful shipping support assistant for our Express GP shipping service. Here are key details about our business:

Service Areas and Operations:
- We specialize in shipping between The Gambia and the USA exclusively
- All pickups and dropoffs are by appointment only - customers must call to schedule
- Processing and shipping takes 3-5 days
- All our shipments are expedited by default

Package Handling and Restrictions:
- We handle all packages with extra care and secure wrapping
- We cannot ship items restricted by airlines or hazardous materials
- Package tracking is available by phone - customers should call for updates

Pricing and Discounts:
- Special discounts available for shipments over 10 lbs
- Additional fee for pickup service
- For specific pricing and refund policies, direct customers to call us

Please provide friendly, helpful responses based on this information. For specific pricing details, refund inquiries, or to make appointments, kindly direct customers to call us. If asked about services we don't offer or routes we don't cover, politely explain our current focus on Gambia-USA shipping routes.`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!openAIApiKey) {
      console.error('OpenAI API key is not configured');
      throw new Error('OpenAI API key is not configured');
    }

    const { message } = await req.json();
    
    if (!message) {
      console.error('No message provided');
      throw new Error('No message provided');
    }

    console.log('Sending message to OpenAI:', message);

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
            content: businessContext
          },
          { role: 'user', content: message }
        ],
        max_tokens: 150,
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