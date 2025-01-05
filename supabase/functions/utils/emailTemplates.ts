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

export const generateShippingEmailHtml = (data: ShippingData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .price { color: #2b6cb0; font-size: 1.2em; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>🚚 New Shipping Request</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${data.name}
          </div>
          <div class="field">
            <span class="label">Phone:</span> ${data.phone}
          </div>
          <div class="field">
            <span class="label">From:</span> ${data.from_location}
          </div>
          <div class="field">
            <span class="label">To:</span> ${data.to_location}
          </div>
          <div class="field">
            <span class="label">Weight:</span> ${data.weight} lbs
          </div>
          <div class="field">
            <span class="label">Package Type:</span> ${data.package_type}
          </div>
          <div class="field price">
            <span class="label">Estimated Price:</span> $${data.estimated_price}
          </div>
        </div>
      </div>
    </body>
  </html>
`;

export const generateInquiryEmailHtml = (data: InquiryData) => `
  <!DOCTYPE html>
  <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #f4f4f4; padding: 20px; text-align: center; }
        .content { padding: 20px; }
        .field { margin-bottom: 10px; }
        .label { font-weight: bold; }
        .question { background: #f9f9f9; padding: 15px; margin: 10px 0; }
      </style>
    </head>
    <body>
      <div class="container">
        <div class="header">
          <h2>❓ New Customer Inquiry</h2>
        </div>
        <div class="content">
          <div class="field">
            <span class="label">Name:</span> ${data.name}
          </div>
          <div class="field">
            <span class="label">Phone:</span> ${data.phone}
          </div>
          <div class="field">
            <span class="label">Subject:</span> ${data.subject}
          </div>
          <div class="field">
            <span class="label">Country:</span> ${data.country}
          </div>
          <div class="field">
            <span class="label">Preferred Contact Method:</span> ${data.preferredContactMethod}
          </div>
          <div class="question">
            <span class="label">Question:</span><br>
            ${data.question}
          </div>
        </div>
      </div>
    </body>
  </html>
`;