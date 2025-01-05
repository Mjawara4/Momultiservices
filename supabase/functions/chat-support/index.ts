import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const businessContext = `
You are a helpful shipping support assistant for our Express GP shipping service. Here are key details about our business:

- We offer Express GP ground shipping services for various package types
- Our shipping rates vary by package type:
  * Laptops/Tablets: $50
  * Phones: $30
  * Other items: $12 per pound
- Most domestic shipments arrive within 3-5 business days
- We offer shipping insurance for all packages, with cost varying based on declared value
- We cannot ship hazardous materials, perishables, or illegal items
- We currently only offer ground shipping services (Air Cargo and Online Shopping coming soon)
- We operate primarily in domestic routes
- For international shipping queries, kindly inform customers that we currently focus on domestic services

Please provide friendly, concise responses based on this information. If asked about services we don't offer, politely explain our current limitations and suggest our available alternatives.`;

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
        model: 'gpt-4o-mini',
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