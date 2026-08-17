import type { ClaimedVerificationEmail, ConfirmEmailResult, PendingVerificationRecord, ResendVerificationCommand, VerificationTokenContext } from './contracts.js';

export interface VerificationTokenCodec {
  derive(context: VerificationTokenContext): string;
  hash(token: string): string;
  matches(token: string, expectedHash: string): boolean;
}

export interface EmailMessage {
  to: string;
  subject: string;
  text: string;
  html: string;
  idempotencyKey: string;
}

export type EmailDeliveryResult =
  | { kind: 'accepted'; providerReference: string }
  | { kind: 'transient'; code: string }
  | { kind: 'permanent'; code: string }
  | { kind: 'ambiguous'; code: string };

export interface EmailPort { send(message: EmailMessage): Promise<EmailDeliveryResult> }

export interface VerificationRepository {
  reissue(command: ResendVerificationCommand, issue: (target: { accountId: string; requestId: string }) => PendingVerificationRecord): Promise<boolean>;
  confirm(tokenHash: string, now: Date): Promise<ConfirmEmailResult | undefined>;
}

export interface VerificationOutboxRepository {
  claim(owner: string, now: Date, leaseSeconds: number): Promise<ClaimedVerificationEmail | undefined>;
  renew(item: ClaimedVerificationEmail, now: Date, leaseSeconds: number): Promise<boolean>;
  finish(item: ClaimedVerificationEmail, result: EmailDeliveryResult, now: Date, nextAttemptAt?: Date): Promise<void>;
}

export interface PublicMutationRateLimiter { consume(operation: string, signals: string[], now: Date, limit: number, windowSeconds: number): Promise<boolean> }
