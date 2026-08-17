import type { EmailDeliveryResult, EmailMessage, EmailPort } from '@burgoweb/application';

export class MailpitEmailPort implements EmailPort {
  constructor(private readonly options: { endpoint: string; from: string; fetch?: typeof fetch }) {}
  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    try {
      const response = await (this.options.fetch ?? fetch)(this.options.endpoint, {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ From: { Email: this.options.from, Name: 'Burgoweb' }, To: [{ Email: message.to }], Subject: message.subject, Text: message.text, HTML: message.html, Headers: { 'X-Idempotency-Key': message.idempotencyKey }, Tags: ['email-verification'] }),
      });
      if (response.ok) return { kind: 'accepted', providerReference: `mailpit-${message.idempotencyKey}` };
      return response.status >= 500 ? { kind: 'transient', code: `mailpit-${response.status}` } : { kind: 'permanent', code: `mailpit-${response.status}` };
    } catch { return { kind: 'ambiguous', code: 'mailpit-network' }; }
  }
}
