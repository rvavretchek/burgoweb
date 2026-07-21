import { describe, expect, it } from 'vitest';
import { buildUniqueCondominiumName } from './onboarding.js';

describe('buildUniqueCondominiumName', () => {
  it('returns a city-suffixed name when the base name already exists', () => {
    const existing = ['Camélias', 'Camélias-Bauru'];
    const result = buildUniqueCondominiumName('Camélias', 'Bauru', existing);

    expect(result).toBe('Camélias-Bauru');
  });

  it('keeps the base name when it is still available', () => {
    const result = buildUniqueCondominiumName('Residencial Verde', 'São Paulo', []);

    expect(result).toBe('Residencial Verde');
  });
});
