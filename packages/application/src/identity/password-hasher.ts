export interface PasswordHash {
  encodedHash: string;
  pepperVersion: string;
}

export interface PasswordHasher {
  hash(password: string): Promise<PasswordHash>;
  verify(hash: PasswordHash, password: string): Promise<{ valid: boolean; needsRehash: boolean }>;
}
