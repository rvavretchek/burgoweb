import axe from "axe-core";

// Cypress exposes Mocha's `it`; this alias preserves the workflow's literal
// `test()` RED-phase contract without adding another test dependency.
const test = it;

const tenantId = "11111111-1111-4111-8111-111111111111";
const assignmentId = "55555555-5555-4555-8555-555555555555";
const peopleUrl = `/condominios/${tenantId}/pessoas`;
const rolesApi = `**/api/v1/tenants/${tenantId}/role-assignments`;
const person = {
  publicId: "22222222-2222-4222-8222-222222222222",
  fullName: "Ana Lima",
};
const relationship = {
  publicId: "44444444-4444-4444-8444-444444444444",
  personPublicId: person.publicId,
  state: "active",
  relationKind: "Moradora · Unidade 101",
  label: "Moradora · Unidade 101",
};
const assignment = {
  publicId: assignmentId,
  personPublicId: person.publicId,
  relationshipPublicId: relationship.publicId,
  role: "administrative-assistant",
  scope: { type: "tenant" },
  validFrom: "2026-08-10T12:00:00-03:00",
  validUntil: null,
  state: "active",
  version: 1,
};

function interceptShell() {
  cy.intercept("GET", "**/api/v1/auth/session", {
    body: { authenticated: true, csrfToken: "csrf" },
  }).as("session");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/dashboard`, {
    body: {
      condominium: {
        publicId: tenantId,
        displayName: "Residencial Sol",
        timeZone: "America/Sao_Paulo",
      },
      state: "ready",
      actions: ["manage_roles"],
    },
  }).as("dashboard");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/people*`, {
    body: { items: [person] },
  }).as("people");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/units*`, {
    body: { items: [] },
  }).as("units");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/relationships*`, {
    body: { items: [relationship] },
  }).as("relationships");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/invitations*`, {
    body: { items: [] },
  }).as("invitations");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/capability-grants*`, {
    body: { items: [], catalog: [] },
  }).as("capabilityGrants");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/financial-responsibles*`, {
    body: { items: [], viewerCapabilities: [] },
  }).as("financialResponsibles");
}

const actorPersonId = "66666666-6666-4666-8666-666666666666";
const syndicCapabilities = [
  "roles.read",
  "roles.preview",
  "roles.grant",
  "roles.suspend",
  "roles.restore",
  "roles.revoke",
];

function visitWithRoles(response) {
  interceptShell();
  cy.intercept("GET", `${rolesApi}*`, {
    ...response,
    body: {
      viewerPersonPublicId: actorPersonId,
      viewerCapabilities: syndicCapabilities,
      ...response.body,
    },
  }).as("roleAssignments");
  cy.visit(peopleUrl);
  cy.wait("@roleAssignments");
}

function getNamedControl(name) {
  return cy.get(`[aria-label=\"${name}\"], [name=\"${name}\"]`).last();
}

function assertNoSeriousAxeViolations() {
  cy.window().then(async (win) => {
    win.eval(
      `var exports={};var module={exports:exports};${axe.source};window.axe=module.exports;`,
    );
    const result = await win.axe.run(win.document, {
      runOnly: {
        type: "tag",
        values: ["wcag2a", "wcag2aa", "wcag21aa", "wcag22aa"],
      },
    });
    expect(
      result.violations.filter(
        ({ impact }) => impact === "critical" || impact === "serious",
      ),
    ).to.deep.equal([]);
  });
}

