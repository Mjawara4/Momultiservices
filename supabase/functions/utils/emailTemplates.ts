export const generateOrderEmailHtml = (data: any) => {
  return `
    <h2>New Online Order Request</h2>
    <p><strong>Customer Name:</strong> ${data.name}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Website Link:</strong> ${data.websiteLink}</p>
    <p><strong>Item Details:</strong> ${data.itemDetails}</p>
    <p><strong>Order Amount:</strong> $${data.orderAmount.toFixed(2)}</p>
    <p><strong>Service Fee:</strong> $${data.serviceFee.toFixed(2)}</p>
    <p><strong>Screenshot:</strong> <a href="${data.screenshotUrl}">View Screenshot</a></p>
  `;
};

export const generateInquiryEmailHtml = (data: any) => {
  return `
    <h2>New Customer Inquiry</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>Country:</strong> ${data.country}</p>
    <p><strong>Preferred Contact Method:</strong> ${data.preferredContactMethod}</p>
    <p><strong>Subject:</strong> ${data.subject}</p>
    <p><strong>Question:</strong> ${data.question}</p>
  `;
};