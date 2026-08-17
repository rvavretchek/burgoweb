import { describe, expect, it } from 'vitest';
import { landingContent } from './landing';

describe('conteúdo institucional da landing', () => {
  const copy = Object.values(landingContent).join(' ').toLocaleLowerCase('pt-BR');

  it('comunica gratuidade, organização e transparência', () => {
    expect(copy).toContain('gratuit');
    expect(copy).toContain('organiza');
    expect(copy).toContain('transpar');
    expect(landingContent.cta).toBe('Utilize gratuitamente');
  });

  it.each(['erp completo', 'boleto', 'pix', 'certificação jurídica', 'teste grátis'])('não faz a alegação proibida %s', (claim) => {
    expect(copy).not.toContain(claim);
  });
});
