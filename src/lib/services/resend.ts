import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('RESEND_API_KEY is not defined - email notifications will not work')
}

export const resend = new Resend(process.env.RESEND_API_KEY || 'dummy-key')

export async function sendOrderConfirmation({
  to,
  orderNumber,
  total,
  items,
}: {
  to: string
  orderNumber: string
  total: number
  items: Array<{ name: string; quantity: number; price: number }>
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email would be sent:', { to, orderNumber })
    return { data: null, error: null }
  }

  return await resend.emails.send({
    from: 'WeddingHub <orders@weddinghub.com>',
    to,
    subject: `Order Confirmation #${orderNumber}`,
    html: `
      <h1>Thank you for your order!</h1>
      <p>Order #${orderNumber}</p>
      <h2>Order Details</h2>
      <ul>
        ${items.map(item => `<li>${item.name} x${item.quantity} - $${item.price.toFixed(2)}</li>`).join('')}
      </ul>
      <p><strong>Total: $${total.toFixed(2)}</strong></p>
    `,
  })
}

export async function sendInquiryNotification({
  to,
  inquiryId,
  customerName,
  products,
}: {
  to: string
  inquiryId: string
  customerName: string
  products: Array<{ name: string; quantity: number }>
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email would be sent:', { to, inquiryId })
    return { data: null, error: null }
  }

  return await resend.emails.send({
    from: 'WeddingHub <inquiries@weddinghub.com>',
    to,
    subject: 'New Inquiry Received',
    html: `
      <h1>New Inquiry from ${customerName}</h1>
      <p>Inquiry ID: ${inquiryId}</p>
      <h2>Requested Products</h2>
      <ul>
        ${products.map(p => `<li>${p.name} x${p.quantity}</li>`).join('')}
      </ul>
      <p>Log in to your dashboard to view and respond.</p>
    `,
  })
}

export async function sendVendorLeadNotification({
  to,
  vendorName,
  inquiryId,
  customerName,
  customerEmail,
  customerPhone,
  eventDate,
  venueName,
  venueLocation,
  guestCount,
  products,
  customerNotes,
}: {
  to: string
  vendorName: string
  inquiryId: string
  customerName: string
  customerEmail: string
  customerPhone?: string
  eventDate?: string
  venueName?: string
  venueLocation?: string
  guestCount?: number
  products: Array<{ name: string; quantity: number; price: number; notes?: string }>
  customerNotes?: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Vendor lead email would be sent:', { to, inquiryId })
    return { data: null, error: null }
  }

  const totalValue = products.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return await resend.emails.send({
    from: 'WeddingHub <leads@weddinghub.com>',
    to,
    subject: `New Quote Request - ${customerName}`,
    html: `
      <h1>New Quote Request</h1>
      <p>Hi ${vendorName},</p>
      <p>You have a new quote request from a customer!</p>

      <h2>Customer Information</h2>
      <ul>
        <li><strong>Name:</strong> ${customerName}</li>
        <li><strong>Email:</strong> ${customerEmail}</li>
        ${customerPhone ? `<li><strong>Phone:</strong> ${customerPhone}</li>` : ''}
      </ul>

      <h2>Event Details</h2>
      <ul>
        ${eventDate ? `<li><strong>Date:</strong> ${eventDate}</li>` : ''}
        ${venueName ? `<li><strong>Venue:</strong> ${venueName}</li>` : ''}
        ${venueLocation ? `<li><strong>Location:</strong> ${venueLocation}</li>` : ''}
        ${guestCount ? `<li><strong>Guest Count:</strong> ${guestCount}</li>` : ''}
      </ul>

      <h2>Requested Items</h2>
      <ul>
        ${products.map(p => `
          <li>
            <strong>${p.name}</strong> x${p.quantity} - $${p.price.toFixed(2)} each
            ${p.notes ? `<br><em>Notes: ${p.notes}</em>` : ''}
          </li>
        `).join('')}
      </ul>
      <p><strong>Estimated Total:</strong> $${totalValue.toFixed(2)}</p>

      ${customerNotes ? `
        <h2>Additional Notes</h2>
        <p>${customerNotes}</p>
      ` : ''}

      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/inquiries/${inquiryId}">View in Dashboard & Respond</a></p>

      <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
      <p style="font-size: 12px; color: #666;">This is a qualified lead. Please respond within 24-48 hours for best results.</p>
    `,
  })
}

export async function sendCustomerInquiryConfirmation({
  to,
  customerName,
  inquiryId,
  rentalProducts,
  purchasableProducts,
  eventDate,
  vendorNames,
}: {
  to: string
  customerName: string
  inquiryId: string
  rentalProducts: Array<{ name: string; quantity: number; price: number }>
  purchasableProducts: Array<{ name: string; quantity: number; affiliate_url?: string }>
  eventDate?: string
  vendorNames: string[]
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Customer confirmation email would be sent:', { to, inquiryId })
    return { data: null, error: null }
  }

  const totalRentalValue = rentalProducts.reduce((sum, p) => sum + p.price * p.quantity, 0)

  return await resend.emails.send({
    from: 'WeddingHub <hello@weddinghub.com>',
    to,
    subject: 'Your Quote Request Has Been Sent',
    html: `
      <h1>Quote Request Confirmed</h1>
      <p>Hi ${customerName},</p>
      <p>We've sent your quote request to ${vendorNames.length === 1 ? vendorNames[0] : `${vendorNames.length} vendors`}. You should receive quotes within 24-48 hours.</p>

      ${eventDate ? `<p><strong>Event Date:</strong> ${eventDate}</p>` : ''}

      <h2>Rental Items (Quote Requested)</h2>
      <ul>
        ${rentalProducts.map(p => `<li>${p.name} x${p.quantity} - $${p.price.toFixed(2)} per event</li>`).join('')}
      </ul>
      <p><strong>Estimated Total:</strong> $${totalRentalValue.toFixed(2)}</p>
      <p><em>Vendors will provide final pricing.</em></p>

      ${purchasableProducts.length > 0 ? `
        <h2>Items to Purchase</h2>
        <p>Don't forget about these items you saved! Click the links below to purchase:</p>
        <ul>
          ${purchasableProducts.map(p => `
            <li>
              ${p.name} x${p.quantity}
              ${p.affiliate_url ? ` - <a href="${p.affiliate_url}">Buy Now</a>` : ''}
            </li>
          `).join('')}
        </ul>
      ` : ''}

      <h2>What's Next?</h2>
      <ol>
        <li>Vendors will review your request and send quotes via email</li>
        <li>Compare quotes and vendor ratings</li>
        <li>Work directly with vendors to finalize your booking</li>
      </ol>

      <p>Reference ID: ${inquiryId}</p>

      <p>Questions? Reply to this email and we'll help!</p>
    `,
  })
}

export async function sendVendorApproval({
  to,
  vendorName,
}: {
  to: string
  vendorName: string
}) {
  if (!process.env.RESEND_API_KEY) {
    console.log('Email would be sent:', { to, vendorName })
    return { data: null, error: null }
  }

  return await resend.emails.send({
    from: 'WeddingHub <hello@weddinghub.com>',
    to,
    subject: 'Your Vendor Account Has Been Approved!',
    html: `
      <h1>Welcome to WeddingHub, ${vendorName}!</h1>
      <p>Your vendor account has been approved. You can now start adding products.</p>
      <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/vendor/dashboard">Go to Dashboard</a></p>
    `,
  })
}
