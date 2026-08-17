import type { EmailDeliveryResult, EmailMessage, EmailPort } from '@burgoweb/application';

type Provider = { name: 'brevo' | 'resend'; endpoint: string; apiKey: string };

export class HttpEmailPort implements EmailPort {
  constructor(private readonly options: { from: string; primary: Provider; fallback?: Provider; timeoutMs?: number; fetch?: typeof fetch }) {}

  async send(message: EmailMessage): Promise<EmailDeliveryResult> {
    const primary = await this.sendTo(this.options.primary, message);
    if (primary.kind !== 'transient' || !this.options.fallback) return primary;
    return this.sendTo(this.options.fallback, message);
  }

  private async sendTo(provider: Provider, message: EmailMessage): Promise<EmailDeliveryResult> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), this.options.timeoutMs ?? 10_000);
    try {
      const isBrevo = provider.name === 'brevo';
      const body = isBrevo
        ? { sender: { email: this.options.from }, to: [{ email: message.to }], subject: message.subject, textContent: message.text, htmlContent: message.html, headers: { 'X-Mailin-custom': `idempotency:${message.idempotencyKey}` }, params: {}, tags: ['email-verification'] }
        : { from: this.options.from, to: [message.to], subject: message.subject, text: message.text, html: message.html, headers: { 'X-Entity-Ref-ID': message.idempotencyKey } };
      const response = await (this.options.fetch ?? fetch)(provider.endpoint, { method: 'POST', signal: controller.signal, headers: { 'content-type': 'application/json', ...(isBrevo ? { 'api-key': provider.apiKey } : { authorization: `Bearer ${provider.apiKey}`, 'Idempotency-Key': message.idempotencyKey }) }, body: JSON.stringify(body) });
      if (response.ok) {
        const payload = await response.json().catch(() => ({})) as { messageId?: string; id?: string };
        return { kind: 'accepted', providerReference: String(payload.messageId ?? payload.id ?? 'accepted').slice(0, 120) };
      }
      if (response.status === 408 || response.status === 429 || response.status >= 500) return { kind: 'transient', code: `${provider.name}-${response.status}` };
      return { kind: 'permanent', code: `${provider.name}-${response.status}` };
    } catch (error) {
      return { kind: 'ambiguous', code: error instanceof Error && error.name === 'AbortError' ? `${provider.name}-timeout` : `${provider.name}-network` };
    } finally { clearTimeout(timeout); }
  }
}
