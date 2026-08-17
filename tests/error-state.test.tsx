import { act } from 'react';
import { createRoot } from 'react-dom/client';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { SafeErrorPanel } from '../apps/web/src/routes/__root';

describe('estado seguro de erro', () => {
  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('informa indisponibilidade sem detalhes internos e permite retry', async () => {
    const onRetry = vi.fn();
    const host = document.createElement('div');
    document.body.append(host);
    const root = createRoot(host);

    await act(async () => root.render(<SafeErrorPanel onRetry={onRetry} />));

    expect(host.textContent).toContain('Não foi possível abrir esta página');
    expect(host.textContent).toContain('Nenhuma informação foi criada');
    expect(host.textContent).not.toMatch(/stack|exception|configuração interna/i);

    const retry = host.querySelector('button');
    expect(retry?.textContent).toBe('Tentar novamente');
    await act(async () => retry?.click());
    expect(onRetry).toHaveBeenCalledOnce();

    await act(async () => root.unmount());
  });
});
