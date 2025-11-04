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
