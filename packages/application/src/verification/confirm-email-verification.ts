import { VerificationUnavailable, type ConfirmEmailCommand, type ConfirmEmailResult } from './contracts.js';
import type { VerificationRepository, VerificationTokenCodec } from './ports.js';

export class ConfirmEmailVerification {
  constructor(private readonly dependencies: { repository: VerificationRepository; codec: VerificationTokenCodec; now?: () => Date }) {}

  async execute(command: ConfirmEmailCommand): Promise<ConfirmEmailResult> {
    if (typeof command.token !== 'string' || !/^[A-Za-z0-9_-]{43}$/.test(command.token)) throw new VerificationUnavailable();
    const result = await this.dependencies.repository.confirm(this.dependencies.codec.hash(command.token), (this.dependencies.now ?? (() => new Date()))());
    if (!result) throw new VerificationUnavailable();
    return result;
  }
}
