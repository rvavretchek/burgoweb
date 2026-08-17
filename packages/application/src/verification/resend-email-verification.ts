import type { ResendVerificationCommand, ResendVerificationResult } from './contracts.js';
import type { VerificationRepository } from './ports.js';
import type { VerificationTokenIssuer } from './verification-token-issuer.js';

const NEUTRAL_RESULT: ResendVerificationResult = { state: 'pending', message: 'Se houver uma solicitação elegível, uma nova verificação será preparada.' };

export class ResendEmailVerification {
  constructor(private readonly deps: { repository: VerificationRepository; issuer: VerificationTokenIssuer }) {}
  async execute(command: ResendVerificationCommand): Promise<ResendVerificationResult> {
    if (!command.requestId.trim() || !/^\S+@\S+\.\S+$/.test(command.email.trim())) return NEUTRAL_RESULT;
    await this.deps.repository.reissue({ requestId: command.requestId.trim(), email: command.email.trim().toLowerCase() }, target => this.deps.issuer.issue(target));
    return NEUTRAL_RESULT;
  }
}

