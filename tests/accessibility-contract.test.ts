import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { describe, expect, it } from 'vitest';

const rootRoute = readFileSync(resolve('apps/web/src/routes/__root.tsx'), 'utf8');
const landing = readFileSync(resolve('apps/web/src/components/LandingPage.tsx'), 'utf8');
const styles = readFileSync(resolve('apps/web/src/styles.css'), 'utf8');
const verification = readFileSync(resolve('apps/web/src/components/EmailVerificationPage.tsx'), 'utf8');

describe('guardrails estáticos complementares de acessibilidade', () => {
  it('define idioma, skip link, conteúdo principal e um único h1 na landing', () => {
    expect(rootRoute).toContain('<html lang="pt-BR">');
    expect(rootRoute).toContain('Pular para o conteúdo');
    expect(landing).toContain('id="conteudo-principal"');
    expect(landing.match(/<h1\b/g)).toHaveLength(1);
  });

  it('mantém token apenas em memória, exige ação explícita e fornece recuperação acessível', () => {
    expect(verification).toContain('window.location.hash');
    expect(verification).toContain('window.history.replaceState');
    expect(verification).not.toMatch(/localStorage|sessionStorage\.setItem\([^\n]*(?:token|hash)/i);
    expect(verification).toContain("RECOVERY_KEY = 'burgoweb:verification-recovery'");
    expect(verification).toContain('Confirmar meu e-mail');
    expect(verification).toContain('aria-live="polite"');
    expect(verification).toContain('tabIndex={-1}');
    expect(verification).toContain('não certifica identidade civil');
  });

  it('oferece foco, movimento reduzido, forced colors e breakpoint móvel', () => {
    expect(styles).toContain(':focus-visible');
    expect(styles).toContain('prefers-reduced-motion: reduce');
    expect(styles).toContain('forced-colors: active');
    expect(styles).toContain('@media (max-width: 767px)');
    expect(styles).toContain('min-width: 320px');
  });
});
