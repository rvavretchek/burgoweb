# Story 1.6 — checklist manual de acessibilidade

Registre data, navegador/SO, tecnologia assistiva, viewport e resultado. Falhas reabrem a Story 1.6.

- [ ] Teclado: ordem lógica, foco visível, controles operáveis e nenhuma armadilha fora do modal.
- [ ] Diálogo: foco inicial em **Manter Vínculo**, Tab/Shift+Tab confinados, Escape fecha, foco retorna ao gatilho e erro recebe foco.
- [ ] Leitor de tela: H1/landmarks, labels/ajuda/erros e estados anunciados sem repetição.
- [ ] Zoom 200% em desktop sem perda de conteúdo ou ação.
- [ ] Reflow 320 CSS px / 400% sem scroll horizontal da página.
- [ ] Text spacing WCAG sem corte ou sobreposição.
- [ ] `forced-colors`: foco, bordas, estados e controles distinguíveis.
- [ ] `prefers-reduced-motion`: nenhum movimento indispensável ou inesperado.
- [ ] Mobile portrait/landscape e teclado virtual: campos, mensagens e ações visíveis.
- [ ] Offline/rede incerta: entrada e Idempotency-Key preservadas; sem falso sucesso.
- [ ] Troca de tenant durante requests: nenhum dado, contagem, seleção ou title anterior reaparece.
