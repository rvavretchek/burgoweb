describe('entrada pública do Burgoweb', () => {
  for (const viewport of [[1280, 800], [375, 667]]) {
    it(`apresenta a landing e navega sem mutação em ${viewport[0]}px`, () => {
      cy.viewport(...viewport);
      const mutations = [];
      cy.intercept({ method: /POST|PUT|PATCH|DELETE/, url: '**' }, (request) => {
        mutations.push(`${request.method} ${request.url}`);
      });
      cy.visit('/');
      cy.get('html').should('have.attr', 'lang', 'pt-BR');
      cy.get('h1').should('have.length', 1).and('contain', 'Seu condomínio organizado');
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.press(Cypress.Keyboard.Keys.TAB);
      cy.focused().should('contain', 'Utilize gratuitamente');
      cy.press(Cypress.Keyboard.Keys.ENTER);
      cy.location('pathname').should('eq', '/comecar');
      cy.contains('Nada foi criado ainda.').should('be.visible');
      cy.then(() => expect(mutations).to.deep.equal([]));
    });
  }

  it('permite acesso direto ao começo sem sessão', () => {
    cy.visit('/comecar');
    cy.contains('h1', 'Crie sua Conta e seu Condomínio').should('be.visible');
    cy.contains('Chegar a esta página não cria Conta').should('be.visible');
  });

  it('hidrata sem mismatch e mantém a navegação interativa', () => {
    const hydrationErrors = [];
    cy.visit('/', {
      onBeforeLoad(window) {
        cy.stub(window.console, 'error').callsFake((...args) => {
          if (args.join(' ').toLowerCase().includes('hydration')) hydrationErrors.push(args);
        });
      },
    });
    cy.contains('a', 'Utilize gratuitamente').should('have.attr', 'aria-disabled', 'false').click();
    cy.location('pathname').should('eq', '/comecar');
    cy.then(() => expect(hydrationErrors).to.deep.equal([]));
  });

  it('não possui violações WCAG 2.2 AA detectáveis pelo axe', () => {
    cy.visit('/');
    cy.readFile('node_modules/axe-core/axe.min.js').then((axeSource) => {
      cy.window().then((window) => {
        window.eval(axeSource);
        return window.axe.run(window.document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } });
      }).then(({ violations }) => {
        expect(violations, violations.map(({ id, nodes }) => `${id}: ${nodes.length}`).join('\n')).to.deep.equal([]);
      });
    });
  });

  it('distingue indisponibilidade e recuperação sem falso sucesso', () => {
    cy.visit('/');
    cy.window().then((window) => {
      Object.defineProperty(window.navigator, 'onLine', { value: false, configurable: true });
      window.dispatchEvent(new Event('offline'));
    });
    cy.contains('Você está sem conexão').should('be.visible');
    cy.contains('a', 'Utilize gratuitamente').click();
    cy.location('pathname').should('eq', '/');
    cy.contains('a', 'Utilize gratuitamente').should('have.attr', 'aria-disabled', 'true');

    cy.window().then((window) => {
      Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
      window.dispatchEvent(new Event('online'));
    });
    cy.contains('Você está sem conexão').should('not.exist');
    cy.contains('a', 'Utilize gratuitamente').click();
    cy.location('pathname').should('eq', '/comecar');
  });

  function fillOnboarding({ declaration = true } = {}) {
    cy.window().then((window) => {
      Object.defineProperty(window.navigator, 'onLine', { value: true, configurable: true });
    });
    cy.get('#fullName').type('Ana Silva');
    cy.get('#email').type('ana@example.com');
    cy.get('#condominiumName').type('Residencial Sol');
    cy.get('#password').type('uma senha longa e segura', { log: false });
    cy.get('#confirmPassword').type('uma senha longa e segura', { log: false });
    if (declaration) cy.get('#authorityDeclarationAccepted').check();
  }

  it('não envia sem declaração, preserva valores e move foco ao resumo', () => {
    let requests = 0;
    cy.intercept('POST', '**/api/v1/provisioning/condominiums', () => { requests += 1; });
    cy.visit('/comecar'); fillOnboarding({ declaration: false });
    cy.contains('button', 'Criar solicitação pendente').click();
    cy.focused().should('have.class', 'error-summary');
    cy.contains('Confirme a declaração obrigatória.').should('be.visible');
    cy.get('#fullName').should('have.value', 'Ana Silva');
    cy.then(() => expect(requests).to.eq(0));
  });

  it('bloqueia duplo envio e apresenta apenas pendência sem acesso interno', () => {
    let requests = 0;
    cy.intercept('POST', '**/api/v1/provisioning/condominiums', (request) => {
      requests += 1;
      request.reply({ delay: 150, statusCode: 202, body: { requestId: 'request-publico', publicCondominiumId: 'condominio-publico', state: 'pending-email-verification', message: 'Solicitação registrada e pendente.' } });
    }).as('createPending');
    cy.visit('/comecar'); fillOnboarding();
    cy.contains('button', 'Criar solicitação pendente').click().click({ force: true });
    cy.wait('@createPending');
    cy.contains('h1', 'Solicitação pendente').should('be.visible');
    cy.contains('O acesso interno continuará bloqueado').should('be.visible');
    cy.contains(/painel|acessar condomínio/i).should('not.exist');
    cy.then(() => expect(requests).to.eq(1));
  });

  it('retoma rede incerta com a mesma chave idempotente', () => {
    const keys = [];
    let attempt = 0;
    cy.intercept('POST', '**/api/v1/provisioning/condominiums', (request) => {
      keys.push(request.headers['idempotency-key']); attempt += 1;
      if (attempt === 1) request.reply({ statusCode: 503, headers: { 'content-type': 'application/problem+json' }, body: { type: 'network-uncertain', title: 'Não foi possível confirmar a solicitação', status: 503, detail: 'A conexão foi interrompida.' } });
      else request.reply({ statusCode: 202, body: { requestId: 'retomada', publicCondominiumId: 'publico', state: 'pending-email-verification', message: 'Solicitação pendente.' } });
    }).as('uncertainRequest');
    cy.visit('/comecar'); fillOnboarding();
    cy.contains('button', 'Criar solicitação pendente').click();
    cy.wait('@uncertainRequest');
    cy.contains('button', 'Tentar novamente com a mesma solicitação').click();
    cy.wait('@uncertainRequest');
    cy.contains('h1', 'Solicitação retomada e pendente').should('be.visible');
    cy.then(() => expect(keys[1]).to.eq(keys[0]));
  });

  it('distingue conflito e falha parcial com próxima ação segura', () => {
    cy.intercept('POST', '**/api/v1/provisioning/condominiums', { statusCode: 409, headers: { 'content-type': 'application/problem+json' }, body: { type: 'idempotency-conflict', title: 'Conflito de idempotência', status: 409, detail: 'A solicitação mudou.', requestId: 'referencia' } }).as('conflict');
    cy.visit('/comecar'); fillOnboarding(); cy.contains('button', 'Criar solicitação pendente').click(); cy.wait('@conflict');
    cy.contains('Conflito de idempotência').should('be.visible');
    cy.contains('button', 'Iniciar uma nova tentativa').should('be.visible');
  });

  it('não possui violações axe detectáveis no formulário em 320px', () => {
    cy.viewport(320, 800); cy.visit('/comecar');
    cy.readFile('node_modules/axe-core/axe.min.js').then((axeSource) => cy.window().then((window) => { window.eval(axeSource); return window.axe.run(window.document, { runOnly: { type: 'tag', values: ['wcag2a', 'wcag2aa', 'wcag21aa', 'wcag22aa'] } }); })).then(({ violations }) => expect(violations, JSON.stringify(violations)).to.deep.equal([]));
  });

  it('abrir o link não ativa; remove o fragmento e exige confirmação explícita', () => {
    let confirms = 0;
    cy.intercept('POST', '**/api/v1/email-verifications/confirm', (request) => { confirms += 1; expect(request.body).to.deep.equal({ token: 'a'.repeat(43) }); request.reply({ statusCode: 200, body: { state: 'activated', message: 'Canal confirmado.' } }); }).as('confirmEmail');
    cy.visit(`/verificar-email#token=${'a'.repeat(43)}`);
    cy.location('hash').should('eq', ''); cy.then(() => expect(confirms).to.eq(0));
    cy.contains('button', 'Confirmar meu e-mail').then(($button) => { $button[0].click(); $button[0].click(); }); cy.wait('@confirmEmail');
    cy.contains('E-mail confirmado').should('be.visible'); cy.contains('não certifica identidade civil').should('be.visible'); cy.then(() => expect(confirms).to.eq(1));
  });

  it('apresenta token indisponível uniforme e reenvio neutro em 320px', () => {
    cy.viewport(320, 800);
    cy.intercept('POST', '**/api/v1/email-verifications/confirm', { statusCode: 410, headers: { 'content-type': 'application/problem+json' }, body: { type: 'verification-unavailable', title: 'Verificação indisponível', status: 410, detail: 'Solicite um novo e-mail.' } }).as('gone');
    cy.intercept('POST', '**/api/v1/email-verifications/resend', { statusCode: 202, body: { state: 'pending', message: 'Se houver solicitação elegível, uma nova verificação será preparada.' } }).as('resend');
    cy.visit(`/verificar-email#token=${'b'.repeat(43)}`); cy.contains('button', 'Confirmar meu e-mail').click(); cy.wait('@gone'); cy.contains('Este link não está disponível').should('be.visible');
    cy.get('#requestId').type('018f47d2-8287-7d8a-9000-111111111111'); cy.get('#verificationEmail').type('ana@example.com'); cy.contains('button', 'Enviar outro e-mail de verificação').click(); cy.wait('@resend'); cy.contains('Se houver solicitação elegível').should('be.visible');
  });
});
