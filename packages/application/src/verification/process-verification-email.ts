import type { EmailPort, VerificationOutboxRepository, VerificationTokenCodec } from './ports.js';

function escapeHtml(value: string): string { return value.replace(/[&<>"']/g, char => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[char]!); }

export class ProcessVerificationEmail {
  constructor(private readonly dependencies: { repository: VerificationOutboxRepository; email: EmailPort; codec: VerificationTokenCodec; baseUrl: string; leaseSeconds: number; maxAttempts: number; owner: string; now?: () => Date }) {}

  async execute(): Promise<boolean> {
    const now = (this.dependencies.now ?? (() => new Date()))();
    const item = await this.dependencies.repository.claim(this.dependencies.owner, now, this.dependencies.leaseSeconds);
    if (!item) return false;
    let token: string;
    try { token = this.dependencies.codec.derive(item); }
    catch {
      await this.dependencies.repository.finish(item, { kind: 'permanent', code: 'key-version-unavailable' }, now);
      return true;
    }
    if (!this.dependencies.codec.matches(token, item.tokenHash)) {
      await this.dependencies.repository.finish(item, { kind: 'permanent', code: 'token-integrity' }, now);
      return true;
    }
    const link = `${this.dependencies.baseUrl}/verificar-email#token=${encodeURIComponent(token)}`;
    const expiry = item.expiresAt.toISOString();
    const renewal = setInterval(() => { void this.dependencies.repository.renew(item, new Date(), this.dependencies.leaseSeconds); }, Math.max(1000, this.dependencies.leaseSeconds * 500));
    let result;
    try { result = await this.dependencies.email.send({
      to: item.to,
      subject: 'Confirme seu e-mail no Burgoweb',
      text: `Burgoweb\n\nConfirme que você controla este endereço de e-mail para concluir a ativação. O link expira em ${expiry}.\n\n${link}`,
      html: `<p><strong>Burgoweb</strong></p><p>Confirme que você controla este endereço de e-mail para concluir a ativação.</p><p>O link expira em <time>${escapeHtml(expiry)}</time>.</p><p><a href="${escapeHtml(link)}">Confirmar meu e-mail</a></p>`,
      idempotencyKey: item.outboxId,
    }); } finally { clearInterval(renewal); }
    const retry = result.kind === 'transient' && item.attemptNumber < this.dependencies.maxAttempts ? new Date(now.getTime() + Math.min(300_000, 2 ** item.attemptNumber * 1_000)) : undefined;
    await this.dependencies.repository.finish(item, result, (this.dependencies.now ?? (() => new Date()))(), retry);
    return true;
  }
}
