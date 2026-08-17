import { createHash } from 'node:crypto';
import type { CreateCondominiumCommand } from './contracts.js';

export function canonicalRequestHash(command: CreateCondominiumCommand): string {
  const canonical = JSON.stringify({
    account: { email: command.account.email.trim().toLowerCase() },
    authorityDeclarationAccepted: command.authorityDeclarationAccepted,
    condominium: { displayName: command.condominium.displayName.trim() },
    password: command.password,
    person: { fullName: command.person.fullName.trim() },
  });
  return createHash('sha256').update(canonical).digest('hex');
}
