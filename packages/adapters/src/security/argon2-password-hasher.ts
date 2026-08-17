import argon2 from 'argon2';
import type { PasswordHash, PasswordHasher } from '@burgoweb/application';

const NEUTRAL_HASH = '$argon2id$v=19$m=19456,t=2,p=1$vp3vpaI9woVWonL3RY04UQ$gJM0SaTVrRLPNHe+gji0xe3Ou8Q5eY8nia2QbrINwzI';

export class Argon2PasswordHasher implements PasswordHasher {
  constructor(private readonly config: { pepper: string; pepperVersion: string; previousPeppers?: Record<string, string> }) {}
  async hash(password: string): Promise<PasswordHash> {
    return { encodedHash: await argon2.hash(`${password}\u0000${this.config.pepper}`, { type: argon2.argon2id, memoryCost: 19_456, timeCost: 2, parallelism: 1 }), pepperVersion: this.config.pepperVersion };
  }
  async verify(hash: PasswordHash, password: string): Promise<{ valid: boolean; needsRehash: boolean }> {
    const pepper = hash.pepperVersion === this.config.pepperVersion ? this.config.pepper : this.config.previousPeppers?.[hash.pepperVersion];
    if (!pepper) { await argon2.verify(NEUTRAL_HASH, `${password}\u0000${this.config.pepper}`).catch(() => false); return { valid: false, needsRehash: false }; }
    try { return { valid: await argon2.verify(hash.encodedHash, `${password}\u0000${pepper}`), needsRehash: hash.pepperVersion !== this.config.pepperVersion }; }
    catch { await argon2.verify(NEUTRAL_HASH, `${password}\u0000${this.config.pepper}`).catch(() => false); return { valid: false, needsRehash: false }; }
  }
}
