export type VerificationPurpose = 'email-verification';
export type VerificationTokenState = 'valid' | 'used' | 'cancelled' | 'expired';
export type EmailDeliveryState = 'pending' | 'leased' | 'accepted' | 'dead' | 'ambiguous';
export type EmailAttemptState = 'started' | 'accepted' | 'failed' | 'ambiguous';

export interface VerificationTokenContext {
  verificationId: string;
  outboxId: string;
  accountId: string;
  requestId: string;
  issuedAt: Date;
  purpose: VerificationPurpose;
  keyVersion: string;
}

export interface ConfirmEmailCommand { token: string }
export interface ConfirmEmailResult { state: 'activated'; message: string }
export interface ResendVerificationCommand { requestId: string; email: string }
export interface ResendVerificationResult { state: 'pending'; message: string }

export interface PendingVerificationRecord extends VerificationTokenContext {
  tokenHash: string;
  expiresAt: Date;
}

export class VerificationUnavailable extends Error {}

export interface ClaimedVerificationEmail extends VerificationTokenContext {
  tokenHash: string;
  expiresAt: Date;
  to: string;
  attemptNumber: number;
  leaseOwner: string;
}
