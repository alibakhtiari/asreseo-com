// Contact/consultation form endpoint (Cloudflare Pages Function).
// Sends via the native Cloudflare Email Sending binding (no third party).
//
// Required setup in the Cloudflare dashboard (ONE TIME, not done by wrangler):
//   1. Compute → Email Service → onboard asreseo.com (applies SPF/DKIM/DMARC).
//   2. Verify the sender address `website@asreseo.com`.
//   3. Pages project → Settings → Functions → Bindings → send_email named EMAIL.
//
// wrangler.toml declares `send_email = [{ name = "EMAIL" }]` for documentation.
// That stanza does NOT attach the binding — `wrangler pages deploy` exposes no
// binding flags, so step 3 must be done in the dashboard or the endpoint
// returns 503.

interface EmailBinding {
  send(message: {
    from: string;
    to: string;
    subject: string;
    replyTo?: string;
    text?: string;
    html?: string;
  }): Promise<unknown>;
}

interface EmailEnv {
  asreseo?: EmailBinding;
  EMAIL?: EmailBinding;
}

const INBOX = 'info@asreseo.com';
const FROM = 'website@asreseo.com';

/** Hosts allowed to POST here. Same-origin only, plus local dev. */
const ALLOWED_ORIGINS = new Set([
  'https://asreseo.com',
  'https://www.asreseo.com',
  'http://localhost:4321',
  'http://localhost:4322',
  'http://127.0.0.1:4321',
]);

/** Hard caps so a crafted submission cannot blow up the send. */
const MAX = { name: 100, email: 120, phone: 32, service: 80, message: 4000 };

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Escape for interpolation into the HTML email body. */
const esc = (v: string) =>
  v.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#39;');

const str = (v: FormDataEntryValue | null, max: number) =>
  (typeof v === 'string' ? v : '').trim().slice(0, max);

const json = (body: unknown, status: number) =>
  new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json; charset=utf-8' },
  });

export const onRequestPost = async (context: { request: Request; env: EmailEnv }) => {
  const { request, env } = context;

  try {
    // Reject cross-site POSTs. Browsers always send Origin on fetch POST.
    const origin = request.headers.get('Origin');
    if (origin && !ALLOWED_ORIGINS.has(origin)) {
      return json({ error: 'Origin not allowed.' }, 403);
    }

    const formData = await request.formData();
    const name = str(formData.get('name'), MAX.name);
    const email = str(formData.get('email'), MAX.email);
    const phone = str(formData.get('phone'), MAX.phone);
    const service = str(formData.get('service'), MAX.service);
    const message = str(formData.get('message'), MAX.message);

    // Server-side validation — the client checks these too, but never trust it.
    if (!name || !email || !message) {
      return json({ error: 'Name, email, and message are required.' }, 400);
    }
    if (!EMAIL_RE.test(email)) {
      return json({ error: 'Invalid email address format.' }, 400);
    }
    // Phone validation (optional field, allows standard international formats).
    if (phone && !/^\+?[\d\s\-().]{7,25}$/.test(phone.trim())) {
      return json({ error: 'Please enter a valid phone number.' }, 400);
    }
    if (message.length < 10) {
      return json({ error: 'Please provide a brief explanation (at least 10 characters).' }, 400);
    }

    const emailBinding = env?.asreseo || env?.EMAIL;

    if (!emailBinding) {
      // Binding is missing — see the setup comment at the top of this file.
      console.error('[send-email] Neither "asreseo" nor "EMAIL" binding is attached to this Pages project.');
      return json({ error: 'Email service is not configured.' }, 503);
    }

    const ip = request.headers.get('CF-Connecting-IP') || 'unknown';
    const ua = request.headers.get('User-Agent') || 'unknown';

    await emailBinding.send({
      from: FROM,
      to: INBOX,
      subject: `New inquiry from ${name} (${service || 'General Inquiry'})`,
      replyTo: email,
      text: [
        `Name: ${name}`,
        `Email: ${email}`,
        `Phone: ${phone || '-'}`,
        `Service: ${service || '-'}`,
        `IP: ${ip}`,
        '',
        'Message:',
        message,
      ].join('\n'),
      html: [
        '<div style="font-family:system-ui,Segoe UI,Helvetica,Arial,sans-serif;color:#111">',
        '<h2 style="margin:0 0 16px">New Website Inquiry</h2>',
        `<p><strong>Name:</strong> ${esc(name)}</p>`,
        `<p><strong>Email:</strong> ${esc(email)}</p>`,
        `<p><strong>Phone:</strong> ${esc(phone || '-')}</p>`,
        `<p><strong>Service:</strong> ${esc(service || '-')}</p>`,
        `<p><strong>IP:</strong> ${esc(ip)}</p>`,
        '<p><strong>Message:</strong></p>',
        `<p style="white-space:pre-wrap;background:#f5f5f5;padding:12px;border-radius:4px">${esc(message)}</p>`,
        `<hr style="border:none;border-top:1px solid #ddd;margin:20px 0"><p style="font-size:12px;color:#888">User-Agent: ${esc(ua.slice(0, 200))}</p>`,
        '</div>',
      ].join(''),
    });

    return json({ success: true }, 200);
  } catch (error) {
    // Log the real cause, but never echo it back to the browser.
    console.error('[send-email] failed:', error);
    return json({ error: 'Failed to send message. Please try again later.' }, 500);
  }
};
