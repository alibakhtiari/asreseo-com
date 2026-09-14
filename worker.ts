import { onRequestPost } from './functions/api/send-email';

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

export interface Env {
  ASSETS: {
    fetch: (request: Request | string) => Promise<Response>;
  };
  asreseo?: EmailBinding;
  EMAIL?: EmailBinding;
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);

    if (url.pathname === '/api/send-email') {
      if (request.method === 'POST') {
        return onRequestPost({ request, env });
      }
      return new Response(JSON.stringify({ error: 'Method Not Allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
      });
    }

    return env.ASSETS.fetch(request);
  },
};
