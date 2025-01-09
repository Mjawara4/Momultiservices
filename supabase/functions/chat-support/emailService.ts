export const generateChatEmailHtml = (messages: any[]) => {
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

export const sendEmailNotification = async (messages: any[]) => {
  const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
  
  try {
    // For testing, send to verified email
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${RESEND_API_KEY}`,
      },
      body: JSON.stringify({
        from: "onboarding@resend.dev",
        to: ["mjawara4@icloud.com"], // Using verified email for testing
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