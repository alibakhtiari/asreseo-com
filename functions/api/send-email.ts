// Contact/consultation form endpoint (Cloudflare Pages Function).
// Sends via the native Cloudflare Email Sending binding (no third party).
// Required setup (dashboard, once):
//   1. Compute → Email Service → onboard asreseo.com (applies SPF/DKIM/DMARC).
//   2. Pages project → Settings → Functions → Bindings → send_email named EMAIL.
//   3. wrangler.toml already declares: send_email = [{ name = "EMAIL" }].

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

interface EmailEnv { EMAIL: EmailBinding }

const INBOX = 'info@asreseo.com';
const FROM = 'website@asreseo.com';

export const onRequestPost = async (context: { request: Request; env: EmailEnv }) => {
    const { request, env } = context;

    try {
        const formData = await request.formData();
        const name = formData.get('name') as string;
        const email = formData.get('email') as string;
        const phone = formData.get('phone') as string;
        const service = formData.get('service') as string;
        const message = formData.get('message') as string;

        if (!name || !email || !message) {
            return new Response(JSON.stringify({ error: 'لطفاً تمام فیلدهای اجباری را پر کنید.' }), {
                status: 400,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        if (!env.EMAIL) {
            return new Response(JSON.stringify({ error: 'سرویس ایمیل پیکربندی نشده است.' }), {
                status: 500,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        await env.EMAIL.send({
            from: FROM,
            to: INBOX,
            subject: `New Contact Form Submission from ${name}`,
            replyTo: email,
            text: `
    Name: ${name}
    Email: ${email}
    Phone: ${phone}
    Service: ${service}
    Message: ${message}
  `,
            html: `
    <h1>New Contact Form Submission</h1>
    <p><strong>Name:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Phone:</strong> ${phone}</p>
    <p><strong>Service:</strong> ${service}</p>
    <p><strong>Message:</strong></p>
    <p>${message}</p>
  `
        });

        return new Response(JSON.stringify({ success: true }), {
            status: 200,
            headers: { 'Content-Type': 'application/json' }
        });

    } catch (error) {
        return new Response(JSON.stringify({ error: (error instanceof Error) ? error.message : 'خطای ناشناخته' }), {
            status: 500,
            headers: { 'Content-Type': 'application/json' }
        });
    }
}
