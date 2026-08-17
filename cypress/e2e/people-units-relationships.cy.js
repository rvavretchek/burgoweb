describe("Pessoas e acesso", () => {
  const tenant = "11111111-1111-4111-8111-111111111111";
  const person = {
    publicId: "22222222-2222-4222-8222-222222222222",
    fullName: "Ana Lima",
    email: "ana@example.com",
    state: "active",
    version: 1,
  };
  const unit = {
    publicId: "33333333-3333-4333-8333-333333333333",
    identifier: "Casa 01",
    state: "active",
    version: 1,
  };
  const relationship = {
    publicId: "44444444-4444-4444-8444-444444444444",
    personPublicId: person.publicId,
    unitPublicId: unit.publicId,
    relationKind: "Morador",
    startsOn: "2026-08-01",
    state: "active",
    version: 1,
  };

  function mount(
    records = {
      people: [person],
      units: [unit],
      relationships: [relationship],
    },
  ) {
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/dashboard`, {
      statusCode: 200,
      body: {
        condominium: { publicId: tenant, displayName: "Residencial Sol" },
        state: "empty",
        actions: [],
      },
    });
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/people`, (request) =>
      request.reply({ statusCode: 200, body: { items: records.people } }),
    );
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/units`, (request) =>
      request.reply({ statusCode: 200, body: { items: records.units } }),
    );
    cy.intercept(
      "GET",
      `**/api/v1/tenants/${tenant}/relationships`,
      (request) =>
        request.reply({
          statusCode: 200,
          body: { items: records.relationships },
        }),
    );
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/invitations*`, {
      statusCode: 200,
      body: { items: [] },
    });
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/role-assignments*`, {
      statusCode: 200,
      body: { items: [] },
    });
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/capability-grants*`, {
      statusCode: 200,
      body: { items: [], catalog: [] },
    });
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/financial-responsibles*`, {
      statusCode: 200,
      body: { items: [], viewerCapabilities: [] },
    });
    cy.intercept("GET", "**/api/v1/auth/session", {
      statusCode: 200,
      body: { authenticated: true, csrfToken: "fresh-csrf" },
    });
    cy.visit(`/condominios/${tenant}/pessoas`);
  }

  it("cadastra, lista e impede duplo envio", () => {
    const records = { people: [], units: [], relationships: [] };
    let calls = 0;
    cy.intercept("POST", `**/api/v1/tenants/${tenant}/people`, (request) => {
      calls++;
      records.people.push(person);
      request.reply({ statusCode: 201, body: person });
    }).as("createPerson");
    mount(records);
    cy.get("#person-name").type("Ana Lima");
    cy.get("#person-email").type("ana@example.com");
    cy.contains("button", "Cadastrar Pessoa").dblclick();
    cy.wait("@createPerson");
    cy.then(() => expect(calls).to.equal(1));
    cy.contains("Cadastro salvo com sucesso");
    cy.contains("th", "Ana Lima");
  });

  it("oferece associação explícita quando encontra duplicidade", () => {
    cy.intercept("POST", `**/api/v1/tenants/${tenant}/people`, {
      statusCode: 409,
      body: {
        type: "conflict",
        title: "Duplicidade",
        status: 409,
        detail: "Possível duplicidade",
        current: { candidate: person },
      },
    });
    mount();
    cy.get("#person-name").type("Ana repetida");
    cy.get("#person-email").type("ana@example.com");
    cy.contains("button", "Cadastrar Pessoa").click();
    cy.contains("Cadastro autorizado encontrado:").should(
      "contain.text",
      "Ana Lima",
    );
    cy.contains("Esta escolha não cria Conta, Papel, Convite ou acesso");
    cy.contains("button", "Associar ao cadastro existente").click();
    cy.get("#rel-person").should("have.value", person.publicId);
  });

  it("edita e resolve conflito 409 preservando a entrada", () => {
    let patches = 0;
    cy.intercept(
      "PATCH",
      `**/api/v1/tenants/${tenant}/people/${person.publicId}`,
      (request) => {
        patches++;
        if (patches === 1)
          request.reply({
            statusCode: 409,
            body: {
              type: "conflict",
              title: "Mudou",
              status: 409,
              detail: "O registro mudou.",
              current: { ...person, fullName: "Ana Servidor", version: 2 },
            },
          });
        else
          request.reply({
            statusCode: 200,
            body: { ...person, fullName: request.body.fullName, version: 3 },
          });
      },
    ).as("updatePerson");
    mount();
    cy.contains("button", "Editar Pessoa").click();
    cy.get('.inline-editor input[name="fullName"]').clear().type("Ana Local");
    cy.contains("button", "Salvar Pessoa").click();
    cy.contains("O registro foi alterado");
    cy.get('.inline-editor input[name="fullName"]').should(
      "have.value",
      "Ana Local",
    );
    cy.contains("button", "Reaplicar minha alteração").click();
    cy.contains("button", "Salvar Pessoa").click();
    cy.wait("@updatePerson");
    cy.then(() => expect(patches).to.equal(2));
  });

  it("renova CSRF após 403 e repete a mesma mutação uma vez", () => {
    let posts = 0,
      sessions = 0;
    mount({ people: [], units: [], relationships: [] });
    cy.intercept("GET", "**/api/v1/auth/session", (request) => {
      sessions++;
      request.reply({
        statusCode: 200,
        body: { authenticated: true, csrfToken: `csrf-${sessions}` },
      });
    });
    cy.intercept("POST", `**/api/v1/tenants/${tenant}/units`, (request) => {
      posts++;
      request.reply(
        posts === 1
          ? { statusCode: 403, body: { status: 403, detail: "CSRF expirado" } }
          : { statusCode: 201, body: unit },
      );
    });
    cy.get("#unit-id").type("Casa 01");
    cy.contains("button", "Cadastrar Unidade").click();
    cy.contains("Cadastro salvo com sucesso");
    cy.then(() => {
      expect(posts).to.equal(2);
      expect(sessions).to.be.greaterThan(0);
    });
  });

  it("reutiliza Idempotency-Key após falha de rede incerta", () => {
    const keys = [];
    let attempts = 0;
    cy.intercept("POST", `**/api/v1/tenants/${tenant}/units`, (request) => {
      keys.push(request.headers["idempotency-key"]);
      attempts++;
      if (attempts === 1) request.destroy();
      else request.reply({ statusCode: 201, body: unit });
    });
    mount({ people: [], units: [], relationships: [] });
    cy.get("#unit-id").type("Casa 01");
    cy.contains("button", "Cadastrar Unidade").click();
    cy.contains("Cadastro salvo com sucesso");
    cy.then(() => {
      expect(keys).to.have.length(2);
      expect(keys[1]).to.equal(keys[0]);
    });
  });

  it("edita Unidade e Vínculo e apresenta encerramento contextual", () => {
    cy.intercept(
      "PATCH",
      `**/api/v1/tenants/${tenant}/units/${unit.publicId}`,
      { statusCode: 200, body: { ...unit, identifier: "Casa 02", version: 2 } },
    );
    cy.intercept(
      "PATCH",
      `**/api/v1/tenants/${tenant}/relationships/${relationship.publicId}`,
      {
        statusCode: 200,
        body: { ...relationship, relationKind: "Ocupante", version: 2 },
      },
    );
    mount();
    cy.contains("button", "Editar Unidade").click();
    cy.get('.inline-editor input[name="identifier"]').clear().type("Casa 02");
    cy.contains("button", "Salvar Unidade").click();
    cy.contains("button", "Editar Vínculo").click();
    cy.get('.inline-editor input[name="relationKind"]')
      .clear()
      .type("Ocupante");
    cy.contains("button", "Salvar Vínculo").click();
    cy.contains("button", "Encerrar Vínculo").click();
    cy.get('[role="dialog"]')
      .should("contain.text", "Residencial Sol")
      .and("contain.text", "não é reversível");
  });

  it("não conserva título, contagens ou seleção ao trocar tenant", () => {
    mount();
    cy.title().should("contain", "Residencial Sol");
    cy.contains("Ana Lima");
    const other = "55555555-5555-4555-8555-555555555555";
    cy.intercept("GET", `**/api/v1/tenants/${other}/dashboard`, {
      statusCode: 200,
      body: {
        condominium: { publicId: other, displayName: "Residencial Lua" },
        state: "empty",
        actions: [],
      },
    });
    for (const suffix of ["people", "units", "relationships"])
      cy.intercept("GET", `**/api/v1/tenants/${other}/${suffix}`, {
        statusCode: 200,
        body: { items: [] },
      });
    cy.visit(`/condominios/${other}/pessoas`);
    cy.title()
      .should("contain", "Residencial Lua")
      .and("not.contain", "Residencial Sol");
    cy.contains("Ana Lima").should("not.exist");
    cy.contains("Nenhuma Pessoa, Unidade ou Vínculo");
  });

  it("mantém reflow em 320 CSS px e controles acessíveis", () => {
    mount();
    cy.viewport(320, 800);
    cy.get("main").should("be.visible");
    cy.get(".institutional-grid")
      .should("have.css", "grid-template-columns")
      .and("match", /^\d+px$/);
    cy.get("h1").should("have.length", 1);
    cy.get('label[for="person-name"]').should("be.visible");
  });

  it("percorre cursor e torna registros posteriores à primeira página acessíveis", () => {
    const cursor = "aaaaaaaa-aaaa-4aaa-8aaa-aaaaaaaaaaaa";
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/dashboard`, {
      statusCode: 200,
      body: {
        condominium: { publicId: tenant, displayName: "Residencial Sol" },
        state: "empty",
        actions: [],
      },
    });
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/people*`, (request) =>
      request.reply({
        statusCode: 200,
        body: request.query.cursor
          ? {
              items: [
                {
                  ...person,
                  publicId: "66666666-6666-4666-8666-666666666666",
                  fullName: "Pessoa 51",
                },
              ],
            }
          : { items: [person], nextCursor: cursor },
      }),
    );
    for (const suffix of ["units", "relationships"])
      cy.intercept("GET", `**/api/v1/tenants/${tenant}/${suffix}*`, {
        statusCode: 200,
        body: { items: [] },
      });
    cy.visit(`/condominios/${tenant}/pessoas`);
    cy.contains("Pessoa 51").should("be.visible");
  });

  it("mantém o tenant novo quando a resposta do anterior chega atrasada", () => {
    const other = "55555555-5555-4555-8555-555555555555";
    cy.intercept("GET", `**/api/v1/tenants/${tenant}/dashboard`, (request) =>
      request.reply({
        delay: 800,
        statusCode: 200,
        body: {
          condominium: { publicId: tenant, displayName: "Residencial Sol" },
          state: "empty",
          actions: [],
        },
      }),
    );
    for (const suffix of ["people", "units", "relationships"])
      cy.intercept("GET", `**/api/v1/tenants/${tenant}/${suffix}*`, (request) =>
        request.reply({
          delay: 800,
          statusCode: 200,
          body: { items: suffix === "people" ? [person] : [] },
        }),
      );
    cy.visit(`/condominios/${tenant}/pessoas`);
    cy.intercept("GET", `**/api/v1/tenants/${other}/dashboard`, {
      statusCode: 200,
      body: {
        condominium: { publicId: other, displayName: "Residencial Lua" },
        state: "empty",
        actions: [],
      },
    });
    for (const suffix of ["people", "units", "relationships"])
      cy.intercept("GET", `**/api/v1/tenants/${other}/${suffix}*`, {
        statusCode: 200,
        body: { items: [] },
      });
    cy.visit(`/condominios/${other}/pessoas`);
    cy.wait(900);
    cy.title()
      .should("contain", "Residencial Lua")
      .and("not.contain", "Residencial Sol");
    cy.contains("Ana Lima").should("not.exist");
  });

  it("confina foco no diálogo, fecha por Escape e submete encerramento", () => {
    cy.intercept(
      "POST",
      `**/api/v1/tenants/${tenant}/relationships/${relationship.publicId}/end`,
      {
        statusCode: 200,
        body: {
          ...relationship,
          state: "ended",
          endsOn: "2026-08-31",
          version: 2,
        },
      },
    ).as("endRelationship");
    mount();
    cy.contains("button", "Encerrar Vínculo").click();
    cy.focused().should("contain.text", "Manter Vínculo");
    cy.contains("button", "Confirmar encerramento")
      .focus()
      .trigger("keydown", { key: "Tab" });
    cy.focused().should("have.attr", "name", "effectiveOn");
    cy.document().then((document) =>
      document.dispatchEvent(
        new KeyboardEvent("keydown", { key: "Escape", bubbles: true }),
      ),
    );
    cy.focused().should("contain.text", "Encerrar Vínculo");
    cy.contains("button", "Encerrar Vínculo").click();
    cy.get('[name="effectiveOn"]').type("2026-08-31");
    cy.contains("button", "Confirmar encerramento").click();
    cy.wait("@endRelationship");
  });

  it("permanece utilizável em viewport desktop", () => {
    mount();
    cy.viewport(1280, 800);
    cy.get(".institutional-grid").should("be.visible");
    cy.contains("h2", "Registros institucionais").should("be.visible");
  });

  it("não possui violações WCAG 2.2 AA detectáveis pelo axe", () => {
    mount();
    cy.readFile("node_modules/axe-core/axe.min.js")
      .then((source) =>
        cy.window().then((window) => {
          window.eval(source);
          return window.axe.run(window.document, {
            runOnly: {
              type: "tag",
              values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
            },
          });
        }),
      )
      .then(({ violations }) =>
        expect(violations, JSON.stringify(violations)).to.deep.equal([]),
      );
  });
});