describe("Story 1.8 — ciclo de vida de Papéis (ATDD)", () => {
  test("[P0] revisa e concede Papel com contexto, alcance, vigência e efeitos explícitos", () => {
    cy.intercept("POST", `${rolesApi}/preview`, (request) =>
      request.reply({
        body: {
          ...request.body,
          personName: person.fullName,
          relationshipLabel: relationship.label,
          condominiumName: "Residencial Sol",
          timeZone: "America/Sao_Paulo",
          accessEffects: ["Suspender Papéis subordinados"],
          excludedConcepts: [
            "Responsável Financeiro",
            "Contato de Continuidade",
          ],
        },
      }),
    ).as("previewRole");
    cy.intercept("POST", rolesApi, { statusCode: 201, body: assignment }).as(
      "grantRole",
    );
    visitWithRoles({ body: { items: [] } });

    cy.contains("button", "Conceder Papel").click();
    getNamedControl("personPublicId").select(person.publicId);
    getNamedControl("relationshipPublicId").select(relationship.publicId);
    getNamedControl("role").select("administrative-assistant");
    getNamedControl("validFrom").type("2026-08-10T12:00");
    cy.contains("button", "Revisar concessão").click();
    cy.wait("@previewRole")
      .its("request.body")
      .should("include", { role: "administrative-assistant" });
    cy.get('[role=\"dialog\"]')
      .should("have.attr", "aria-label", "Revisar concessão de Papel")
      .within(() => {
        cy.contains("Ana Lima").should("be.visible");
        cy.contains("Moradora · Unidade 101").should("be.visible");
        cy.contains("Papel institucional").should("be.visible");
        cy.contains("Capacidade delegada").should("be.visible");
        cy.contains("Responsável Financeiro").should("be.visible");
        cy.contains("Contato de Continuidade").should("be.visible");
        cy.contains(
          "button",
          "Confirmar concessão de Papel no Residencial Sol",
        ).click();
      });
    cy.wait("@grantRole");
    cy.get('[role=\"status\"]').should("contain.text", "Papel concedido");
  });

  test("[P0] preserva o formulário, anuncia validação e move foco para horário civil inválido", () => {
    cy.intercept("POST", `${rolesApi}/preview`, {
      statusCode: 422,
      body: {
        type: "invalid-local-time",
        title: "Horário local inválido",
        status: 422,
        detail: "Informe um offset explícito ou escolha outro horário.",
        errors: { validFrom: ["Horário inexistente em America/Sao_Paulo"] },
      },
    }).as("invalidTime");
    visitWithRoles({ body: { items: [] } });

    cy.contains("button", "Conceder Papel").click();
    getNamedControl("personPublicId").select(person.publicId);
    getNamedControl("relationshipPublicId").select(relationship.publicId);
    getNamedControl("role").select("resident");
    getNamedControl("validFrom").type("2026-10-18T00:30");
    cy.contains("button", "Revisar concessão").click();
    cy.wait("@invalidTime");
    cy.get('[role=\"alert\"]').should(
      "contain.text",
      "Informe um offset explícito",
    );
    getNamedControl("validFrom")
      .should("have.value", "2026-10-18T00:30")
      .and("be.focused");
  });

  test("[P0] cobre suspensão, restauração e revogação com confirmações específicas", () => {
    cy.intercept("POST", `${rolesApi}/${assignmentId}/suspend`, {
      body: { ...assignment, state: "suspended", version: 2 },
    }).as("suspendRole");
    cy.intercept("POST", `${rolesApi}/${assignmentId}/restore`, {
      body: { ...assignment, version: 3 },
    }).as("restoreRole");
    cy.intercept("POST", `${rolesApi}/${assignmentId}/revoke`, {
      body: { ...assignment, state: "revoked", version: 4 },
    }).as("revokeRole");
    visitWithRoles({ body: { items: [assignment] } });

    cy.contains("button", "Suspender Papel de Ana Lima").click();
    getNamedControl("suspensionReason").type(
      "Interrupção emergencial de acesso",
    );
    cy.contains("button", "Confirmar suspensão de Papel").click();
    cy.wait("@suspendRole")
      .its("request.body")
      .should("include", { expectedVersion: 1 });
    cy.contains("Suspenso").should("be.visible");

    cy.contains("button", "Restaurar Papel de Ana Lima").click();
    cy.contains("nova autenticação").should("be.visible");
    cy.contains("button", "Confirmar restauração de Papel").click();
    cy.wait("@restoreRole")
      .its("request.body")
      .should("include", { expectedVersion: 2 });

    cy.contains("button", "Revogar Papel de Ana Lima").click();
    cy.contains("button", "Confirmar revogação permanente").should(
      "be.disabled",
    );
    getNamedControl("revocationReason").type(
      "Encerramento da função institucional",
    );
    cy.contains("button", "Confirmar revogação permanente").click();
    cy.wait("@revokeRole")
      .its("request.body")
      .should("include", { expectedVersion: 3 });
    cy.contains("Revogado").should("be.visible");
  });

  test("[P0] preserva intenção e foco quando a versão concorrente causa conflito", () => {
    cy.intercept("POST", `${rolesApi}/${assignmentId}/suspend`, {
      statusCode: 409,
      body: {
        type: "conflict",
        title: "Papel alterado",
        status: 409,
        detail: "Revise o estado atual.",
        current: { publicId: assignmentId, state: "revoked", version: 2 },
      },
    }).as("roleConflict");
    visitWithRoles({ body: { items: [assignment] } });

    cy.contains("button", "Suspender Papel de Ana Lima").click();
    getNamedControl("suspensionReason").type("Motivo preservado para revisão");
    cy.contains("button", "Confirmar suspensão de Papel").click();
    cy.wait("@roleConflict");
    cy.get('[role=\"alert\"]')
      .should("contain.text", "Revise o estado atual")
      .and("be.focused");
    getNamedControl("suspensionReason").should(
      "have.value",
      "Motivo preservado para revisão",
    );
    cy.contains("Revogado").should("be.visible");
  });

  test("[P0] remove conteúdo sensível após perda concorrente de acesso", () => {
    cy.intercept("POST", `${rolesApi}/${assignmentId}/suspend`, {
      statusCode: 403,
      body: {
        type: "forbidden",
        title: "Acesso indisponível",
        status: 403,
        detail: "Não foi possível concluir esta ação.",
      },
    }).as("accessLost");
    visitWithRoles({ body: { items: [assignment] } });

    cy.contains("button", "Suspender Papel de Ana Lima").click();
    getNamedControl("suspensionReason").type(
      "Texto restrito que deve desaparecer",
    );
    cy.contains("button", "Confirmar suspensão de Papel").click();
    cy.wait("@accessLost");
    cy.url().should("not.include", "/pessoas");
    cy.title().should("not.contain", "Papéis");
    cy.get("body")
      .should("not.contain.text", "Ana Lima")
      .and("not.contain.text", "Texto restrito que deve desaparecer");
    cy.get('[role=\"alert\"]')
      .should("have.length", 1)
      .and("contain.text", "Não foi possível concluir esta ação.");
  });

  test("[P1] apresenta estados vazio e carregando com anúncio acessível", () => {
    interceptShell();
    cy.intercept("GET", `${rolesApi}*`, (request) => {
      request.on("response", (response) => response.setDelay(500));
      request.reply({ body: { items: [] } });
    }).as("emptyRoles");
    cy.visit(peopleUrl);
    cy.get('[role=\"status\"]').should("contain.text", "Carregando Papéis");
    cy.wait("@emptyRoles");
    cy.contains("Nenhum Papel atribuído").should("be.visible");
    cy.contains("button", "Conceder Papel").should("be.visible");
  });

  test("[P1] distingue acesso negado, indisponibilidade e offline com recuperação", () => {
    interceptShell();
    cy.intercept("GET", `${rolesApi}*`, {
      statusCode: 403,
      body: { type: "forbidden", title: "Acesso negado", status: 403 },
    }).as("deniedRoles");
    cy.visit(peopleUrl);
    cy.wait("@deniedRoles");
    cy.get('[role=\"alert\"]').should("contain.text", "Acesso negado");

    cy.intercept("GET", `${rolesApi}*`, {
      statusCode: 503,
      body: { type: "unavailable", title: "Serviço indisponível", status: 503 },
    }).as("unavailableRoles");
    cy.reload();
    cy.wait("@unavailableRoles");
    cy.get('[role=\"alert\"]').should("contain.text", "Serviço indisponível");
    cy.contains("button", "Tentar novamente").should("be.visible");

    cy.intercept("GET", `${rolesApi}*`, { forceNetworkError: true }).as(
      "offlineRoles",
    );
    cy.reload();
    cy.wait("@offlineRoles");
    cy.get('[role=\"alert\"]').should("contain.text", "Você está offline");
    cy.contains("button", "Tentar novamente").should("be.visible");
  });

  test("[P1] mantém foco e operação completa por teclado", () => {
    visitWithRoles({ body: { items: [assignment] } });
    cy.contains("button", "Suspender Papel de Ana Lima")
      .focus()
      .type("{enter}");
    cy.get('[role=\"dialog\"]').should("be.visible");
    getNamedControl("suspensionReason")
      .should("be.focused")
      .type("Suspensão operada por teclado");
    cy.get("body").type("{esc}");
    cy.get('[role=\"dialog\"]').should("not.exist");
    cy.contains("button", "Suspender Papel de Ana Lima").should("be.focused");
  });

  test("[P1] suporta reflow em 320 px, zoom de 200%, estados textuais e axe", () => {
    const states = [
      "scheduled",
      "active",
      "suspended",
      "expired",
      "revoked",
    ].map((state, index) => ({
      ...assignment,
      publicId: `55555555-5555-4555-8555-55555555555${index}`,
      state,
      version: index + 1,
    }));
    cy.viewport(320, 800);
    visitWithRoles({ body: { items: states } });
    cy.document().then((document) => {
      document.documentElement.style.zoom = "2";
    });
    cy.contains("h1, h2", "Papéis e acesso").should("be.visible");
    ["Agendado", "Ativo", "Suspenso", "Expirado", "Revogado"].forEach((label) =>
      cy.contains(label).should("be.visible"),
    );
    cy.document().then((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(640),
    );
    assertNoSeriousAxeViolations();
  });
});
