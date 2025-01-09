export const generateChatEmailHtml = (messages: any[]) => {
  const chatTranscript = messages
    .map(msg => {
      const role = msg.isUser ? 'Customer' : 'AI Assistant';
      const style = msg.isUser 
        ? 'background-color: #f3f4f6; padding: 10px; border-radius: 8px; margin: 5px 0;'
        : 'background-color: #e5e7eb; padding: 10px; border-radius: 8px; margin: 5px 0;';
      
      return `
        <div style="${style}">
          <strong>${role}:</strong><br>
          ${msg.content}
        </div>
      `;
    })
    .join('\n');

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #374151;">New Chat Conversation</h2>
      <p style="color: #6b7280;">A customer has just finished a chat conversation with the AI assistant.</p>
      <div style="margin-top: 20px;">
        <h3 style="color: #374151;">Chat Transcript:</h3>
        ${chatTranscript}
      </div>
    </div>
  `;
};

export const sendEmailNotification = async (messages: any[]) => {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["mjawara4@icloud.com"], // Using verified email for testing
        subject: "New Chat Conversation Transcript",
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