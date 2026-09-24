import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';

export const dynamic = 'force-dynamic';

function getResendClient() {
  const apiKey = process.env.RESEND_API_KEY || 're_mock_placeholder_key';
  return new Resend(apiKey);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, company, role, inquiry, message } = body;

    // Validation
    if (!firstName || !lastName || !email || !role || !inquiry || !message) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    // Send to internal team
    if (!process.env.RESEND_API_KEY) {
      console.log('RESEND_API_KEY not configured. Simulating email dispatch for:', { email, inquiry });
      return NextResponse.json({ success: true, id: 'simulated_' + Date.now(), simulated: true });
    }

    const resend = getResendClient();
    const { data, error } = await resend.emails.send({
      from: 'Ambrosia Contact <contact@ambrosia.example>',
      to: ['hello@ambrosia.example'],
      subject: `New Contact: ${inquiry} - ${firstName} ${lastName}`,
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fbcfe8 0%, #0b8a78 100%); padding: 24px; border-radius: 12px 12px 0 0;">
            <h1 style="margin: 0; color: #011411; font-size: 24px;">New Contact Form Submission</h1>
          </div>
          <div style="background: #011411; padding: 24px; border-radius: 0 0 12px 12px; color: white;">
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #fbcfe8; font-weight: 600;">Name</td>
                <td style="padding: 8px 0;">${firstName} ${lastName}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #fbcfe8; font-weight: 600;">Email</td>
                <td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #fbcfe8;">${email}</a></td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #fbcfe8; font-weight: 600;">Company</td>
                <td style="padding: 8px 0;">${company || 'Not provided'}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #fbcfe8; font-weight: 600;">Role</td>
                <td style="padding: 8px 0;">${role}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #fbcfe8; font-weight: 600;">Inquiry Type</td>
                <td style="padding: 8px 0;">${inquiry}</td>
              </tr>
            </table>
            <div style="margin-top: 24px; padding: 16px; background: rgba(251,207,232,0.1); border-radius: 8px;">
              <p style="margin: 0 0 8px; color: #fbcfe8; font-weight: 600;">Message</p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
          </div>
        </div>
      `,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json({ error: 'Failed to send email' }, { status: 500 });
    }

    // Send confirmation to user
    await resend.emails.send({
      from: 'Ambrosia <hello@ambrosia.example>',
      to: [email],
      subject: 'Thanks for contacting Ambrosia! 🍹',
      html: `
        <div style="font-family: system-ui, sans-serif; max-width: 600px; margin: 0 auto;">
          <div style="background: linear-gradient(135deg, #fbcfe8 0%, #0b8a78 100%); padding: 32px; border-radius: 12px 12px 0 0; text-align: center;">
            <h1 style="margin: 0 0 8px; color: #011411; font-size: 28px;">Thanks for reaching out, ${firstName}!</h1>
            <p style="margin: 0; color: #011411; opacity: 0.8;">We received your message and will reply within 2 hours.</p>
          </div>
          <div style="background: #011411; padding: 32px; border-radius: 0 0 12px 12px; color: white;">
            <p style="margin: 0 0 16px;">Your inquiry about <strong style="color: #fbcfe8;">${inquiry}</strong> has been forwarded to our team.</p>
            <div style="background: rgba(251,207,232,0.1); padding: 16px; border-radius: 8px; margin-bottom: 24px;">
              <p style="margin: 0 0 8px; color: #fbcfe8; font-weight: 600;">Your message:</p>
              <p style="margin: 0; white-space: pre-wrap;">${message}</p>
            </div>
            <p style="margin: 0 0 16px;">While you wait, you might want to:</p>
            <ul style="margin: 0 0 24px; padding-left: 20px;">
              <li style="margin: 8px 0;"><a href="https://ambrosia.example/formulate" style="color: #fbcfe8;">Try Dr Bevis</a> — our AI formulation agent</li>
              <li style="margin: 8px 0;"><a href="https://ambrosia.example/ingredients" style="color: #fbcfe8;">Explore our ingredient database</a> — 29+ curated ingredients</li>
              <li style="margin: 8px 0;"><a href="https://ambrosia.example/shop" style="color: #fbcfe8;">Shop Ambrosia</a> — zero-sugar beverages delivered</li>
            </ul>
            <hr style="border-color: rgba(255,255,255,0.1); margin: 24px 0;">
            <p style="margin: 0; color: rgba(255,255,255,0.5); font-size: 14px;">Ambrosia — Better for You, Better for the Planet</p>
          </div>
        </div>
      `,
    });

    return NextResponse.json({ success: true, id: data?.id });
  } catch (err) {
    console.error('Contact API error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}