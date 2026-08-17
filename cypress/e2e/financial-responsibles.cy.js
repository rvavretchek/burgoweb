import axe from "axe-core";

const test = it;

const tenantId = "11111111-1111-4111-8111-111111111111";
const assignmentId = "77777777-7777-4777-8777-777777777777";
const peopleUrl = `/condominios/${tenantId}/pessoas`;
const financialResponsiblesApi = `**/api/v1/tenants/${tenantId}/financial-responsibles`;

const beneficiary = {
  publicId: "22222222-2222-4222-8222-222222222222",
  fullName: "Ana Lima",
};
const unit = {
  publicId: "33333333-3333-4333-8333-333333333333",
  identifier: "101",
  state: "active",
  version: 1,
};
const assignment = {
  publicId: assignmentId,
  personPublicId: beneficiary.publicId,
  unitPublicId: unit.publicId,
  relationshipPublicId: "88888888-8888-4888-8888-888888888888",
  validFrom: "2026-08-10T12:00:00Z",
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
      actions: [],
    },
  }).as("dashboard");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/people*`, {
    body: { items: [beneficiary] },
  }).as("people");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/units*`, {
    body: { items: [unit] },
  }).as("units");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/relationships*`, {
    body: { items: [] },
  }).as("relationships");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/invitations*`, {
    body: { items: [] },
  }).as("invitations");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/role-assignments*`, {
    body: {
      items: [],
      viewerPersonPublicId: "66666666-6666-4666-8666-666666666666",
      viewerCapabilities: ["roles.read"],
    },
  }).as("roleAssignments");
  cy.intercept("GET", `**/api/v1/tenants/${tenantId}/capability-grants*`, {
    body: { items: [], catalog: [] },
  }).as("capabilityGrants");
}

function visitWithFinancialResponsibles(items, viewerCapabilities = ["financial-responsibles.manage"]) {
  interceptShell();
  cy.intercept("GET", `${financialResponsiblesApi}*`, {
    body: { items, viewerCapabilities },
  }).as("financialResponsibles");
  cy.visit(peopleUrl);
  cy.wait("@roleAssignments");
  cy.wait("@capabilityGrants");
  cy.wait("@financialResponsibles");
}

function getNamedControl(name) {
  return cy.get(`[aria-label="${name}"], [name="${name}"]`).last();
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

describe("Story 1.10 — atribuição de Responsáveis Financeiros por Unidade", () => {
  test("[P0] revisa e atribui Responsável Financeiro com alcance explícito antes de confirmar", () => {
    cy.intercept("POST", financialResponsiblesApi, {
      statusCode: 201,
      body: assignment,
    }).as("assignFinancialResponsible");
    visitWithFinancialResponsibles([]);

    cy.contains("button", "Atribuir Responsável Financeiro").click();
    getNamedControl("personPublicId").select(beneficiary.publicId);
    getNamedControl("unitPublicId").select(unit.publicId);
    getNamedControl("validFrom").type("2026-08-11T09:00");
    cy.contains("button", "Revisar atribuição").click();
    cy.get('[role="dialog"]')
      .should("have.attr", "aria-label", "Revisar atribuição de Responsável Financeiro")
      .within(() => {
        cy.contains("Ana Lima").should("be.visible");
        cy.contains("101").should("be.visible");
        cy.contains("O que passa a permitir").should("be.visible");
        cy.contains("O que continua negado").should("be.visible");
        cy.contains("button", "Confirmar atribuição").click();
      });
    cy.wait("@assignFinancialResponsible");
    cy.get('[role="status"]').should(
      "contain.text",
      "Responsável Financeiro atribuído",
    );
  });

  test("[P0] remove Responsável Financeiro com confirmação nomeando Pessoa e Unidade", () => {
    cy.intercept("POST", `${financialResponsiblesApi}/${assignmentId}/remove`, {
      body: { ...assignment, state: "revoked", version: 2 },
    }).as("removeFinancialResponsible");
    visitWithFinancialResponsibles([assignment]);

    cy.contains("button", "Remover Responsável Financeiro de Ana Lima").click();
    cy.get('[role="dialog"]').within(() => {
      cy.contains("Remover Responsável Financeiro").should("be.visible");
      cy.contains("deixará de ser").should("be.visible");
      cy.contains("button", "Confirmar remoção").click();
    });
    cy.wait("@removeFinancialResponsible")
      .its("request.body")
      .should("include", { expectedVersion: 1 });
    cy.contains("Removido").should("be.visible");
  });

  test("[P1] preserva intenção quando a versão concorrente causa conflito", () => {
    cy.intercept("POST", `${financialResponsiblesApi}/${assignmentId}/remove`, {
      statusCode: 409,
      body: {
        type: "conflict",
        title: "Atribuição alterada",
        status: 409,
        detail: "Revise o estado atual.",
        current: { publicId: assignmentId, state: "revoked", version: 2 },
      },
    }).as("financialResponsibleConflict");
    visitWithFinancialResponsibles([assignment]);

    cy.contains("button", "Remover Responsável Financeiro de Ana Lima").click();
    cy.contains("button", "Confirmar remoção").click();
    cy.wait("@financialResponsibleConflict");
    cy.get('[role="alert"]')
      .should("contain.text", "Revise o estado atual")
      .and("be.focused");
    cy.contains("Removido").should("be.visible");
  });

  test("[P1] remove conteúdo sensível após perda concorrente de acesso", () => {
    cy.intercept("POST", `${financialResponsiblesApi}/${assignmentId}/remove`, {
      statusCode: 403,
      body: {
        type: "forbidden",
        title: "Acesso indisponível",
        status: 403,
        detail: "Não foi possível concluir esta ação.",
      },
    }).as("accessLost");
    visitWithFinancialResponsibles([assignment]);

    cy.contains("button", "Remover Responsável Financeiro de Ana Lima").click();
    cy.contains("button", "Confirmar remoção").click();
    cy.wait("@accessLost");
    cy.url().should("not.include", "/pessoas");
    cy.get("body").should("not.contain.text", "Ana Lima");
  });

  test("[P0] Pessoa sem financial-responsibles.manage vê somente as próprias atribuições, sem ações de gestão", () => {
    visitWithFinancialResponsibles([assignment], ["dashboard.read"]);
    cy.contains(
      "Você está vendo somente suas próprias atribuições de Responsável Financeiro.",
    ).should("be.visible");
    cy.contains("button", "Atribuir Responsável Financeiro").should("not.exist");
    cy.contains("button", "Remover Responsável Financeiro de Ana Lima").should(
      "not.exist",
    );
  });

  test("[P1] mantém foco e operação completa por teclado", () => {
    visitWithFinancialResponsibles([assignment]);
    cy.contains("button", "Remover Responsável Financeiro de Ana Lima").focus();
    cy.get("body").type("{esc}");
    cy.contains("button", "Atribuir Responsável Financeiro")
      .focus()
      .type("{enter}");
    cy.get('[role="dialog"]').should("be.visible");
    cy.get("body").type("{esc}");
    cy.get('[role="dialog"]').should("not.exist");
  });

  test("[P1] suporta reflow em 320 px e não tem violações axe críticas", () => {
    cy.viewport(320, 800);
    visitWithFinancialResponsibles([assignment]);
    cy.contains("h2", "Responsáveis Financeiros").should("be.visible");
    cy.document().then((document) =>
      expect(document.documentElement.scrollWidth).to.be.at.most(640),
    );
    assertNoSeriousAxeViolations();
  });
});
