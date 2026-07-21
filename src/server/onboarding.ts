import { randomBytes } from 'node:crypto';
import argon2 from 'argon2';
import { z } from 'zod';

export const onboardingSchema = z.object({
  email: z.string().email(),
  displayName: z.string().min(2),
  profileType: z.enum(['only-syndic', 'only-resident', 'resident-owner', 'resident-owner-syndic']),
  condominiumName: z.string().min(2),
  city: z.string().optional(),
});

export type OnboardingPayload = z.infer<typeof onboardingSchema>;

export interface StoredUser {
  id: string;
  email: string;
  displayName: string;
  passwordHash: string;
  profileType: OnboardingPayload['profileType'];
  role: 'admin' | 'member';
  condominiumId: string;
}

export interface StoredCondominium {
  id: string;
  name: string;
  city?: string;
}

export interface OnboardingResult {
  success: boolean;
  userId: string;
  condominiumId: string;
  temporaryPassword: string;
  inviteEmailSent: boolean;
  suggestedName?: string;
  createdAt: string;
}

export function buildUniqueCondominiumName(baseName: string, city?: string, existingNames: string[] = []): string {
  const normalizedBase = baseName.trim();
  if (!normalizedBase) {
    return '';
  }

  const existingNormalized = existingNames.map((name) => name.trim().toLowerCase());
  const baseExists = existingNormalized.includes(normalizedBase.trim().toLowerCase());

  if (!baseExists) {
    return normalizedBase;
  }

  const suffix = city?.trim() ? `-${city.trim()}` : '-novo';
  return `${normalizedBase}${suffix}`;
}

export function generateTemporaryPassword(): string {
  return randomBytes(5).toString('hex');
}

export async function createOnboardingRecord(payload: OnboardingPayload, existingUsers: StoredUser[], existingCondominiums: StoredCondominium[]): Promise<OnboardingResult> {
  const existingNames = existingCondominiums.map((condominium) => condominium.name);
  const condominiumName = buildUniqueCondominiumName(payload.condominiumName, payload.city, existingNames);
  const password = generateTemporaryPassword();
  const passwordHash = await argon2.hash(password);
  const condominiumId = `condo-${randomBytes(3).toString('hex')}`;
  const userId = `user-${randomBytes(3).toString('hex')}`;

  const user: StoredUser = {
    id: userId,
    email: payload.email,
    displayName: payload.displayName,
    passwordHash,
    profileType: payload.profileType,
    role: 'admin',
    condominiumId,
  };

  const condominium: StoredCondominium = {
    id: condominiumId,
    name: condominiumName,
    city: payload.city,
  };

  existingCondominiums.push(condominium);
  existingUsers.push(user);

  return {
    success: true,
    userId,
    condominiumId,
    temporaryPassword: password,
    inviteEmailSent: true,
    suggestedName: condominiumName,
    createdAt: new Date().toISOString(),
  };
}

export async function verifyPassword(passwordHash: string, password: string): Promise<boolean> {
  return argon2.verify(passwordHash, password);
}

export interface InviteUserInput {
  email: string;
  displayName?: string;
  role?: 'admin' | 'member';
  condominiumId: string;
}

export async function inviteUser(input: InviteUserInput, existingUsers: StoredUser[]): Promise<OnboardingResult> {
  const password = generateTemporaryPassword();
  const passwordHash = await argon2.hash(password);
  const userId = `user-${randomBytes(3).toString('hex')}`;

  const user: StoredUser = {
    id: userId,
    email: input.email,
    displayName: input.displayName ?? input.email.split('@')[0],
    passwordHash,
    profileType: 'only-resident',
    role: input.role ?? 'member',
    condominiumId: input.condominiumId,
  };

  existingUsers.push(user);

  return {
    success: true,
    userId,
    condominiumId: input.condominiumId,
    temporaryPassword: password,
    inviteEmailSent: true,
    suggestedName: undefined,
    createdAt: new Date().toISOString(),
  };
}
