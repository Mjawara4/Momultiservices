export const generateShippingEmailHtml = (data: any) => {
  return `
    <h2>New Shipping Request</h2>
    <p><strong>Name:</strong> ${data.name}</p>
    <p><strong>Phone:</strong> ${data.phone}</p>
    <p><strong>From:</strong> ${data.from_location}</p>
    <p><strong>To:</strong> ${data.to_location}</p>
    <p><strong>Weight:</strong> ${data.weight} lbs</p>
    <p><strong>Package Type:</strong> ${data.package_type}</p>
    <p><strong>Original Price:</strong> $${data.original_price}</p>
    ${data.discount_applied ? `
    <p><strong>Discount Code Used:</strong> ${data.discount_code}</p>
    <p><strong>Discount Applied:</strong> ${data.discount_applied}</p>
    ` : ''}
    <p><strong>Final Price:</strong> $${data.estimated_price}</p>
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